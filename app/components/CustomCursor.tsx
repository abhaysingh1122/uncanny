"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const trails: HTMLDivElement[] = [];
    for (let i = 0; i < 8; i++) {
      const trail = document.createElement("div");
      trail.style.cssText = `
        position: fixed; pointer-events: none; z-index: 9999;
        width: ${4 - i * 0.3}px; height: ${4 - i * 0.3}px;
        background: rgba(255,255,255,${0.6 - i * 0.07});
        border-radius: 50%; transition: transform ${0.05 + i * 0.03}s ease;
      `;
      document.body.appendChild(trail);
      trails.push(trail);
    }
    trailsRef.current = trails;

    const move = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      }
      trails.forEach((trail, i) => {
        setTimeout(() => {
          trail.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }, i * 40);
      });
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      trails.forEach((t) => t.remove());
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[10000] -translate-x-1/2 -translate-y-1/2"
      style={{
        width: "8px",
        height: "8px",
        background: "white",
        borderRadius: "50%",
        boxShadow: "0 0 20px rgba(255,255,255,0.3), 0 0 60px rgba(255,255,255,0.1)",
      }}
    />
  );
}
