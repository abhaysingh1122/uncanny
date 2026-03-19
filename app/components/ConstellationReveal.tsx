"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ConstellationReveal() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const stars = svgRef.current.querySelectorAll(".star");
    const lines = svgRef.current.querySelectorAll(".constellation-line");

    gsap.set(stars, { scale: 0, opacity: 0, transformOrigin: "center" });
    lines.forEach((line) => {
      const l = line as SVGLineElement;
      const length = Math.hypot(
        parseFloat(l.getAttribute("x2") || "0") - parseFloat(l.getAttribute("x1") || "0"),
        parseFloat(l.getAttribute("y2") || "0") - parseFloat(l.getAttribute("y1") || "0")
      );
      gsap.set(l, { strokeDasharray: length, strokeDashoffset: length });
    });

    stars.forEach((star, i) => {
      gsap.to(star, {
        scale: 1,
        opacity: 1,
        duration: 0.5,
        ease: "back.out(2)",
        scrollTrigger: {
          trigger: ".phase-constellation",
          start: `top ${80 - i * 2}%`,
          end: "bottom 50%",
          scrub: 1,
        },
      });
    });

    lines.forEach((line, i) => {
      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 1,
        scrollTrigger: {
          trigger: ".phase-constellation",
          start: `top ${65 - i * 3}%`,
          end: "bottom 30%",
          scrub: 1,
        },
      });
    });

    // Slow rotation
    gsap.to(svgRef.current, {
      rotation: 15,
      duration: 1,
      scrollTrigger: {
        trigger: ".phase-constellation",
        start: "top 50%",
        end: "bottom 0%",
        scrub: 1,
      },
    });

    gsap.to(svgRef.current, {
      opacity: 0,
      scale: 0.8,
      scrollTrigger: {
        trigger: ".phase-end",
        start: "top 80%",
        end: "top 20%",
        scrub: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const starPositions = [
    [200, 80], [300, 120], [340, 220], [290, 320], [200, 360],
    [110, 320], [70, 220], [120, 120], [250, 180], [310, 280],
    [130, 280], [230, 270], [350, 180], [170, 190], [270, 110],
    [200, 220], [160, 150], [280, 250],
  ];

  const lineConnections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0],
    [0, 15], [15, 4], [15, 8], [8, 1], [8, 11], [11, 3], [11, 9],
    [9, 2], [5, 10], [10, 11], [6, 13], [13, 15], [7, 16], [16, 0],
    [14, 1], [14, 12], [12, 2], [17, 3], [17, 9],
  ];

  return (
    <div className="fixed inset-0 z-[7] pointer-events-none flex items-center justify-center opacity-0 phase-constellation-container">
      <svg
        ref={svgRef}
        viewBox="0 0 420 440"
        className="w-[65vw] max-w-[650px] h-auto"
        fill="none"
        style={{ filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3))" }}
      >
        {lineConnections.map(([from, to], i) => (
          <line
            key={`line-${i}`}
            className="constellation-line"
            x1={starPositions[from][0]}
            y1={starPositions[from][1]}
            x2={starPositions[to][0]}
            y2={starPositions[to][1]}
            stroke="white"
            strokeWidth="0.6"
            opacity="0.4"
          />
        ))}
        {starPositions.map(([x, y], i) => (
          <g key={`star-${i}`}>
            <circle
              className="star"
              cx={x}
              cy={y}
              r={i % 4 === 0 ? 4 : 2}
              fill="white"
              opacity="0.9"
            />
            {i % 4 === 0 && (
              <circle
                className="star"
                cx={x}
                cy={y}
                r={8}
                fill="none"
                stroke="white"
                strokeWidth="0.3"
                opacity="0.2"
              />
            )}
          </g>
        ))}
      </svg>
    </div>
  );
}
