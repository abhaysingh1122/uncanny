"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ParticleVortex({ progress = 0 }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 4000;

  const { positions, velocities, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const siz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 1 + Math.random() * 8;
      const height = (Math.random() - 0.5) * 12;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = height;
      pos[i * 3 + 2] = Math.sin(angle) * radius;
      vel[i * 3] = (Math.random() - 0.5) * 0.02;
      vel[i * 3 + 1] = (Math.random() - 0.5) * 0.01;
      vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
      siz[i] = 0.02 + Math.random() * 0.06;
    }
    return { positions: pos, velocities: vel, sizes: siz };
  }, []);

  const positionsRef = useRef(new Float32Array(positions));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const arr = positionsRef.current;
    const intensity = Math.min(progress * 2, 1);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const x = arr[ix];
      const z = arr[ix + 2];
      const y = arr[ix + 1];

      const dist = Math.sqrt(x * x + z * z);
      const angle = Math.atan2(z, x);
      const speed = (0.3 + intensity * 1.5) / (dist + 0.5);

      const newAngle = angle + speed * 0.016;
      arr[ix] = Math.cos(newAngle) * dist + velocities[ix] * intensity;
      arr[ix + 2] = Math.sin(newAngle) * dist + velocities[ix + 2] * intensity;

      // Pull toward center as intensity increases
      const pull = intensity * 0.002;
      arr[ix] *= (1 - pull);
      arr[ix + 2] *= (1 - pull);

      // Vertical cycling
      arr[ix + 1] += (0.02 + intensity * 0.08) * (y > 0 ? 1 : -1) * (1 - Math.abs(y) / 6);
      if (Math.abs(arr[ix + 1]) > 6) arr[ix + 1] *= 0.98;

      // Re-expand occasionally
      if (dist < 0.3) {
        const newR = 2 + Math.random() * 6;
        const newA = Math.random() * Math.PI * 2;
        arr[ix] = Math.cos(newA) * newR;
        arr[ix + 2] = Math.sin(newA) * newR;
      }
    }

    const geo = groupRef.current.children[0] as THREE.Points;
    if (geo?.geometry) {
      const attr = geo.geometry.getAttribute("position") as THREE.BufferAttribute;
      attr.array.set(arr);
      attr.needsUpdate = true;
    }

    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.scale.setScalar(intensity);
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[positionsRef.current, 3]}
            attach="attributes-position"
            count={count}
            array={positionsRef.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.05}
          color="#aaddff"
          transparent
          opacity={0.8}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Top ring */}
      <mesh position={[0, 5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.03, 8, 64]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={progress * 0.6} />
      </mesh>
      {/* Bottom ring */}
      <mesh position={[0, -5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[4, 0.03, 8, 64]} />
        <meshBasicMaterial color="#4488ff" transparent opacity={progress * 0.6} />
      </mesh>
    </group>
  );
}
