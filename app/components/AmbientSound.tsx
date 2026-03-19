"use client";
import { useEffect, useRef } from "react";

export default function AmbientSound() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const startAudio = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      const ctx = new AudioContext();
      audioCtxRef.current = ctx;

      // Deep drone — low frequency oscillator
      const osc1 = ctx.createOscillator();
      osc1.type = "sine";
      osc1.frequency.value = 55; // Low A
      const gain1 = ctx.createGain();
      gain1.gain.value = 0.04;
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();

      // Second harmonic — slightly detuned for eeriness
      const osc2 = ctx.createOscillator();
      osc2.type = "sine";
      osc2.frequency.value = 82.5; // Slightly off from E
      const gain2 = ctx.createGain();
      gain2.gain.value = 0.025;
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();

      // Third layer — very low sub bass
      const osc3 = ctx.createOscillator();
      osc3.type = "sine";
      osc3.frequency.value = 30;
      const gain3 = ctx.createGain();
      gain3.gain.value = 0.03;
      osc3.connect(gain3);
      gain3.connect(ctx.destination);
      osc3.start();

      // Noise layer — filtered white noise for texture
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = "lowpass";
      noiseFilter.frequency.value = 200;

      const noiseGain = ctx.createGain();
      noiseGain.gain.value = 0.008;

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start();

      // Slow LFO modulation on the drone
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1; // Very slow
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 0.01;
      lfo.connect(lfoGain);
      lfoGain.connect(gain1.gain);
      lfo.start();

      // Fade in
      gain1.gain.setValueAtTime(0, ctx.currentTime);
      gain1.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 3);
      gain2.gain.setValueAtTime(0, ctx.currentTime);
      gain2.gain.linearRampToValueAtTime(0.025, ctx.currentTime + 4);
      gain3.gain.setValueAtTime(0, ctx.currentTime);
      gain3.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 5);
    };

    // Start on first click (browser autoplay policy)
    document.addEventListener("click", startAudio, { once: true });

    return () => {
      document.removeEventListener("click", startAudio);
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return null;
}
