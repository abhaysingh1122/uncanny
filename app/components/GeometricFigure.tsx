"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GeometricFigure() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const paths = svgRef.current.querySelectorAll(".draw-path");
    const circles = svgRef.current.querySelectorAll(".geo-circle");
    const triangles = svgRef.current.querySelectorAll(".geo-triangle");
    const figure = svgRef.current.querySelector(".figure-group");
    const glitchParts = svgRef.current.querySelectorAll(".glitch-part");

    // Set initial state — all paths hidden
    paths.forEach((path) => {
      const p = path as SVGPathElement;
      const length = p.getTotalLength();
      gsap.set(p, { strokeDasharray: length, strokeDashoffset: length, opacity: 0 });
    });

    gsap.set(circles, { scale: 0, transformOrigin: "center" });
    gsap.set(triangles, { scale: 0, opacity: 0, transformOrigin: "center" });

    // Phase 1: Draw the geometric shapes (25-35% scroll)
    paths.forEach((path, i) => {
      gsap.to(path, {
        strokeDashoffset: 0,
        opacity: 0.6,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: ".phase-assembly",
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
        delay: i * 0.1,
      });
    });

    circles.forEach((circle, i) => {
      gsap.to(circle, {
        scale: 1,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
        scrollTrigger: {
          trigger: ".phase-assembly",
          start: `top ${70 - i * 10}%`,
          end: "bottom 50%",
          scrub: 1,
        },
      });
    });

    triangles.forEach((tri, i) => {
      gsap.to(tri, {
        scale: 1,
        opacity: 0.5,
        rotation: i * 15,
        duration: 1,
        scrollTrigger: {
          trigger: ".phase-assembly",
          start: "top 60%",
          end: "bottom 30%",
          scrub: 1,
        },
      });
    });

    // Phase 2: Glitch and struggle (50-65%)
    if (figure) {
      gsap.to(figure, {
        x: "random(-10, 10)",
        y: "random(-5, 5)",
        duration: 0.1,
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: ".phase-glitch",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play pause resume pause",
        },
      });
    }

    glitchParts.forEach((part) => {
      gsap.to(part, {
        opacity: "random(0.1, 0.8)",
        x: "random(-20, 20)",
        duration: 0.2,
        repeat: -1,
        yoyo: true,
        scrollTrigger: {
          trigger: ".phase-glitch",
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play pause resume pause",
        },
      });
    });

    // Phase 3: Shatter (65-80%)
    paths.forEach((path, i) => {
      gsap.to(path, {
        opacity: 0,
        x: (Math.random() - 0.5) * 200,
        y: (Math.random() - 0.5) * 200,
        rotation: Math.random() * 360,
        duration: 1,
        scrollTrigger: {
          trigger: ".phase-shatter",
          start: "top 80%",
          end: "bottom 40%",
          scrub: 1,
        },
      });
    });

    circles.forEach((circle) => {
      gsap.to(circle, {
        scale: 0,
        opacity: 0,
        scrollTrigger: {
          trigger: ".phase-shatter",
          start: "top 60%",
          end: "bottom 40%",
          scrub: 1,
        },
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[8] pointer-events-none flex items-center justify-center">
      <svg
        ref={svgRef}
        viewBox="0 0 400 500"
        className="w-[50vw] max-w-[500px] h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ overflow: "visible", border: "none" }}
      >
        <g className="figure-group" style={{ filter: "drop-shadow(0 0 6px rgba(255,255,255,0.2))" }}>
          {/* Head — circle */}
          <circle className="geo-circle" cx="200" cy="100" r="35" stroke="white" strokeWidth="1" opacity="0.7" />
          <circle className="geo-circle" cx="200" cy="100" r="25" stroke="white" strokeWidth="0.6" opacity="0.4" />

          {/* Body lines */}
          <path className="draw-path glitch-part" d="M200 135 L200 280" stroke="white" strokeWidth="1.5" opacity="0.8" />
          <path className="draw-path glitch-part" d="M200 170 L140 230" stroke="white" strokeWidth="1" opacity="0.7" />
          <path className="draw-path glitch-part" d="M200 170 L260 230" stroke="white" strokeWidth="1" opacity="0.7" />
          <path className="draw-path" d="M200 280 L150 380" stroke="white" strokeWidth="1" opacity="0.7" />
          <path className="draw-path" d="M200 280 L250 380" stroke="white" strokeWidth="1" opacity="0.7" />

          {/* Geometric overlays */}
          <polygon className="geo-triangle" points="200,60 165,130 235,130" stroke="white" strokeWidth="0.8" opacity="0.5" fill="none" />
          <polygon className="geo-triangle" points="200,150 160,250 240,250" stroke="white" strokeWidth="0.3" opacity="0.15" fill="none" />
          <polygon className="geo-triangle" points="170,200 200,160 230,200" stroke="white" strokeWidth="0.3" opacity="0.15" fill="none" />

          {/* Connection dots */}
          <circle className="geo-circle" cx="200" cy="170" r="3" fill="white" opacity="0.5" />
          <circle className="geo-circle" cx="140" cy="230" r="2" fill="white" opacity="0.3" />
          <circle className="geo-circle" cx="260" cy="230" r="2" fill="white" opacity="0.3" />
          <circle className="geo-circle" cx="200" cy="280" r="3" fill="white" opacity="0.5" />
          <circle className="geo-circle" cx="150" cy="380" r="2" fill="white" opacity="0.3" />
          <circle className="geo-circle" cx="250" cy="380" r="2" fill="white" opacity="0.3" />

          {/* Abstract connecting lines — like constellation */}
          <path className="draw-path" d="M165 130 Q140 160 140 230" stroke="white" strokeWidth="0.3" opacity="0.15" />
          <path className="draw-path" d="M235 130 Q260 160 260 230" stroke="white" strokeWidth="0.3" opacity="0.15" />
          <path className="draw-path" d="M140 230 Q170 260 200 280" stroke="white" strokeWidth="0.2" opacity="0.1" />
          <path className="draw-path" d="M260 230 Q230 260 200 280" stroke="white" strokeWidth="0.2" opacity="0.1" />

          {/* Orbit rings */}
          <ellipse className="geo-circle" cx="200" cy="200" rx="80" ry="120" stroke="white" strokeWidth="0.2" opacity="0.2" strokeDasharray="4 8" />
          <ellipse className="geo-circle" cx="200" cy="200" rx="120" ry="160" stroke="white" strokeWidth="0.15" opacity="0.05" strokeDasharray="2 12" />
        </g>
      </svg>
    </div>
  );
}
