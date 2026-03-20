"use client";
import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { createNoise3D } from "simplex-noise";

const noise3D = createNoise3D();
const mousePos = { x: 0, y: 0 };

// === PARTICLES (background stars) ===
function Particles() {
  const count = 3000;
  const mesh = useRef<THREE.Points>(null);

  const { positions, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sz = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 120;
      sz[i] = Math.random() * 0.12 + 0.03;
    }
    return { positions: pos, sizes: sz };
  }, []);

  useFrame((state) => {
    if (!mesh.current) return;
    const time = state.clock.elapsedTime;
    mesh.current.rotation.y = time * 0.008;
    mesh.current.rotation.x = Math.sin(time * 0.004) * 0.03;
    // Parallax with mouse
    mesh.current.position.x += (mousePos.x * 2 - mesh.current.position.x) * 0.02;
    mesh.current.position.y += (mousePos.y * 2 - mesh.current.position.y) * 0.02;
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#ffffff"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// === FLOATING GEOMETRIC SHAPES ===
function FloatingShapes() {
  const groupRef = useRef<THREE.Group>(null);

  const shapes = useMemo(() => {
    const items: {
      type: "icosahedron" | "torus" | "octahedron" | "dodecahedron";
      position: [number, number, number];
      scale: number;
      rotSpeed: [number, number, number];
      floatSpeed: number;
      floatAmp: number;
      phase: number;
    }[] = [];

    const types: ("icosahedron" | "torus" | "octahedron" | "dodecahedron")[] = [
      "icosahedron", "torus", "octahedron", "dodecahedron",
    ];

    for (let i = 0; i < 18; i++) {
      items.push({
        type: types[i % types.length],
        position: [
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40 - 10,
        ],
        scale: Math.random() * 1.5 + 0.4,
        rotSpeed: [
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.3,
          (Math.random() - 0.5) * 0.2,
        ],
        floatSpeed: Math.random() * 0.3 + 0.1,
        floatAmp: Math.random() * 2 + 0.5,
        phase: Math.random() * Math.PI * 2,
      });
    }
    return items;
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.elapsedTime;

    groupRef.current.children.forEach((child, i) => {
      const shape = shapes[i];
      if (!shape) return;
      const mesh = child as THREE.Mesh;

      mesh.rotation.x += shape.rotSpeed[0] * 0.01;
      mesh.rotation.y += shape.rotSpeed[1] * 0.01;
      mesh.rotation.z += shape.rotSpeed[2] * 0.01;

      // Gentle floating motion
      mesh.position.y =
        shape.position[1] +
        Math.sin(time * shape.floatSpeed + shape.phase) * shape.floatAmp;
      mesh.position.x =
        shape.position[0] +
        Math.cos(time * shape.floatSpeed * 0.7 + shape.phase) * shape.floatAmp * 0.5;
    });
  });

  return (
    <group ref={groupRef}>
      {shapes.map((shape, i) => (
        <mesh key={i} position={shape.position} scale={shape.scale}>
          {shape.type === "icosahedron" && <icosahedronGeometry args={[1, 0]} />}
          {shape.type === "torus" && <torusGeometry args={[1, 0.3, 8, 16]} />}
          {shape.type === "octahedron" && <octahedronGeometry args={[1, 0]} />}
          {shape.type === "dodecahedron" && <dodecahedronGeometry args={[1, 0]} />}
          <meshBasicMaterial
            color={i % 3 === 0 ? "#6666ff" : i % 3 === 1 ? "#ffffff" : "#ff4466"}
            wireframe
            transparent
            opacity={0.08 + (i % 5) * 0.02}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  );
}

// === WIREFRAME CREATURE — breathing noise-deformed sphere (CENTERPIECE) ===
function WireframeCreature() {
  const meshRef = useRef<THREE.Mesh>(null);
  const innerRef = useRef<THREE.Mesh>(null);
  const originalPositions = useRef<Float32Array | null>(null);
  const innerOrigPositions = useRef<Float32Array | null>(null);
  const visibleRef = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
      // Creature visible between 20-60% scroll
      if (progress > 0.18 && progress < 0.62) {
        visibleRef.current = Math.min(1, visibleRef.current + 0.04);
      } else {
        visibleRef.current = Math.max(0, visibleRef.current - 0.04);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const time = state.clock.elapsedTime;

    // Outer mesh deformation
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
      const n = noise3D(
        ox * 0.5 + time * 0.25,
        oy * 0.5 + time * 0.18,
        oz * 0.5 + time * 0.08
      );
      // Breathing effect
      const breathe = 1 + Math.sin(time * 0.8) * 0.08;
      const displacement = breathe + n * 0.5;

      pos[ix] = ox * displacement;
      pos[ix + 1] = oy * displacement;
      pos[ix + 2] = oz * displacement;
    }
    posAttr.needsUpdate = true;

    // Inner mesh deformation (counter-phase for depth)
    if (innerRef.current) {
      const innerGeo = innerRef.current.geometry as THREE.BufferGeometry;
      const innerPosAttr = innerGeo.attributes.position;

      if (!innerOrigPositions.current) {
        innerOrigPositions.current = new Float32Array(innerPosAttr.array);
      }

      const innerOrig = innerOrigPositions.current;
      const innerPos = innerPosAttr.array as Float32Array;

      for (let i = 0; i < innerPosAttr.count; i++) {
        const ix = i * 3;
        const ox = innerOrig[ix], oy = innerOrig[ix + 1], oz = innerOrig[ix + 2];
        const n = noise3D(
          ox * 0.7 + time * 0.35 + 100,
          oy * 0.7 + time * 0.22 + 100,
          oz * 0.7 + time * 0.12 + 100
        );
        const breathe = 1 + Math.sin(time * 0.8 + Math.PI) * 0.06;
        const displacement = breathe + n * 0.45;

        innerPos[ix] = ox * displacement;
        innerPos[ix + 1] = oy * displacement;
        innerPos[ix + 2] = oz * displacement;
      }
      innerPosAttr.needsUpdate = true;

      const innerMat = innerRef.current.material as THREE.MeshBasicMaterial;
      innerMat.opacity = visibleRef.current * 0.25;
      innerRef.current.scale.setScalar(visibleRef.current * 4.8);
      innerRef.current.rotation.y = -time * 0.08 + mousePos.x * 0.2;
      innerRef.current.rotation.x = -mousePos.y * 0.15;
    }

    // Mouse reactivity — creature leans toward mouse
    meshRef.current.rotation.y = time * 0.12 + mousePos.x * 0.4;
    meshRef.current.rotation.x = mousePos.y * 0.3;

    // Visibility and scale — BIG centerpiece
    const mat = meshRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = visibleRef.current * 0.5;
    meshRef.current.scale.setScalar(visibleRef.current * 5.5);
  });

  return (
    <group>
      {/* Outer wireframe */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 4]} />
        <meshBasicMaterial
          color="#ffffff"
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      {/* Inner wireframe — counter-rotating for depth */}
      <mesh ref={innerRef} position={[0, 0, 0]}>
        <icosahedronGeometry args={[1, 3]} />
        <meshBasicMaterial
          color="#8888ff"
          wireframe
          transparent
          opacity={0}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

// === TUBE FLY-THROUGH — wormhole on scroll ===
function TubeFlyThrough() {
  const tubeRef = useRef<THREE.Mesh>(null);
  const visibleRef = useRef(0);

  const { geometry } = useMemo(() => {
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
      const progress = docHeight > 0 ? scrollY / docHeight : 0;
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
    mat.opacity = visibleRef.current * 0.2;
  });

  return (
    <mesh ref={tubeRef} geometry={geometry}>
      <meshBasicMaterial
        color="#4466ff"
        wireframe
        transparent
        opacity={0.2}
        side={THREE.BackSide}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
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
    const progress = maxScroll > 0 ? Math.min(scrollY / maxScroll, 1) : 0;

    // First 25% — fly through the tube
    if (progress < 0.25) {
      const tubeProgress = progress / 0.25;
      const point = curveRef.current.getPointAt(Math.min(tubeProgress, 0.99));
      const lookAt = curveRef.current.getPointAt(Math.min(tubeProgress + 0.01, 1));
      camera.position.copy(point);
      camera.lookAt(lookAt);
    } else {
      // After tube — free-floating camera that shows the creature
      const postProgress = (progress - 0.25) / 0.75;
      camera.position.set(
        Math.sin(postProgress * Math.PI * 2) * 5 + mousePos.x * 2.5,
        Math.cos(postProgress * Math.PI * 0.5) * 3 + mousePos.y * 2,
        18 - postProgress * 15
      );
      camera.lookAt(0, 0, 0);
    }

    // Subtle roll
    camera.rotation.z = Math.sin(progress * Math.PI * 3) * 0.015;
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

// === POST-PROCESSING WITH FALLBACK ===
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PostProcessing() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [modules, setModules] = useState<{ r3pp: any; pp: any } | null>(null);

  useEffect(() => {
    // Dynamic import with try/catch fallback for WebGL compatibility
    Promise.all([
      import("@react-three/postprocessing"),
      import("postprocessing"),
    ])
      .then(([r3pp, pp]) => {
        setModules({ r3pp, pp });
      })
      .catch((err) => {
        console.warn("Post-processing unavailable, rendering without effects:", err);
      });
  }, []);

  if (!modules) return null;

  const { r3pp, pp } = modules;
  const EffectComposer = r3pp.EffectComposer;
  const Bloom = r3pp.Bloom;
  const ChromaticAberration = r3pp.ChromaticAberration;
  const Noise = r3pp.Noise;
  const BlendFunction = pp.BlendFunction;

  return (
    <EffectComposer>
      <Bloom
        luminanceThreshold={0.05}
        luminanceSmoothing={0.9}
        intensity={1.8}
      />
      <ChromaticAberration
        blendFunction={BlendFunction.NORMAL}
        offset={new THREE.Vector2(0.002, 0.002)}
      />
      <Noise
        blendFunction={BlendFunction.OVERLAY}
        opacity={0.06}
      />
    </EffectComposer>
  );
}

// === MAIN CANVAS ===
export default function VoidCanvas() {
  return (
    <div className="fixed inset-0 z-0">
      <Canvas
        camera={{ position: [0, 0, 18], fov: 65 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <color attach="background" args={["#050510"]} />
        <fog attach="fog" args={["#050510", 10, 80]} />

        <ambientLight intensity={0.15} />
        <pointLight position={[0, 8, 15]} intensity={0.6} color="#6666ff" />
        <pointLight position={[-8, -5, 8]} intensity={0.3} color="#ff4444" />
        <pointLight position={[5, 3, -5]} intensity={0.2} color="#44ffaa" />

        <Particles />
        <FloatingShapes />
        <TubeFlyThrough />
        <WireframeCreature />
        <CameraController />
        <MouseTracker />

        <PostProcessing />
      </Canvas>
    </div>
  );
}
