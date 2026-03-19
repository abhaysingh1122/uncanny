"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ScribbleCreature() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".creature-path");

    // Set all paths to hidden (stroke-dashoffset = full length)
    paths.forEach((path) => {
      const p = path as SVGPathElement;
      const length = p.getTotalLength();
      gsap.set(p, { strokeDasharray: length, strokeDashoffset: length, opacity: 1 });
    });

    // Draw creature as you scroll through its phase
    paths.forEach((path, i) => {
      const p = path as SVGPathElement;
      gsap.to(p, {
        strokeDashoffset: 0,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".phase-creature",
          start: `top ${85 - i * 5}%`,
          end: `top ${40 - i * 3}%`,
          scrub: 1,
        },
      });
    });

    // Creature walks — translate right on further scroll
    gsap.to(svgRef.current, {
      x: 300,
      y: -50,
      scale: 0.8,
      scrollTrigger: {
        trigger: ".phase-creature-walk",
        start: "top 80%",
        end: "bottom 30%",
        scrub: 1,
      },
    });

    // Creature dissolves
    gsap.to(svgRef.current, {
      opacity: 0,
      scale: 0.3,
      filter: "blur(10px)",
      scrollTrigger: {
        trigger: ".phase-creature-dissolve",
        start: "top 80%",
        end: "bottom 50%",
        scrub: 1,
      },
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div className="fixed inset-0 z-[8] pointer-events-none flex items-center justify-center opacity-0 creature-wrapper">
      <svg
        ref={svgRef}
        viewBox="0 0 400 500"
        className="w-[40vw] max-w-[450px] h-auto"
        fill="none"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.15))" }}
      >
        {/* Head — scribbled circle */}
        <path className="creature-path" d="M200 90 C220 75, 245 80, 250 100 C255 120, 240 140, 220 142 C200 144, 178 138, 172 118 C168 100, 180 85, 200 90 Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
        {/* Second scribble pass on head */}
        <path className="creature-path" d="M195 88 C218 72, 248 82, 253 105 C256 125, 238 145, 218 146 C198 147, 175 140, 170 115 C166 95, 178 82, 195 88" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.35" />

        {/* Eyes — dots with scribble */}
        <path className="creature-path" d="M190 108 C192 104, 196 104, 198 108 C200 112, 196 114, 192 112 C189 110, 188 108, 190 108" stroke="white" strokeWidth="1.2" fill="white" fillOpacity="0.5" opacity="0.8" />
        <path className="creature-path" d="M218 106 C220 102, 224 102, 226 106 C228 110, 224 112, 220 110 C217 108, 216 106, 218 106" stroke="white" strokeWidth="1.2" fill="white" fillOpacity="0.5" opacity="0.8" />

        {/* Mouth — crooked line */}
        <path className="creature-path" d="M195 125 C200 130, 210 132, 220 128" stroke="white" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

        {/* Neck */}
        <path className="creature-path" d="M205 142 C203 155, 207 160, 205 170" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />

        {/* Body — scribbled oval */}
        <path className="creature-path" d="M165 175 C155 200, 152 250, 165 290 C175 315, 225 320, 240 290 C255 260, 252 210, 240 180 C232 165, 178 160, 165 175 Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" opacity="0.6" />
        {/* Body second pass */}
        <path className="creature-path" d="M168 178 C158 205, 155 248, 167 288 C178 312, 228 318, 238 288 C250 258, 248 212, 238 182 C230 168, 180 163, 168 178" stroke="white" strokeWidth="0.7" strokeLinecap="round" opacity="0.25" />

        {/* Left arm — scribbled */}
        <path className="creature-path" d="M165 195 C145 210, 120 225, 105 240 C95 250, 100 255, 110 248 C118 242, 125 250, 115 260" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        {/* Fingers scribble */}
        <path className="creature-path" d="M115 260 C110 265, 108 270, 112 268 M115 260 C118 268, 120 272, 118 270 M115 260 C113 267, 115 275, 116 272" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

        {/* Right arm — scribbled */}
        <path className="creature-path" d="M240 200 C260 215, 285 228, 298 242 C308 252, 304 258, 295 250 C288 244, 282 252, 290 262" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />
        {/* Fingers scribble */}
        <path className="creature-path" d="M290 262 C295 267, 298 272, 294 270 M290 262 C287 269, 285 274, 288 271 M290 262 C292 268, 290 276, 291 273" stroke="white" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />

        {/* Left leg — scribbled */}
        <path className="creature-path" d="M185 310 C175 340, 165 370, 158 400 C155 415, 148 425, 140 430 C135 432, 132 428, 138 425 C145 420, 150 415, 155 430 C158 440, 162 445, 160 440" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

        {/* Right leg — scribbled */}
        <path className="creature-path" d="M220 310 C228 342, 238 372, 245 400 C248 415, 255 425, 262 430 C267 432, 270 428, 264 425 C258 420, 252 415, 248 430 C245 440, 242 445, 244 440" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.55" />

        {/* Random scribble marks around the creature — gives it that "raw sketch" feel */}
        <path className="creature-path" d="M150 160 C145 155, 140 158, 142 163" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path className="creature-path" d="M255 165 C260 160, 265 163, 263 168" stroke="white" strokeWidth="0.5" opacity="0.2" />
        <path className="creature-path" d="M130 280 C125 285, 128 290, 133 287" stroke="white" strokeWidth="0.5" opacity="0.15" />
        <path className="creature-path" d="M275 275 C280 280, 277 285, 272 282" stroke="white" strokeWidth="0.5" opacity="0.15" />

        {/* Scattered dots around — like eraser marks */}
        <circle className="creature-path" cx="140" cy="200" r="1" fill="white" opacity="0.2" />
        <circle className="creature-path" cx="270" cy="220" r="1.5" fill="white" opacity="0.15" />
        <circle className="creature-path" cx="155" cy="350" r="1" fill="white" opacity="0.2" />
        <circle className="creature-path" cx="250" cy="360" r="1.2" fill="white" opacity="0.15" />
      </svg>
    </div>
  );
}
