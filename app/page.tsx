"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "./components/CustomCursor";
import TextFragments from "./components/TextFragments";
import ScribbleOverlay from "./components/ScribbleOverlay";
import GeometricFigure from "./components/GeometricFigure";
import ConstellationReveal from "./components/ConstellationReveal";
import TextToCreature from "./components/TextToCreature";
import ColorShift from "./components/ColorShift";
import ScribbleCreature from "./components/ScribbleCreature";
import WTFMoment from "./components/WTFMoment";
import AmbientSound from "./components/AmbientSound";

gsap.registerPlugin(ScrollTrigger);

const VoidCanvas = dynamic(() => import("./components/VoidCanvas"), {
  ssr: false,
});

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [diveDeeper, setDiveDeeper] = useState(false);

  useEffect(() => {
    if (entered) {
      document.body.style.overflow = "auto";
      gsap.fromTo(".entry-flash", { opacity: 1 }, { opacity: 0, duration: 1.5, ease: "power2.inOut" });
    } else {
      document.body.style.overflow = "hidden";
    }
  }, [entered]);

  useEffect(() => {
    if (!entered) return;

    gsap.to(".geo-figure-wrapper", {
      opacity: 1,
      scrollTrigger: { trigger: ".phase-assembly", start: "top 80%", end: "top 40%", scrub: 1 },
    });

    gsap.to(".geo-figure-wrapper", {
      opacity: 0,
      scrollTrigger: { trigger: ".phase-shatter", start: "top 80%", end: "bottom 40%", scrub: 1 },
    });

    gsap.to(".phase-constellation-container", {
      opacity: 1,
      scrollTrigger: { trigger: ".phase-constellation", start: "top 80%", end: "top 40%", scrub: 1 },
    });

    // Creature appears
    gsap.to(".creature-wrapper", {
      opacity: 1,
      scrollTrigger: { trigger: ".phase-creature", start: "top 80%", end: "top 50%", scrub: 1 },
    });

    // No scroll animation on dive section — just let it be visible

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, [entered]);

  const handleDive = () => {
    setDiveDeeper(true);
    // Flash to black, then scroll to act two
    gsap.fromTo(".dive-flash", { opacity: 0 }, {
      opacity: 1,
      duration: 0.8,
      ease: "power2.in",
      onComplete: () => {
        // Wait a tick for React to render act-two
        setTimeout(() => {
          const actTwo = document.querySelector(".act-two");
          if (actTwo) {
            const y = actTwo.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: y, behavior: "instant" as ScrollBehavior });
          }
          gsap.to(".dive-flash", { opacity: 0, duration: 2, delay: 0.5 });
        }, 100);
      }
    });
  };

  return (
    <main className="relative">
      <CustomCursor />
      <VoidCanvas />
      <ScribbleOverlay />

      <div className="scratch-line" style={{ animationDelay: "0s" }} />
      <div className="scratch-line" style={{ animationDelay: "2s" }} />
      <div className="scratch-line" style={{ animationDelay: "4.5s" }} />
      <div className="scratch-line" style={{ animationDelay: "7s" }} />

      {/* Entry */}
      {!entered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050510] cursor-pointer" onClick={() => setEntered(true)}>
          <div className="text-center">
            <div className="text-white text-[10px] tracking-[0.5em] uppercase flicker">
              enter the void
            </div>
          </div>
        </div>
      )}

      {entered && <div className="entry-flash fixed inset-0 z-40 bg-white pointer-events-none" />}
      <div className="dive-flash fixed inset-0 z-40 bg-[#050510] pointer-events-none opacity-0" />

      {entered && (
        <>
          <ColorShift />
          <AmbientSound />
          <WTFMoment />
          <div className="geo-figure-wrapper" style={{ opacity: 0 }}><GeometricFigure /></div>
          <ConstellationReveal />
          <TextToCreature />
          <div className="creature-wrapper" style={{ opacity: 0 }}><ScribbleCreature /></div>
          <TextFragments />

          {/* === ACT ONE === */}
          <div className="relative z-10 h-[100vh]" />
          <div className="phase-birth relative z-10 h-[80vh]" />

          {/* Scattered particles morph into stickman creature */}
          <div className="phase-morph relative z-10 h-[200vh]" />
          {/* Stickman travels through space */}
          <div className="phase-travel relative z-10 h-[150vh]" />
          {/* Stickman dissolves/scatters away */}
          <div className="phase-dissolve relative z-10 h-[100vh]" />

          <div className="phase-scatter relative z-10 h-[130vh]" />
          <div className="phase-assembly relative z-10 h-[160vh]" />
          <div className="phase-creation relative z-10 h-[160vh]" />

          {/* Scribbled creature draws itself */}
          <div className="phase-creature relative z-10 h-[180vh]" />
          {/* Creature walks */}
          <div className="phase-creature-walk relative z-10 h-[120vh]" />
          {/* Creature dissolves */}
          <div className="phase-creature-dissolve relative z-10 h-[80vh]" />

          <div className="phase-glitch relative z-10 h-[160vh]" />
          <div className="phase-shatter relative z-10 h-[130vh]" />
          <div className="phase-constellation relative z-10 h-[160vh]" />
          <div className="phase-silence relative z-10 h-[100vh]" />

          {/* Dive Deeper — NOT hidden, NOT animated, always visible when scrolled to */}
          <div className="phase-end relative z-10 h-[20vh]" />
          <div
            className="relative h-[100vh] flex flex-col items-center justify-center gap-8"
            style={{ zIndex: 9999, position: "relative", pointerEvents: "auto" }}
          >
            <div className="text-white text-[2.5vw] tracking-[0.3em] glow-strong" style={{ opacity: 0.9 }}>
              you&apos;ve reached the edge
            </div>
            <button
              onClick={handleDive}
              className="dive-btn text-white text-[16px] tracking-[0.3em] uppercase px-20 py-8 bg-transparent mt-10"
              style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}
            >
              dive deeper ?
            </button>
            <div className="text-white text-[11px] tracking-[0.2em] mt-8 glow-text" style={{ opacity: 0.4 }}>
              there is no going back
            </div>
          </div>

          {/* === ACT TWO — The Deep === */}
          <div className="act-two relative z-10" style={{ display: diveDeeper ? "block" : "none" }}>
              {/* Inversion — white text gets bolder, more raw */}
              <div className="h-[50vh]" />

              <div className="relative h-[100vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-[12vw] font-bold glow-strong scribble-text" style={{ opacity: 0.9 }}>
                    deeper
                  </div>
                </div>
              </div>

              <div className="h-[30vh]" />

              <div className="relative h-[80vh] flex items-center justify-center">
                <div className="text-white text-[2vw] tracking-[0.2em] text-center leading-relaxed" style={{ opacity: 0.7, maxWidth: "60vw" }}>
                  <span className="block mb-8 scribble-text text-[4vw] glow-text">the truth is</span>
                  <span className="block opacity-50">there was never a beginning</span>
                  <span className="block opacity-40 mt-2">and there will never be an end</span>
                  <span className="block opacity-30 mt-2">just the space between</span>
                  <span className="block opacity-20 mt-2">where you pretend to exist</span>
                </div>
              </div>

              <div className="h-[50vh]" />

              <div className="relative h-[100vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="scribble-text text-[8vw] glow-strong" style={{ opacity: 0.8 }}>
                    are you still
                  </div>
                  <div className="scribble-text text-[10vw] glow-strong mt-4" style={{ opacity: 0.95 }}>
                    looking?
                  </div>
                </div>
              </div>

              <div className="h-[50vh]" />

              {/* Rapid fire fragments */}
              <div className="relative h-[150vh]">
                {["create", "destroy", "forget", "remember", "lose", "find", "break", "heal", "fall", "rise"].map((word, i) => (
                  <div
                    key={word}
                    className="absolute scribble-text glow-text"
                    style={{
                      left: `${10 + (i % 3) * 30 + Math.random() * 10}%`,
                      top: `${i * 10}%`,
                      fontSize: `${3 + Math.random() * 4}vw`,
                      opacity: 0.5 + Math.random() * 0.4,
                      transform: `rotate(${(Math.random() - 0.5) * 20}deg)`,
                      color: "white",
                    }}
                  >
                    {word}
                  </div>
                ))}
              </div>

              <div className="h-[30vh]" />

              {/* The final truth */}
              <div className="relative h-[100vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-[2.5vw] tracking-[0.5em] glow-strong" style={{ opacity: 0.85 }}>
                    the void stares back
                  </div>
                </div>
              </div>

              <div className="h-[30vh]" />

              {/* Signature scribble */}
              <div className="relative h-[80vh] flex items-center justify-center">
                <svg viewBox="0 0 300 100" className="w-[40vw] max-w-[400px]" fill="none" style={{ opacity: 0.6 }}>
                  <path
                    d="M20 70 C40 20, 60 80, 80 50 C100 20, 120 80, 140 45 C160 10, 180 70, 200 40 C220 10, 240 60, 260 35 C270 25, 280 30, 285 28"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.3))" }}
                  />
                </svg>
              </div>

              <div className="h-[20vh]" />

              <div className="relative h-[50vh] flex items-end justify-center pb-20">
                <div className="text-white text-[12px] tracking-[1em] uppercase glow-text" style={{ opacity: 0.3 }}>
                  fin
                </div>
              </div>
            </div>
        </>
      )}
    </main>
  );
}
