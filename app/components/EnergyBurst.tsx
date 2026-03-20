"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function EnergyBurst({ progress = 0 }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 6000;

  const { positions, speeds, angles } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const ang = new Float32Array(count * 2);

    for (let i = 0; i < count; i++) {
      // Start at center
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      spd[i] = 0.5 + Math.random() * 3;
      // Random direction on sphere
      ang[i * 2] = Math.random() * Math.PI * 2; // theta
      ang[i * 2 + 1] = Math.acos(2 * Math.random() - 1); // phi
    }
    return { positions: pos, speeds: spd, angles: ang };
  }, []);

  const currentPositions = useRef(new Float32Array(count * 3));

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const arr = currentPositions.current;
    const burstProgress = Math.min(Math.max(progress, 0), 1);

    // Rings rotation
    const ring1 = groupRef.current.children[1] as THREE.Mesh;
    const ring2 = groupRef.current.children[2] as THREE.Mesh;
    const ring3 = groupRef.current.children[3] as THREE.Mesh;
    if (ring1) ring1.rotation.z = t * 0.3;
    if (ring2) ring2.rotation.x = t * 0.2;
    if (ring3) ring3.rotation.y = t * 0.4;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const theta = angles[i * 2];
      const phi = angles[i * 2 + 1];
      const speed = speeds[i];
      const radius = speed * burstProgress * 8;

      // Radial explosion from center
      const wobble = Math.sin(t * 2 + i * 0.1) * 0.2;
      arr[ix] = Math.sin(phi) * Math.cos(theta + wobble * burstProgress) * radius;
      arr[ix + 1] = Math.sin(phi) * Math.sin(theta) * radius;
      arr[ix + 2] = Math.cos(phi + wobble * 0.5 * burstProgress) * radius;

      // Add spiral energy lines for some particles
      if (i % 5 === 0) {
        const spiralAngle = t + i * 0.01;
        arr[ix] += Math.cos(spiralAngle) * burstProgress * 0.5;
        arr[ix + 2] += Math.sin(spiralAngle) * burstProgress * 0.5;
      }
    }

    const pts = groupRef.current.children[0] as THREE.Points;
    if (pts?.geometry) {
      const posAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
      posAttr.array.set(arr);
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[currentPositions.current, 3]}
            attach="attributes-position"
            count={count}
            array={currentPositions.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.03}
          color="#ffffff"
          transparent
          opacity={0.7}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      {/* Orbital rings */}
      <mesh>
        <torusGeometry args={[6, 0.02, 8, 128]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={progress * 0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[8, 0.015, 8, 128]} />
        <meshBasicMaterial color="#8888ff" transparent opacity={progress * 0.3} />
      </mesh>
      <mesh rotation={[0, Math.PI / 4, Math.PI / 6]}>
        <torusGeometry args={[10, 0.01, 8, 128]} />
        <meshBasicMaterial color="#ff8844" transparent opacity={progress * 0.2} />
      </mesh>
      {/* Central void — black sphere */}
      <mesh>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
    </group>
  );
}
