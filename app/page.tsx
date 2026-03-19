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
  const [page3, setPage3] = useState(false);
  const [page4, setPage4] = useState(false);
  const [page5, setPage5] = useState(false);
  const [loopCount, setLoopCount] = useState(0);

  const handleLoop = () => {
    setLoopCount(prev => prev + 1);
    gsap.to(".dive-flash", { opacity: 1, duration: 1.5, ease: "power2.in",
      onComplete: () => {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        gsap.to(".dive-flash", { opacity: 0, duration: 2, delay: 0.5 });
      }
    });
  };

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

  const diveToSection = (showFn: (v: boolean) => void, selector: string) => {
    showFn(true);
    gsap.fromTo(".dive-flash", { opacity: 0 }, {
      opacity: 1, duration: 0.6, ease: "power2.in",
      onComplete: () => {
        setTimeout(() => {
          const el = document.querySelector(selector);
          if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY, behavior: "instant" as ScrollBehavior });
          gsap.to(".dive-flash", { opacity: 0, duration: 1.5, delay: 0.3 });
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
              are you sure
            </div>
          </div>
        </div>
      )}

      {entered && <div className="entry-flash fixed inset-0 z-40 bg-white pointer-events-none" />}
      <div className="dive-flash fixed inset-0 z-40 bg-[#050510] pointer-events-none opacity-0" />

      {entered && (
        <>
          <ColorShift />
          {/* AmbientSound and WTFMoment removed — will add proper versions later */}
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
            <div className="text-white text-[2vw] tracking-[0.3em] glow-text scribble-text" style={{ opacity: 0.6 }}>
              there&apos;s more
            </div>
            <button
              onClick={() => diveToSection(setDiveDeeper, ".act-two")}
              className="dive-btn text-white text-[16px] tracking-[0.3em] uppercase px-20 py-8 bg-transparent mt-10"
              style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}
            >
              keep going
            </button>
            <div className="text-white text-[11px] tracking-[0.2em] mt-8" style={{ opacity: 0.25 }}>
              (or don&apos;t)
            </div>
          </div>

          {/* === ACT TWO — The Deep === */}
          <div className="act-two relative z-10" style={{ display: diveDeeper ? "block" : "none" }}>
              {/* Emptiness first — let the black breathe */}
              <div className="h-[80vh]" />

              {/* The realization — just "oh" */}
              <div className="relative h-[100vh] flex items-center justify-center">
                <div className="text-center">
                  <div className="text-white text-[12vw] scribble-text glow-strong" style={{ opacity: 0.8 }}>
                    oh
                  </div>
                </div>
              </div>

              <div className="h-[60vh]" />

              {/* The notebook — someone trying to pin something down */}
              <div className="relative h-[80vh] flex items-center justify-center">
                <div className="text-white text-center leading-loose" style={{ maxWidth: "60vw" }}>
                  <span className="block scribble-text text-[3vw] glow-text" style={{ opacity: 0.6 }}>I wrote this down somewhere</span>
                  <span className="block mt-8 scribble-text text-[2.5vw]" style={{ opacity: 0.4, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.4)" }}>the answer</span>
                  <span className="block mt-4 scribble-text text-[2.5vw]" style={{ opacity: 0.35, textDecoration: "line-through", textDecorationColor: "rgba(255,255,255,0.35)" }}>the question</span>
                  <span className="block mt-8 scribble-text text-[3vw] glow-text" style={{ opacity: 0.7 }}>the feeling of almost knowing</span>
                </div>
              </div>

              <div className="h-[50vh]" />

              {/* Marginalia — scattered like notes in margins of a used book */}
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
                  <div
                    key={item.word}
                    className="absolute scribble-text"
                    style={{
                      left: `${8 + (i % 4) * 22 + (i * 7) % 13}%`,
                      top: `${i * 9 + 3}%`,
                      fontSize: `${1.4 + (i % 3) * 0.8}vw`,
                      opacity: 0.2 + (i % 3) * 0.15,
                      transform: `rotate(${((i * 7) % 11) - 5}deg)`,
                      color: "white",
                      textDecoration: item.scratch ? "line-through" : "none",
                      textDecorationColor: "rgba(255,255,255,0.3)",
                    }}
                  >
                    {item.word}
                  </div>
                ))}
              </div>

              <div className="h-[40vh]" />

              {/* The honest ending */}
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

              {/* Signature scribble — anonymous mark */}
              <div className="relative h-[60vh] flex items-center justify-center">
                <svg viewBox="0 0 300 100" className="w-[40vw] max-w-[400px]" fill="none" style={{ opacity: 0.4 }}>
                  <path
                    d="M20 70 C40 20, 60 80, 80 50 C100 20, 120 80, 140 45 C160 10, 180 70, 200 40 C220 10, 240 60, 260 35 C270 25, 280 30, 285 28"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.2))" }}
                  />
                </svg>
              </div>

              <div className="h-[30vh]" />

              {/* Page 2 → Page 3 */}
              <div className="relative z-[9999] h-[100vh] flex flex-col items-center justify-center gap-8" style={{ pointerEvents: "auto" }}>
                <div className="text-white text-[1.8vw] tracking-[0.3em] glow-text scribble-text" style={{ opacity: 0.5 }}>it gets stranger</div>
                <button onClick={() => diveToSection(setPage3, ".act-three")} className="dive-btn text-white text-[14px] tracking-[0.3em] uppercase px-16 py-6 bg-transparent mt-8" style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}>further still</button>
              </div>
            </div>

          {/* === PAGE 3 — The Underneath === */}
          <div className="act-three relative z-10" style={{ display: page3 ? "block" : "none" }}>
            <div className="h-[60vh]" />
            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-white text-[8vw] scribble-text glow-strong" style={{ opacity: 0.7 }}>wait</div>
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="text-white text-center leading-loose" style={{ maxWidth: "55vw" }}>
                <span className="block text-[2.5vw] scribble-text glow-text" style={{ opacity: 0.6 }}>have you been here before</span>
                <span className="block mt-10 text-[1.8vw]" style={{ opacity: 0.35 }}>the particles look familiar</span>
                <span className="block mt-4 text-[1.8vw]" style={{ opacity: 0.25 }}>the dark looks familiar</span>
                <span className="block mt-4 text-[1.8vw]" style={{ opacity: 0.15 }}>you look familiar</span>
              </div>
            </div>
            <div className="h-[50vh]" />
            <div className="relative h-[120vh]">
              {["this sentence has appeared before", "or has it", "you're not sure", "and that's the point", "certainty is a kind of sleep", "you're awake now", "aren't you"].map((text, i) => (
                <div key={text} className="absolute scribble-text glow-text" style={{ left: `${15 + (i * 11) % 55}%`, top: `${i * 13 + 5}%`, fontSize: `${1.5 + (i % 3) * 0.7}vw`, opacity: 0.25 + (i % 4) * 0.12, transform: `rotate(${((i * 5) % 9) - 4}deg)`, color: "white" }}>{text}</div>
              ))}
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-[3vw] tracking-[0.2em] glow-text" style={{ opacity: 0.6 }}>the screen is a mirror</div>
                <div className="text-white text-[1.5vw] tracking-[0.2em] mt-8" style={{ opacity: 0.2 }}>and mirrors don&apos;t answer questions</div>
              </div>
            </div>
            <div className="h-[40vh]" />
            {/* Page 3 → Page 4 */}
            <div className="relative z-[9999] h-[100vh] flex flex-col items-center justify-center gap-8" style={{ pointerEvents: "auto" }}>
              <div className="text-white text-[1.5vw] tracking-[0.3em]" style={{ opacity: 0.35 }}>almost there</div>
              <button onClick={() => diveToSection(setPage4, ".act-four")} className="dive-btn text-white text-[14px] tracking-[0.3em] uppercase px-16 py-6 bg-transparent mt-8" style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}>one more</button>
              <div className="text-white text-[9px] tracking-[0.2em] mt-4" style={{ opacity: 0.12 }}>(almost where?)</div>
            </div>
          </div>

          {/* === PAGE 4 — The Core === */}
          <div className="act-four relative z-10" style={{ display: page4 ? "block" : "none" }}>
            <div className="h-[80vh]" />
            <div className="relative h-[60vh] flex items-center justify-center">
              <div className="text-white text-[16vw] scribble-text" style={{ opacity: 0.06 }}>breathe</div>
            </div>
            <div className="h-[80vh]" />
            <div className="relative h-[60vh] flex items-center justify-center">
              <div className="text-white text-[3vw] tracking-[1em]" style={{ opacity: 0.3 }}>. . .</div>
            </div>
            <div className="h-[60vh]" />
            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="text-center leading-loose">
                <div className="text-white text-[2vw] scribble-text" style={{ opacity: 0.4 }}>a thought without a thinker</div>
                <div className="text-white text-[2vw] scribble-text mt-6" style={{ opacity: 0.3 }}>a question without words</div>
                <div className="text-white text-[2vw] scribble-text mt-6" style={{ opacity: 0.2 }}>a scroll without an end</div>
              </div>
            </div>
            <div className="h-[60vh]" />
            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="pulse-glow" style={{ width: "8px", height: "8px", background: "white", borderRadius: "50%", boxShadow: "0 0 20px rgba(255,255,255,0.4), 0 0 60px rgba(255,255,255,0.1)" }} />
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[60vh] flex items-center justify-center">
              <div className="text-white text-[1.2vw] tracking-[0.4em]" style={{ opacity: 0.2 }}>the dot from the beginning</div>
            </div>
            <div className="h-[30vh]" />
            <div className="relative h-[60vh] flex items-center justify-center">
              <div className="text-white text-[2vw] scribble-text glow-text" style={{ opacity: 0.5 }}>it was always just this</div>
            </div>
            <div className="h-[40vh]" />
            {/* Page 4 → Page 5 */}
            <div className="relative z-[9999] h-[100vh] flex flex-col items-center justify-center gap-8" style={{ pointerEvents: "auto" }}>
              <div className="text-white text-[1.2vw] tracking-[0.3em]" style={{ opacity: 0.25 }}>last one</div>
              <button onClick={() => diveToSection(setPage5, ".act-five")} className="dive-btn text-white text-[12px] tracking-[0.3em] uppercase px-14 py-5 bg-transparent mt-6" style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}>finish it</button>
            </div>
          </div>

          {/* === PAGE 5 — The Return (Loop) === */}
          <div className="act-five relative z-10" style={{ display: page5 ? "block" : "none" }}>
            <div className="h-[60vh]" />
            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="text-white text-[6vw] scribble-text" style={{ opacity: 0.15, filter: "blur(2px)" }}>I had a name for this once</div>
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[80vh] flex items-center justify-center">
              <div className="text-white text-[4vw] scribble-text" style={{ opacity: 0.12, filter: "blur(1px)" }}>the fridge hums at night</div>
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[60vh] flex items-center justify-center">
              <div className="text-white text-[5vw] scribble-text glitch" style={{ opacity: 0.2 }}>SOMETHING WAS SUPPOSED TO HAPPEN</div>
            </div>
            <div className="h-[60vh]" />
            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-[3vw] scribble-text glow-text" style={{ opacity: 0.6 }}>oh</div>
                <div className="text-white text-[1.5vw] mt-10" style={{ opacity: 0.25 }}>it&apos;s a loop</div>
              </div>
            </div>
            <div className="h-[40vh]" />
            <div className="relative h-[120vh]">
              {["who wrote this", "why did you keep scrolling", "what were you looking for", "did you find it", "would you know if you did", "is this the first time", "how would you know"].map((q, i) => (
                <div key={q} className="absolute scribble-text" style={{ left: `${12 + (i * 13) % 50}%`, top: `${i * 13 + 4}%`, fontSize: `${1.6 + (i % 2) * 0.6}vw`, opacity: 0.2 + (i % 3) * 0.1, transform: `rotate(${((i * 3) % 7) - 3}deg)`, color: "white" }}>{q}</div>
              ))}
            </div>
            <div className="h-[60vh]" />
            <div className="relative h-[100vh] flex items-center justify-center">
              <div className="text-center">
                <div className="text-white text-[10vw] scribble-text glow-strong" style={{ opacity: 0.9 }}>.</div>
                <div className="text-white text-[1vw] tracking-[0.5em] mt-10" style={{ opacity: 0.15 }}>{loopCount === 0 ? "the beginning" : `loop ${loopCount + 1}`}</div>
              </div>
            </div>
            <div className="h-[30vh]" />
            <div className="relative z-[9999] h-[80vh] flex flex-col items-center justify-center gap-6" style={{ pointerEvents: "auto" }}>
              <div className="text-white text-[1vw] tracking-[0.4em]" style={{ opacity: 0.2 }}>{loopCount === 0 ? "again?" : `again. (${loopCount + 1})`}</div>
              <button onClick={handleLoop} className="dive-btn text-white text-[11px] tracking-[0.3em] uppercase px-12 py-5 bg-transparent mt-4" style={{ cursor: "pointer", pointerEvents: "auto", zIndex: 99999 }}>↺</button>
            </div>
          </div>
        </>
      )}
    </main>
  );
}
