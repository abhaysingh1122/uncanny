"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Fragment {
  text: string;
  x: string;
  y: string;
  size: string;
  rotate: number;
  font: string;
  opacity: number;
  scratch?: boolean;
  className?: string;
  glow?: boolean;
}

const fragments: Fragment[] = [
  // Phase 1: Birth — single dot
  { text: ".", x: "49%", y: "110vh", size: "10vw", rotate: 0, font: "", opacity: 1, glow: true },

  // Phase 2: The first thoughts — like finding someone's notes
  { text: "I had a name for this once", x: "18%", y: "310vh", size: "3.5vw", rotate: -4, font: "scribble-text", opacity: 0.65, glow: true },
  { text: "forgot it", x: "55%", y: "335vh", size: "1.8vw", rotate: 2, font: "", opacity: 0.35 },
  { text: "something about a door", x: "25%", y: "360vh", size: "3vw", rotate: -1, font: "scribble-text", opacity: 0.5, scratch: true },
  { text: "or a room", x: "60%", y: "375vh", size: "1.4vw", rotate: 0, font: "", opacity: 0.2 },
  { text: "I keep almost remembering", x: "20%", y: "400vh", size: "3.5vw", rotate: -2, font: "scribble-text", opacity: 0.7, glow: true },

  // Phase 3: The mundane uncanny
  { text: "the fridge hums at night", x: "22%", y: "480vh", size: "2vw", rotate: 0, font: "", opacity: 0.4 },
  { text: "and I listen to it", x: "28%", y: "510vh", size: "1.6vw", rotate: 1, font: "", opacity: 0.3 },
  { text: "like it's going to say something", x: "18%", y: "540vh", size: "4vw", rotate: -1, font: "scribble-text", opacity: 0.7, glow: true },

  // Phase 4: The leak — thoughts that weren't meant to be seen
  { text: "everyone I know is pretending", x: "15%", y: "640vh", size: "4.5vw", rotate: -3, font: "scribble-text", opacity: 0.75, glow: true },
  { text: "including me", x: "48%", y: "675vh", size: "3vw", rotate: 1, font: "scribble-text", opacity: 0.5, scratch: true },
  { text: "especially me", x: "52%", y: "690vh", size: "2vw", rotate: -1, font: "scribble-text", opacity: 0.55 },
  { text: "that's fine", x: "60%", y: "720vh", size: "1.8vw", rotate: 0, font: "", opacity: 0.3 },
  { text: "that's fine", x: "63%", y: "738vh", size: "1.3vw", rotate: 0, font: "", opacity: 0.18 },
  { text: "that's fine", x: "65%", y: "752vh", size: "0.9vw", rotate: 0, font: "", opacity: 0.08 },

  // Phase 5: The noise — 3am brain
  { text: "3:47 am", x: "12%", y: "850vh", size: "1.8vw", rotate: 0, font: "", opacity: 0.4 },
  { text: "still here", x: "35%", y: "865vh", size: "2vw", rotate: -1, font: "", opacity: 0.35 },
  { text: "where does the day go", x: "18%", y: "885vh", size: "2.8vw", rotate: 1, font: "", opacity: 0.5 },
  { text: "where does any of it go", x: "25%", y: "910vh", size: "3.2vw", rotate: -1, font: "scribble-text", opacity: 0.6, glow: true },
  { text: "SOMETHING WAS SUPPOSED TO HAPPEN", x: "10%", y: "950vh", size: "6vw", rotate: -2, font: "scribble-text", opacity: 0.9, className: "glitch" },
  { text: "I THINK", x: "30%", y: "1000vh", size: "7vw", rotate: 1, font: "scribble-text", opacity: 0.85, glow: true },
  { text: "I THINK", x: "33%", y: "1020vh", size: "7vw", rotate: 2, font: "scribble-text", opacity: 0.4 },

  // Phase 6: The quiet turn
  { text: "the weird part is", x: "28%", y: "1120vh", size: "2.2vw", rotate: 0, font: "", opacity: 0.45, glow: true },
  { text: "I'm not even sad", x: "25%", y: "1150vh", size: "2vw", rotate: -1, font: "", opacity: 0.4 },
  { text: "I just noticed", x: "30%", y: "1180vh", size: "3.5vw", rotate: 0, font: "scribble-text", opacity: 0.7, glow: true },

  // Phase 7: The address — first time it speaks to you
  { text: "you do this too", x: "30%", y: "1300vh", size: "3.5vw", rotate: 0, font: "scribble-text", opacity: 0.7, glow: true },
  { text: "don't you", x: "38%", y: "1335vh", size: "2.5vw", rotate: 0, font: "scribble-text", opacity: 0.5, glow: true },

  // Phase 8: Silence
  { text: "\u2014", x: "48%", y: "1500vh", size: "3vw", rotate: 0, font: "", opacity: 0.4, glow: true },
];

export default function TextFragments() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const elements = containerRef.current.querySelectorAll(".fragment");

    elements.forEach((el) => {
      const targetOpacity = parseFloat((el as HTMLElement).dataset.targetOpacity || "0.5");

      gsap.fromTo(
        el,
        { opacity: 0, y: 80 },
        {
          opacity: targetOpacity,
          y: 0,
          duration: 1.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 50%",
            scrub: 1,
          },
        }
      );

      gsap.to(el, {
        opacity: 0,
        y: -50,
        scrollTrigger: {
          trigger: el,
          start: "top 10%",
          end: "top -20%",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 pointer-events-none">
      {fragments.map((f, i) => (
        <div
          key={i}
          className={`fragment absolute ${f.font} ${f.className || ""} ${f.glow ? "glow-text" : ""}`}
          data-target-opacity={f.opacity}
          style={{
            left: f.x,
            top: f.y,
            fontSize: f.size,
            transform: `rotate(${f.rotate}deg)`,
            opacity: 0,
            color: "white",
            whiteSpace: "nowrap",
            userSelect: "none",
            textDecoration: f.scratch ? "line-through" : "none",
            textDecorationColor: "rgba(255,255,255,0.5)",
          }}
        >
          {f.text}
        </div>
      ))}
    </div>
  );
}
