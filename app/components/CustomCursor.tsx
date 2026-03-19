"use client";
import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`;
        dotRef.current.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return (
    <div
      ref={dotRef}
      className="fixed pointer-events-none z-[10000]"
      style={{
        width: "6px",
        height: "6px",
        background: "white",
        borderRadius: "50%",
        transform: "translate(-50%, -50%)",
        boxShadow: "0 0 6px rgba(255,255,255,0.4)",
      }}
    />
  );
}
