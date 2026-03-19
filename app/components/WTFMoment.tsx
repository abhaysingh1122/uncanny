"use client";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function WTFMoment() {
  const containerRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const triggered = useRef(false);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: ".phase-glitch",
      start: "top 50%",
      onEnter: () => {
        if (triggered.current) return;
        triggered.current = true;

        const tl = gsap.timeline();

        // Screen shakes violently
        tl.to("main", {
          x: "random(-15, 15)",
          y: "random(-10, 10)",
          duration: 0.05,
          repeat: 20,
          yoyo: true,
          ease: "none",
        });

        // Flash red
        tl.to(flashRef.current, { opacity: 0.6, backgroundColor: "#ff0020", duration: 0.05 }, 0);
        tl.to(flashRef.current, { opacity: 0, duration: 0.1 }, 0.08);
        tl.to(flashRef.current, { opacity: 0.4, backgroundColor: "#ffffff", duration: 0.03 }, 0.15);
        tl.to(flashRef.current, { opacity: 0, duration: 0.1 }, 0.2);
        tl.to(flashRef.current, { opacity: 0.8, backgroundColor: "#ff0020", duration: 0.05 }, 0.35);
        tl.to(flashRef.current, { opacity: 0, duration: 0.3 }, 0.45);

        // Invert colors briefly
        tl.to("main", { filter: "invert(1)", duration: 0.08 }, 0.25);
        tl.to("main", { filter: "invert(0)", duration: 0.08 }, 0.35);
        tl.to("main", { filter: "invert(1) hue-rotate(90deg)", duration: 0.05 }, 0.5);
        tl.to("main", { filter: "none", duration: 0.2 }, 0.6);

        // Show glitch text
        tl.fromTo(containerRef.current,
          { opacity: 0, scale: 3 },
          { opacity: 1, scale: 1, duration: 0.15, ease: "power4.out" },
          0.1
        );
        tl.to(containerRef.current, { opacity: 0, duration: 0.5 }, 1.2);

        // Reset main transform
        tl.set("main", { x: 0, y: 0, filter: "none" }, 1.5);
      },
      once: true,
    });

    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()); };
  }, []);

  return (
    <>
      <div
        ref={flashRef}
        className="fixed inset-0 z-[200] pointer-events-none"
        style={{ opacity: 0, backgroundColor: "#ff0020" }}
      />
      <div
        ref={containerRef}
        className="fixed inset-0 z-[201] pointer-events-none flex items-center justify-center"
        style={{ opacity: 0 }}
      >
        <div className="text-center">
          <div
            className="text-white text-[15vw] font-bold scribble-text"
            style={{
              textShadow: "0 0 30px rgba(255,0,30,0.8), 0 0 60px rgba(255,0,30,0.4), 0 0 120px rgba(255,0,30,0.2)",
            }}
          >
            WAKE UP
          </div>
        </div>
      </div>
    </>
  );
}
