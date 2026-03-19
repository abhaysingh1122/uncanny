"use client";
import { useEffect, useRef } from "react";

export default function ScribbleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const scribbles: {
      points: { x: number; y: number }[];
      opacity: number;
      speed: number;
      phase: number;
    }[] = [];

    for (let i = 0; i < 15; i++) {
      const points: { x: number; y: number }[] = [];
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      for (let j = 0; j < 20; j++) {
        x += (Math.random() - 0.5) * 80;
        y += (Math.random() - 0.5) * 60;
        points.push({ x, y });
      }
      scribbles.push({
        points,
        opacity: Math.random() * 0.03 + 0.01,
        speed: Math.random() * 0.5 + 0.2,
        phase: Math.random() * Math.PI * 2,
      });
    }

    let animFrame: number;
    const draw = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      scribbles.forEach((s) => {
        const currentOpacity =
          s.opacity * (0.5 + 0.5 * Math.sin(time * 0.001 * s.speed + s.phase));

        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, ${currentOpacity})`;
        ctx.lineWidth = 0.5;
        ctx.lineCap = "round";

        if (s.points.length > 0) {
          ctx.moveTo(s.points[0].x, s.points[0].y);
          for (let i = 1; i < s.points.length - 1; i++) {
            const xc = (s.points[i].x + s.points[i + 1].x) / 2;
            const yc = (s.points[i].y + s.points[i + 1].y) / 2;
            ctx.quadraticCurveTo(s.points[i].x, s.points[i].y, xc, yc);
          }
        }
        ctx.stroke();
      });

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[5] pointer-events-none"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
