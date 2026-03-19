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

  // Phase 2: Scatter — chaos
  { text: "fragmented", x: "18%", y: "310vh", size: "6vw", rotate: -12, font: "scribble-text", opacity: 0.7, glow: true },
  { text: "split", x: "58%", y: "325vh", size: "3vw", rotate: 5, font: "scribble-text", opacity: 0.5 },
  { text: "into a million", x: "30%", y: "345vh", size: "4vw", rotate: -3, font: "scribble-text", opacity: 0.6 },
  { text: "versions", x: "62%", y: "365vh", size: "5vw", rotate: 8, font: "scribble-text", opacity: 0.65, glow: true },
  { text: "none of them complete", x: "12%", y: "390vh", size: "1.4vw", rotate: 0, font: "", opacity: 0.3 },

  // Phase 3: Assembly — forming
  { text: "assembling", x: "22%", y: "470vh", size: "5vw", rotate: -5, font: "scribble-text", opacity: 0.6 },
  { text: "from nothing", x: "40%", y: "500vh", size: "6vw", rotate: 2, font: "scribble-text", opacity: 0.7, glow: true },
  { text: "into something", x: "50%", y: "540vh", size: "7vw", rotate: -1, font: "scribble-text", opacity: 0.75, glow: true },

  // Phase 4: Creation — the maker
  { text: "make", x: "15%", y: "630vh", size: "7vw", rotate: -8, font: "scribble-text", opacity: 0.8, glow: true },
  { text: "destroy", x: "48%", y: "665vh", size: "7vw", rotate: 4, font: "scribble-text", opacity: 0.6, scratch: true },
  { text: "make better", x: "25%", y: "710vh", size: "5vw", rotate: -2, font: "scribble-text", opacity: 0.85, glow: true },
  { text: "repeat", x: "60%", y: "730vh", size: "3vw", rotate: 3, font: "", opacity: 0.4 },
  { text: "repeat", x: "68%", y: "745vh", size: "2vw", rotate: -1, font: "", opacity: 0.25 },
  { text: "repeat", x: "74%", y: "755vh", size: "1.2vw", rotate: 2, font: "", opacity: 0.12 },

  // Phase 5: The Noise — overwhelm
  { text: "too loud", x: "8%", y: "850vh", size: "2.5vw", rotate: 1, font: "", opacity: 0.45 },
  { text: "too fast", x: "28%", y: "865vh", size: "3vw", rotate: -2, font: "", opacity: 0.55 },
  { text: "too much", x: "52%", y: "858vh", size: "2vw", rotate: 3, font: "", opacity: 0.4 },
  { text: "too late", x: "72%", y: "870vh", size: "2.8vw", rotate: -1, font: "", opacity: 0.5 },
  { text: "OVERLOAD", x: "20%", y: "900vh", size: "6vw", rotate: -3, font: "scribble-text", opacity: 0.8, className: "glitch" },
  { text: "CAN'T", x: "42%", y: "940vh", size: "8vw", rotate: 2, font: "scribble-text", opacity: 0.9, glow: true },
  { text: "STOP", x: "35%", y: "990vh", size: "10vw", rotate: -5, font: "scribble-text", opacity: 0.85, glow: true },

  // Phase 6: Revelation
  { text: "maybe", x: "28%", y: "1100vh", size: "3vw", rotate: 0, font: "", opacity: 0.5, glow: true },
  { text: "the broken parts", x: "18%", y: "1130vh", size: "2.5vw", rotate: -1, font: "", opacity: 0.45 },
  { text: "are the design", x: "40%", y: "1160vh", size: "4vw", rotate: 1, font: "scribble-text", opacity: 0.7, glow: true },

  // Phase 7: Constellation — clarity
  { text: "look closer", x: "25%", y: "1280vh", size: "2.5vw", rotate: 0, font: "", opacity: 0.5 },
  { text: "there's a", x: "38%", y: "1310vh", size: "3.5vw", rotate: 0, font: "scribble-text", opacity: 0.6, glow: true },
  { text: "pattern", x: "42%", y: "1345vh", size: "5vw", rotate: -1, font: "scribble-text", opacity: 0.8, glow: true },

  // Phase 8: Silence
  { text: "—", x: "48%", y: "1500vh", size: "3vw", rotate: 0, font: "", opacity: 0.4, glow: true },
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
