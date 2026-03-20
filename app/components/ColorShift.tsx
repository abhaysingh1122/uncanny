"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Hex to RGB helper
function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// Lerp between two RGB colors
function lerpColor(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  const r = Math.round(a[0] + (b[0] - a[0]) * t);
  const g = Math.round(a[1] + (b[1] - a[1]) * t);
  const bl = Math.round(a[2] + (b[2] - a[2]) * t);
  return `rgb(${r}, ${g}, ${bl})`;
}

export default function ColorShift() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    // Color stops: position -> color
    const stops: { pos: number; color: [number, number, number] }[] = [
      { pos: 0.0, color: hexToRgb("#050510") },   // Pure black
      { pos: 0.2, color: hexToRgb("#0a0a2e") },   // Deep midnight blue
      { pos: 0.4, color: hexToRgb("#1a0a2e") },   // Dark purple
      { pos: 0.6, color: hexToRgb("#2e0a0a") },   // Deep red
      { pos: 0.8, color: hexToRgb("#1a0a2e") },   // Back through purple
      { pos: 1.0, color: hexToRgb("#050510") },   // Back to black
    ];

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.5,
      onUpdate: (self) => {
        const progress = self.progress;

        // Find which two stops we're between
        let from = stops[0];
        let to = stops[1];
        let localProgress = 0;

        for (let i = 0; i < stops.length - 1; i++) {
          if (progress >= stops[i].pos && progress <= stops[i + 1].pos) {
            from = stops[i];
            to = stops[i + 1];
            localProgress = (progress - from.pos) / (to.pos - from.pos);
            break;
          }
        }

        const color = lerpColor(from.color, to.color, localProgress);

        if (overlayRef.current) {
          overlayRef.current.style.background = color;
        }

        // Also update the body and html background for seamless look
        document.body.style.backgroundColor = color;
        document.documentElement.style.backgroundColor = color;
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[-1] pointer-events-none"
      style={{ background: "#050510" }}
    />
  );
}
