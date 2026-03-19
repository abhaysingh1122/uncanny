"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomCursor from "./components/CustomCursor";
import TextFragments from "./components/TextFragments";
import ColorShift from "./components/ColorShift";
import WTFMoment from "./components/WTFMoment";

gsap.registerPlugin(ScrollTrigger);

const VoidCanvas = dynamic(() => import("./components/VoidCanvas"), { ssr: false });

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

  const handleDive = () => {
    setDiveDeeper(true);
    gsap.fromTo(".dive-flash", { opacity: 0 }, {
      opacity: 1, duration: 0.8, ease: "power2.in",
      onComplete: () => {
        setTimeout(() => {
          const el = document.querySelector(".act-two");
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" as ScrollBehavior });
          gsap.to(".dive-flash", { opacity: 0, duration: 2, delay: 0.3 });
        }, 100);
      }
    });
  };

  return (
    <main className="relative">
      <CustomCursor />
      <VoidCanvas />
      <ColorShift />
      <WTFMoment />

      {/* Scratch lines */}
      <div className="scratch-line" style={{ animationDelay: "0s" }} />
      <div className="scratch-line" style={{ animationDelay: "3s" }} />
      <div className="scratch-line" style={{ animationDelay: "6s" }} />

      {/* Entry */}
      {!entered && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#050510] cursor-pointer" onClick={() => setEntered(true)}>
          <div className="text-white text-[10px] tracking-[0.5em] uppercase flicker">
            are you sure
          </div>
        </div>
      )}

      {entered && <div className="entry-flash fixed inset-0 z-40 bg-white pointer-events-none" />}
      <div className="dive-flash fixed inset-0 z-40 bg-[#050510] pointer-events-none opacity-0" />

      {entered && (
        <>
          <TextFragments />

          {/* === ACT ONE — Simplified, tighter scroll === */}
          <div className="relative z-10 h-[100vh]" /> {/* breathing room */}
          <div className="phase-birth relative z-10 h-[80vh]" />
          <div className="phase-scatter relative z-10 h-[120vh]" />
          <div className="phase-creation relative z-10 h-[140vh]" />
          <div className="phase-creature relative z-10 h-[160vh]" />
          <div className="phase-glitch relative z-10 h-[140vh]" />
          <div className="phase-quiet relative z-10 h-[120vh]" />
          <div className="phase-address relative z-10 h-[100vh]" />
          <div className="phase-silence relative z-10 h-[80vh]" />

          {/* Dive Deeper */}
          <div className="phase-end relative z-10 h-[20vh]" />
          <div className="relative z-[9999] h-[100vh] flex flex-col items-center justify-center gap-8" style={{ pointerEvents: "auto" }}>
            <div className="text-white text-[2vw] tracking-[0.3em] glow-text scribble-text" style={{ opacity: 0.6 }}>
              there&apos;s more
            </div>
            <button onClick={handleDive} className="dive-btn text-white text-[16px] tracking-[0.3em] uppercase px-20 py-8 bg-transparent mt-10" style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}>
              keep going
            </button>
            <div className="text-white text-[11px] tracking-[0.2em] mt-8" style={{ opacity: 0.25 }}>
              (or don&apos;t)
            </div>
          </div>

          {/* === ACT TWO === */}
          <div className="act-two relative z-10" style={{ display: diveDeeper ? "block" : "none" }}>
            <div className="h-[80vh]" />

            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-white text-[12vw] scribble-text glow-strong" style={{ opacity: 0.8 }}>
                oh
              </div>
            </div>

            <div className="h-[60vh]" />

            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="text-white text-center leading-loose" style={{ maxWidth: "60vw" }}>
                <span className="block scribble-text text-[3vw] glow-text" style={{ opacity: 0.6 }}>I wrote this down somewhere</span>
                <span className="block mt-8 scribble-text text-[2.5vw]" style={{ opacity: 0.4, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.4)" }}>the answer</span>
                <span className="block mt-4 scribble-text text-[2.5vw]" style={{ opacity: 0.35, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.35)" }}>the question</span>
                <span className="block mt-8 scribble-text text-[3vw] glow-text" style={{ opacity: 0.7 }}>the feeling of almost knowing</span>
              </div>
            </div>

            <div className="h-[50vh]" />

            {/* Marginalia */}
            <div className="relative h-[150vh]">
              {[
                { word: "tuesday", scratch: false },
                { word: "check again", scratch: false },
                { word: "no", scratch: true },
                { word: "the blue one", scratch: false },
                { word: "was it always like this", scratch: false },
                { word: "look up", scratch: false },
                { word: "don't", scratch: false },
                { word: "4th floor", scratch: false },
                { word: "someone was here", scratch: true },
                { word: "almost", scratch: false },
              ].map((item, i) => (
                <div key={item.word} className="absolute scribble-text" style={{
                  left: `${8 + (i % 4) * 22 + (i * 7) % 13}%`,
                  top: `${i * 9 + 3}%`,
                  fontSize: `${1.4 + (i % 3) * 0.8}vw`,
                  opacity: 0.2 + (i % 3) * 0.15,
                  transform: `rotate(${((i * 7) % 11) - 5}deg)`,
                  color: "white",
                  textDecoration: item.scratch ? "line-through" : "none",
                  textDecorationColor: "rgba(255,255,255,0.3)",
                }}>
                  {item.word}
                </div>
              ))}
            </div>

            <div className="h-[40vh]" />

            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-[2.5vw] tracking-[0.15em] glow-text scribble-text" style={{ opacity: 0.65 }}>
                  I don&apos;t know what this is
                </div>
                <div className="text-white text-[2.5vw] tracking-[0.15em] glow-text scribble-text mt-6" style={{ opacity: 0.55 }}>
                  and neither do you
                </div>
              </div>
            </div>

            <div className="h-[40vh]" />

            <div className="relative h-[40vh] flex items-end justify-center pb-20">
              <div className="text-white text-[10px] tracking-[0.6em]" style={{ opacity: 0.15 }}>
                still here
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
