"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ColorShift() {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!overlayRef.current) return;

    // Color journey: black → deep blue → purple → blood red → black again
    const colors = [
      { pos: 0, color: "rgba(5,5,16,0)" },
      { pos: 0.15, color: "rgba(5,5,40,0.3)" },        // deep navy
      { pos: 0.3, color: "rgba(20,5,60,0.25)" },        // dark purple
      { pos: 0.45, color: "rgba(40,5,30,0.2)" },         // dark burgundy
      { pos: 0.6, color: "rgba(80,0,0,0.35)" },          // blood red pulse — WTF moment
      { pos: 0.65, color: "rgba(5,5,16,0)" },            // snap back to black
      { pos: 0.75, color: "rgba(10,5,50,0.2)" },         // purple cosmos
      { pos: 0.9, color: "rgba(5,15,40,0.15)" },         // deep ocean
      { pos: 1.0, color: "rgba(5,5,16,0)" },             // fade to black
    ];

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        // Find which two colors we're between
        let fromColor = colors[0];
        let toColor = colors[1];
        let localProgress = 0;

        for (let i = 0; i < colors.length - 1; i++) {
          if (progress >= colors[i].pos && progress <= colors[i + 1].pos) {
            fromColor = colors[i];
            toColor = colors[i + 1];
            localProgress = (progress - fromColor.pos) / (toColor.pos - fromColor.pos);
            break;
          }
        }

        if (overlayRef.current) {
          overlayRef.current.style.background = `radial-gradient(ellipse at 50% 50%, ${toColor.color}, transparent 70%)`;
          overlayRef.current.style.opacity = String(0.5 + localProgress * 0.5);
        }
      },
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
