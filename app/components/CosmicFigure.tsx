"use client";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function CosmicFigure({ progress = 0 }: { progress: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const count = 5000;

  const { bodyPositions, scatteredPositions } = useMemo(() => {
    const body = new Float32Array(count * 3);
    const scattered = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      // Human figure shape — head, torso, flowing trails
      const section = Math.random();
      let x, y, z;

      if (section < 0.15) {
        // Head — sphere at top
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const r = 0.8 + Math.random() * 0.3;
        x = Math.sin(phi) * Math.cos(theta) * r;
        y = 5 + Math.sin(phi) * Math.sin(theta) * r;
        z = Math.cos(phi) * r * 0.5;
      } else if (section < 0.45) {
        // Torso — tapered cylinder
        const t = Math.random();
        const w = 1.2 + t * 0.8;
        const angle = Math.random() * Math.PI * 2;
        const r = (Math.random() * 0.5 + 0.2) * w;
        x = Math.cos(angle) * r;
        y = 4 - t * 4;
        z = Math.sin(angle) * r * 0.4;
      } else {
        // Flowing trails downward
        const trail = Math.floor(Math.random() * 6);
        const t = Math.random();
        const baseAngle = (trail / 6) * Math.PI * 2;
        const spread = t * 3;
        x = Math.cos(baseAngle + t * 0.5) * (1 + spread) + (Math.random() - 0.5) * spread;
        y = -t * 8 + (Math.random() - 0.5) * 0.5;
        z = Math.sin(baseAngle + t * 0.5) * (0.5 + spread * 0.3) + (Math.random() - 0.5) * spread * 0.3;
      }

      body[i * 3] = x;
      body[i * 3 + 1] = y;
      body[i * 3 + 2] = z;

      // Scattered — random positions far away
      scattered[i * 3] = (Math.random() - 0.5) * 40;
      scattered[i * 3 + 1] = (Math.random() - 0.5) * 40;
      scattered[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }

    return { bodyPositions: body, scatteredPositions: scattered };
  }, []);

  const currentPositions = useRef(new Float32Array(scatteredPositions));
  const colorsRef = useRef(new Float32Array(count * 3));

  useMemo(() => {
    const colors = colorsRef.current;
    for (let i = 0; i < count; i++) {
      const section = i / count;
      if (section < 0.15) {
        // Head — bright white
        colors[i * 3] = 1;
        colors[i * 3 + 1] = 1;
        colors[i * 3 + 2] = 1;
      } else if (section < 0.45) {
        // Torso — light blue-white
        colors[i * 3] = 0.7 + Math.random() * 0.3;
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
        colors[i * 3 + 2] = 1;
      } else {
        // Trails — mix of blue, orange, red
        const trailColor = Math.random();
        if (trailColor < 0.4) {
          colors[i * 3] = 0.3;
          colors[i * 3 + 1] = 0.5;
          colors[i * 3 + 2] = 1;
        } else if (trailColor < 0.7) {
          colors[i * 3] = 1;
          colors[i * 3 + 1] = 0.4;
          colors[i * 3 + 2] = 0.1;
        } else {
          colors[i * 3] = 0.8;
          colors[i * 3 + 1] = 0.2;
          colors[i * 3 + 2] = 0.3;
        }
      }
    }
  }, [count]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    const arr = currentPositions.current;

    // Morph between scattered and figure based on progress
    const morphProgress = Math.min(Math.max(progress, 0), 1);

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      // Lerp between scattered and body
      const noise = Math.sin(t * 0.5 + i * 0.01) * 0.1 * (1 - morphProgress * 0.7);
      arr[ix] = scattered[ix] + (bodyPositions[ix] - scatteredPositions[ix]) * morphProgress + noise;
      arr[ix + 1] = scatteredPositions[ix + 1] + (bodyPositions[ix + 1] - scatteredPositions[ix + 1]) * morphProgress + noise * 0.5;
      arr[ix + 2] = scatteredPositions[ix + 2] + (bodyPositions[ix + 2] - scatteredPositions[ix + 2]) * morphProgress + noise;

      // Add flowing motion to trails when formed
      if (i / count > 0.45 && morphProgress > 0.5) {
        arr[ix + 1] -= Math.sin(t + i * 0.1) * 0.15 * morphProgress;
        arr[ix] += Math.cos(t * 0.7 + i * 0.05) * 0.08 * morphProgress;
      }
    }

    const pts = groupRef.current.children[0] as THREE.Points;
    if (pts?.geometry) {
      const posAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
      posAttr.array.set(arr);
      posAttr.needsUpdate = true;
    }

    // Subtle rotation
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.3;

    // Glow head
    const headLight = groupRef.current.children[1] as THREE.PointLight;
    if (headLight) {
      headLight.intensity = morphProgress * 3 + Math.sin(t * 2) * 0.5;
    }
  });

  return (
    <group ref={groupRef} position={[0, -2, 0]}>
      <points>
        <bufferGeometry>
          <bufferAttribute
            args={[currentPositions.current, 3]}
            attach="attributes-position"
            count={count}
            array={currentPositions.current}
            itemSize={3}
          />
          <bufferAttribute
            args={[colorsRef.current, 3]}
            attach="attributes-color"
            count={count}
            array={colorsRef.current}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.04}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
      <pointLight position={[0, 6, 0]} color="#ffffff" intensity={0} distance={8} />
    </group>
  );
}
