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
  // Phase 1: Birth
  { text: ".", x: "49%", y: "110vh", size: "10vw", rotate: 0, font: "", opacity: 1, glow: true },

  // Phase 2: Scatter
  { text: "scattered", x: "18%", y: "210vh", size: "6vw", rotate: -12, font: "scribble-text", opacity: 0.7, glow: true },
  { text: "into", x: "58%", y: "225vh", size: "3vw", rotate: 5, font: "scribble-text", opacity: 0.5 },
  { text: "a thousand", x: "30%", y: "245vh", size: "4vw", rotate: -3, font: "scribble-text", opacity: 0.6 },
  { text: "pieces", x: "62%", y: "265vh", size: "5vw", rotate: 8, font: "scribble-text", opacity: 0.65, glow: true },
  { text: "that don't remember being whole", x: "12%", y: "290vh", size: "1.4vw", rotate: 0, font: "", opacity: 0.25 },

  // Phase 3: Assembly
  { text: "trying", x: "22%", y: "370vh", size: "5vw", rotate: -5, font: "scribble-text", opacity: 0.6 },
  { text: "to become", x: "40%", y: "395vh", size: "6vw", rotate: 2, font: "scribble-text", opacity: 0.7, glow: true },
  { text: "something", x: "50%", y: "430vh", size: "7vw", rotate: -1, font: "scribble-text", opacity: 0.75, glow: true },

  // Phase 4: Creation
  { text: "i build", x: "15%", y: "520vh", size: "7vw", rotate: -8, font: "scribble-text", opacity: 0.8, glow: true },
  { text: "i break", x: "48%", y: "555vh", size: "7vw", rotate: 4, font: "scribble-text", opacity: 0.6, scratch: true },
  { text: "i build again", x: "25%", y: "600vh", size: "5vw", rotate: -2, font: "scribble-text", opacity: 0.85, glow: true },
  { text: "and again", x: "60%", y: "620vh", size: "3vw", rotate: 3, font: "", opacity: 0.4 },
  { text: "and again", x: "68%", y: "635vh", size: "2vw", rotate: -1, font: "", opacity: 0.25 },
  { text: "and again", x: "74%", y: "645vh", size: "1.2vw", rotate: 2, font: "", opacity: 0.12 },

  // Phase 5: The Noise
  { text: "the noise", x: "8%", y: "720vh", size: "2.5vw", rotate: 1, font: "", opacity: 0.45 },
  { text: "the noise", x: "28%", y: "735vh", size: "3vw", rotate: -2, font: "", opacity: 0.55 },
  { text: "the noise", x: "52%", y: "728vh", size: "2vw", rotate: 3, font: "", opacity: 0.4 },
  { text: "the noise", x: "72%", y: "740vh", size: "2.8vw", rotate: -1, font: "", opacity: 0.5 },
  { text: "THE NOISE", x: "20%", y: "770vh", size: "6vw", rotate: -3, font: "scribble-text", opacity: 0.8, className: "glitch" },
  { text: "NEVER", x: "42%", y: "810vh", size: "8vw", rotate: 2, font: "scribble-text", opacity: 0.9, glow: true },
  { text: "STOPS", x: "35%", y: "860vh", size: "10vw", rotate: -5, font: "scribble-text", opacity: 0.85, glow: true },

  // Phase 6: Revelation
  { text: "what if", x: "28%", y: "970vh", size: "3vw", rotate: 0, font: "", opacity: 0.5, glow: true },
  { text: "the pieces were never", x: "18%", y: "1000vh", size: "2.5vw", rotate: -1, font: "", opacity: 0.45 },
  { text: "meant to fit", x: "40%", y: "1030vh", size: "4vw", rotate: 1, font: "scribble-text", opacity: 0.7, glow: true },

  // Phase 7: Constellation
  { text: "but they made", x: "25%", y: "1150vh", size: "2.5vw", rotate: 0, font: "", opacity: 0.5 },
  { text: "something", x: "38%", y: "1175vh", size: "3.5vw", rotate: 0, font: "scribble-text", opacity: 0.6, glow: true },
  { text: "beautiful", x: "42%", y: "1205vh", size: "5vw", rotate: -1, font: "scribble-text", opacity: 0.8, glow: true },

  // Phase 8: Silence
  { text: "silence", x: "43%", y: "1350vh", size: "3vw", rotate: 0, font: "", opacity: 0.4, glow: true },
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
