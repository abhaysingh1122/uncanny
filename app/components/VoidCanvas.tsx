"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const mousePos = { x: 0, y: 0 };

function Particles() {
  const count = 3000;
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;

    // Slow rotation
    mesh.current.rotation.y = time * 0.015;
    mesh.current.rotation.x = Math.sin(time * 0.008) * 0.08;

    // Mouse influence — particles subtly shift toward mouse
    mesh.current.rotation.z = mousePos.x * 0.05;
    mesh.current.position.x = mousePos.x * 2;
    mesh.current.position.y = mousePos.y * 2;

    const pos = mesh.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      pos[i3 + 1] += Math.sin(time * 0.2 + i * 0.008) * 0.003;
      pos[i3] += Math.cos(time * 0.15 + i * 0.008) * 0.002;
    }
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color="#ffffff" transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function MouseGlow() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (!meshRef.current) return;
    meshRef.current.position.x = mousePos.x * 15;
    meshRef.current.position.y = mousePos.y * 15;
    meshRef.current.position.z = 5;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[3, 16, 16]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.02} />
    </mesh>
  );
}

function CameraScroll() {
  const { camera } = useThree();

  useFrame(() => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const maxScroll = typeof document !== "undefined"
      ? document.documentElement.scrollHeight - window.innerHeight
      : 1;
    const progress = Math.min(scrollY / maxScroll, 1);

    // Camera travels through space as you scroll
    camera.position.z = 15 - progress * 30;
    camera.position.y = -progress * 8;
    camera.position.x = Math.sin(progress * Math.PI * 2) * 3;
    camera.rotation.z = Math.sin(progress * Math.PI) * 0.03;
  });

  return null;
}

function MouseTracker() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mousePos.x = (e.clientX / window.innerWidth) * 2 - 1;
      mousePos.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);
  return null;
}

export default function VoidCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} gl={{ antialias: true, alpha: true }}>
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 8, 45]} />
        <ambientLight intensity={0.15} />
        <pointLight position={[0, 0, 10]} intensity={0.3} color="#ffffff" />
        <Particles />
        <MouseGlow />
        <CameraScroll />
        <MouseTracker />
      </Canvas>
    </div>
  );
}
