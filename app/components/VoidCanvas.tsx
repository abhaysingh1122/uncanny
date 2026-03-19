"use client";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom, ChromaticAberration, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();
const mousePos = { x: 0, y: 0 };

// === PARTICLES (background) ===
function Particles() {
  const count = 2500;
  const mesh = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 80;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.y = time * 0.01;
    mesh.current.rotation.x = Math.sin(time * 0.005) * 0.05;
    mesh.current.position.x = mousePos.x * 1.5;
    mesh.current.position.y = mousePos.y * 1.5;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.5} sizeAttenuation depthWrite={false} />
    </points>
  );
}

// === WIREFRAME CREATURE — breathing noise-deformed sphere ===
function WireframeCreature() {
  const meshRef = useRef<THREE.Mesh>(null);
  const geoRef = useRef<THREE.IcosahedronGeometry | null>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const visibleRef = useRef(0);

  useEffect(() => {
    // Listen for scroll to control creature visibility
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / docHeight;
      // Creature visible between 30-55% scroll
      if (progress > 0.28 && progress < 0.58) {
        visibleRef.current = Math.min(1, visibleRef.current + 0.05);
      } else {
        visibleRef.current = Math.max(0, visibleRef.current - 0.05);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;
    const geo = meshRef.current.geometry as THREE.BufferGeometry;
    const posAttr = geo.attributes.position;

    if (!originalPositions.current) {
      originalPositions.current = new Float32Array(posAttr.array);
    }

    const orig = originalPositions.current;
    const pos = posAttr.array as Float32Array;

    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3;
      const ox = orig[ix], oy = orig[ix + 1], oz = orig[ix + 2];

      // Noise displacement — creature breathes and morphs
      const n = noise3D(ox * 0.8 + time * 0.3, oy * 0.8 + time * 0.2, oz * 0.8 + time * 0.1);
      const displacement = 1 + n * 0.4;

      pos[ix] = ox * displacement;
      pos[ix + 1] = oy * displacement;
      pos[ix + 2] = oz * displacement;
    }
    posAttr.needsUpdate = true;

    // Mouse reactivity — creature leans toward mouse
    meshRef.current.rotation.y = time * 0.15 + mousePos.x * 0.3;
    meshRef.current.rotation.x = mousePos.y * 0.2;

    // Visibility
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = visibleRef.current * 0.6;
    meshRef.current.scale.setScalar(visibleRef.current * 2.5);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <icosahedronGeometry ref={geoRef} args={[1, 4]} />
      <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0} depthWrite={false} />
    </mesh>
  );
}

// === TUBE FLY-THROUGH — wormhole on scroll ===
function TubeFlyThrough() {
  const tubeRef = useRef<THREE.Mesh>(null);
  const visibleRef = useRef(0);

  const { curve, geometry } = useMemo(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      points.push(
        new THREE.Vector3(
          Math.sin(t * Math.PI * 4) * 3,
          Math.cos(t * Math.PI * 3) * 2,
          -t * 60
        )
      );
    }
    const c = new THREE.CatmullRomCurve3(points);
    const g = new THREE.TubeGeometry(c, 200, 1.5, 12, false);
    return { curve: c, geometry: g };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollY / docHeight;
      // Tube visible between 0-25% scroll
      if (progress < 0.28) {
        visibleRef.current = Math.min(1, visibleRef.current + 0.05);
      } else {
        visibleRef.current = Math.max(0, visibleRef.current - 0.05);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame(() => {
    if (!tubeRef.current) return;
    const mat = tubeRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = visibleRef.current * 0.15;
  });

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshBasicMaterial color="#4466ff" wireframe transparent opacity={0.15} side={THREE.BackSide} depthWrite={false} />
    </mesh>
  );
}

// === CAMERA CONTROL ===
function CameraController() {
  const { camera } = useThree();
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null);

  useMemo(() => {
    const points = [];
    for (let i = 0; i < 20; i++) {
      const t = i / 19;
      points.push(
        new THREE.Vector3(
          Math.sin(t * Math.PI * 4) * 2.5,
          Math.cos(t * Math.PI * 3) * 1.5,
          -t * 55
        )
      );
    }
    curveRef.current = new THREE.CatmullRomCurve3(points);
  }, []);

  useFrame(() => {
    if (!curveRef.current) return;
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const maxScroll = typeof document !== "undefined"
      ? document.documentElement.scrollHeight - window.innerHeight
      : 1;
    const progress = Math.min(scrollY / maxScroll, 1);

    // First 25% — fly through the tube
    if (progress < 0.25) {
      const tubeProgress = progress / 0.25;
      const point = curveRef.current.getPointAt(Math.min(tubeProgress, 0.99));
      const lookAt = curveRef.current.getPointAt(Math.min(tubeProgress + 0.01, 1));
      camera.position.copy(point);
      camera.lookAt(lookAt);
    } else {
      // After tube — free-floating camera
      const postProgress = (progress - 0.25) / 0.75;
      camera.position.set(
        Math.sin(postProgress * Math.PI * 2) * 4 + mousePos.x * 2,
        -postProgress * 10 + mousePos.y * 2,
        15 - postProgress * 25
      );
      camera.lookAt(0, camera.position.y - 2, camera.position.z - 10);
    }

    // Subtle roll
    camera.rotation.z = Math.sin(progress * Math.PI * 3) * 0.02;
  });

  return null;
}

// === MOUSE TRACKER ===
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

// === MAIN CANVAS ===
export default function VoidCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 15], fov: 65 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]}>
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 5, 50]} />

        <ambientLight intensity={0.1} />
        <pointLight position={[0, 5, 10]} intensity={0.4} color="#6666ff" />
        <pointLight position={[-5, -5, 5]} intensity={0.2} color="#ff4444" />

        <Particles />
        <TubeFlyThrough />
        <WireframeCreature />
        <CameraController />
        <MouseTracker />

        <EffectComposer>
          <Bloom
            luminanceThreshold={0.1}
            luminanceSmoothing={0.9}
            intensity={1.2}
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0015, 0.0015)}
          />
          <Noise
            blendFunction={BlendFunction.OVERLAY}
            opacity={0.08}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
