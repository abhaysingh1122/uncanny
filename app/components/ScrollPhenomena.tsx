"use client";
import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import CosmicFigure from "./CosmicFigure";
import ParticleVortex from "./ParticleVortex";
import EnergyBurst from "./EnergyBurst";

export default function ScrollPhenomena() {
  const scrollRef = useRef(0);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
      scrollRef.current = progress;
      setScroll(progress);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Page 3 region: ~55-70% scroll (cosmic figure assembles from particles)
  const page3Start = 0.50;
  const page3End = 0.68;
  const page3Progress = scroll > page3Start && scroll < page3End
    ? (scroll - page3Start) / (page3End - page3Start)
    : scroll >= page3End ? Math.max(0, 1 - (scroll - page3End) * 10) : 0;

  // Page 4 region: ~68-82% scroll (particle vortex spins and pulls)
  const page4Start = 0.65;
  const page4End = 0.80;
  const page4Progress = scroll > page4Start && scroll < page4End
    ? (scroll - page4Start) / (page4End - page4Start)
    : scroll >= page4End ? Math.max(0, 1 - (scroll - page4End) * 10) : 0;

  // Page 5 region: ~82-95% scroll (energy burst from center)
  const page5Start = 0.80;
  const page5End = 0.95;
  const page5Progress = scroll > page5Start && scroll < page5End
    ? (scroll - page5Start) / (page5End - page5Start)
    : scroll >= page5End ? Math.max(0, 1 - (scroll - page5End) * 10) : 0;

  return (
    <group>
      {page3Progress > 0.01 && (
        <group position={[0, 0, -5]}>
          <CosmicFigure progress={page3Progress} />
        </group>
      )}
      {page4Progress > 0.01 && (
        <group position={[0, 0, -3]}>
          <ParticleVortex progress={page4Progress} />
        </group>
      )}
      {page5Progress > 0.01 && (
        <group position={[0, 0, -2]}>
          <EnergyBurst progress={page5Progress} />
        </group>
      )}
    </group>
  );
}
