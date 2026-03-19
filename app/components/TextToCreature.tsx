"use client";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function sampleText(text: string, width: number, height: number, fontSize: number): { x: number; y: number }[] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "white";
  ctx.font = `bold ${fontSize}px 'Segoe Print', 'Comic Sans MS', cursive`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, width / 2, height / 2);

  const imageData = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const alpha = imageData.data[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        points.push({ x: x - width / 2, y: -(y - height / 2) });
      }
    }
  }
  return points;
}

function sampleStickman(width: number, height: number): { x: number; y: number }[] {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  const cx = width / 2;
  const cy = height / 2;
  const scale = Math.min(width, height) * 0.35;

  ctx.strokeStyle = "white";
  ctx.lineWidth = 6;
  ctx.lineCap = "round";

  // Head
  ctx.beginPath();
  ctx.arc(cx, cy - scale * 0.65, scale * 0.18, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.moveTo(cx, cy - scale * 0.47);
  ctx.lineTo(cx, cy + scale * 0.15);
  ctx.stroke();

  // Arms
  ctx.beginPath();
  ctx.moveTo(cx - scale * 0.35, cy - scale * 0.15);
  ctx.lineTo(cx, cy - scale * 0.3);
  ctx.lineTo(cx + scale * 0.35, cy - scale * 0.15);
  ctx.stroke();

  // Legs
  ctx.beginPath();
  ctx.moveTo(cx - scale * 0.3, cy + scale * 0.55);
  ctx.lineTo(cx, cy + scale * 0.15);
  ctx.lineTo(cx + scale * 0.3, cy + scale * 0.55);
  ctx.stroke();

  const imageData = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];

  for (let y = 0; y < height; y += 4) {
    for (let x = 0; x < width; x += 4) {
      const alpha = imageData.data[(y * width + x) * 4 + 3];
      if (alpha > 128) {
        points.push({ x: x - width / 2, y: -(y - height / 2) });
      }
    }
  }
  return points;
}

function matchPointCounts(
  source: { x: number; y: number }[],
  target: { x: number; y: number }[],
  count: number
): { source: { x: number; y: number }[]; target: { x: number; y: number }[] } {
  const pick = (arr: { x: number; y: number }[], n: number) => {
    if (arr.length === 0) return Array.from({ length: n }, () => ({ x: 0, y: 0 }));
    const result: { x: number; y: number }[] = [];
    for (let i = 0; i < n; i++) {
      result.push(arr[Math.floor((i / n) * arr.length)]);
    }
    return result;
  };
  return { source: pick(source, count), target: pick(target, count) };
}

export default function TextToCreature() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const progressRef = useRef(0);
  const dataRef = useRef<{
    source: { x: number; y: number }[];
    target: { x: number; y: number }[];
    count: number;
  } | null>(null);
  const travelRef = useRef(0);
  const dissolveRef = useRef(0);

  const init = useCallback(() => {
    const w = 600;
    const h = 300;
    // No hardcoded text — just start as random scattered particles
    const scatteredPoints: { x: number; y: number }[] = [];
    for (let i = 0; i < 800; i++) {
      scatteredPoints.push({
        x: (Math.random() - 0.5) * w * 0.8,
        y: (Math.random() - 0.5) * h * 0.8,
      });
    }
    const stickmanPoints = sampleStickman(w, h);
    const count = 800;
    const matched = matchPointCounts(scatteredPoints, stickmanPoints, count);
    dataRef.current = { ...matched, count };
  }, []);

  useEffect(() => {
    init();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ScrollTrigger for morph progress
    ScrollTrigger.create({
      trigger: ".phase-morph",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        progressRef.current = self.progress;
      },
    });

    // ScrollTrigger for travel (stickman moves after morphing)
    ScrollTrigger.create({
      trigger: ".phase-travel",
      start: "top 80%",
      end: "bottom 20%",
      scrub: 1,
      onUpdate: (self) => {
        travelRef.current = self.progress;
      },
    });

    // ScrollTrigger for dissolve (stickman scatters and disappears)
    ScrollTrigger.create({
      trigger: ".phase-dissolve",
      start: "top 80%",
      end: "bottom 40%",
      scrub: 1,
      onUpdate: (self) => {
        dissolveRef.current = self.progress;
      },
    });

    let animFrame: number;
    const draw = () => {
      if (!canvas || !dataRef.current) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      const ctx = canvas.getContext("2d")!;
      const { source, target, count } = dataRef.current;
      const progress = progressRef.current;
      const travel = travelRef.current;
      const dissolve = dissolveRef.current;
      const cw = canvas.width;
      const ch = canvas.height;

      ctx.clearRect(0, 0, cw, ch);

      // Don't draw if morph hasn't started or fully dissolved
      if (progress <= 0.01 || dissolve >= 1) {
        animFrame = requestAnimationFrame(draw);
        return;
      }

      const centerX = cw / 2;
      const centerY = ch / 2;

      // Travel offset — stickman moves right and up
      const travelX = travel * cw * 0.4;
      const travelY = -travel * ch * 0.15;
      const travelScale = 1 - travel * 0.3;

      // Scatter noise peaks at progress 0.5
      const scatter = Math.sin(progress * Math.PI) * 80;

      for (let i = 0; i < count; i++) {
        const s = source[i];
        const t = target[i];

        // Lerp between text and stickman
        let x = s.x + (t.x - s.x) * progress;
        let y = s.y + (t.y - s.y) * progress;

        // Add scatter noise in the middle
        const noise = scatter * (Math.sin(i * 0.5 + progress * 10) * 0.5 + 0.5);
        x += Math.sin(i * 1.3 + progress * 5) * noise;
        y += Math.cos(i * 0.7 + progress * 5) * noise;

        // Apply travel offset (only when morph is mostly complete)
        if (progress > 0.8) {
          x = x * travelScale + travelX;
          y = y * travelScale + travelY;
        }

        // Dissolve — particles scatter outward and fade
        if (dissolve > 0) {
          const angle = Math.atan2(y, x) + Math.sin(i * 0.5) * 0.5;
          const explodeForce = dissolve * 300 * (0.5 + Math.random() * 0.5);
          x += Math.cos(angle) * explodeForce;
          y += Math.sin(angle) * explodeForce;
        }

        // Draw particle
        const screenX = centerX + x;
        const screenY = centerY - y;

        const dissolveAlpha = 1 - dissolve;
        const size = (1.5 + Math.sin(i * 0.3) * 0.8) * dissolveAlpha;
        const alpha = (0.4 + progress * 0.4 + Math.sin(i * 0.2) * 0.1) * dissolveAlpha;

        ctx.beginPath();
        ctx.arc(screenX, screenY, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.min(alpha, 0.9)})`;
        ctx.fill();

        // Glow on bigger particles
        if (i % 5 === 0) {
          ctx.beginPath();
          ctx.arc(screenX, screenY, size * 3, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.08})`;
          ctx.fill();
        }
      }

      // Draw connecting lines between nearby particles (constellation feel)
      if (progress > 0.7) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${(progress - 0.7) * 0.15})`;
        ctx.lineWidth = 0.3;
        for (let i = 0; i < count; i += 3) {
          const s1 = source[i], t1 = target[i];
          let x1 = s1.x + (t1.x - s1.x) * progress;
          let y1 = s1.y + (t1.y - s1.y) * progress;
          if (progress > 0.8) { x1 = x1 * travelScale + travelX; y1 = y1 * travelScale + travelY; }

          for (let j = i + 3; j < Math.min(i + 15, count); j += 3) {
            const s2 = source[j], t2 = target[j];
            let x2 = s2.x + (t2.x - s2.x) * progress;
            let y2 = s2.y + (t2.y - s2.y) * progress;
            if (progress > 0.8) { x2 = x2 * travelScale + travelX; y2 = y2 * travelScale + travelY; }

            const dist = Math.hypot(x2 - x1, y2 - y1);
            if (dist < 25) {
              ctx.beginPath();
              ctx.moveTo(centerX + x1, centerY - y1);
              ctx.lineTo(centerX + x2, centerY - y2);
              ctx.stroke();
            }
          }
        }
      }

      animFrame = requestAnimationFrame(draw);
    };

    animFrame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrame);
      window.removeEventListener("resize", resize);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [init]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[9] pointer-events-none"
    />
  );
}
