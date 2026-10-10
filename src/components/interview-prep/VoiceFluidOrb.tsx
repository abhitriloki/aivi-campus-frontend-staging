import React, { useEffect, useRef } from "react";

interface VoiceFluidOrbProps {
  isAiSpeaking: boolean;
  isUserSpeaking: boolean;
  audioLevel: number; // 0 to 100
  size?: number;
}

export const VoiceFluidOrb: React.FC<VoiceFluidOrbProps> = ({
  isAiSpeaking,
  isUserSpeaking,
  audioLevel,
  size = 280,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = size * 2);
    let height = (canvas.height = size * 2);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const baseRadius = size * 0.45;

      // Increase energy based on speaking state and audioLevel
      const dynamicEnergy = isUserSpeaking
        ? 1.0 + (audioLevel / 100) * 1.5
        : isAiSpeaking
        ? 1.2 + Math.sin(phaseRef.current * 4) * 0.4
        : 0.35 + Math.sin(phaseRef.current * 1.5) * 0.08;

      phaseRef.current += 0.035 * dynamicEnergy;

      // Color themes:
      // AI Speaking: Electric Mint to Cyan / Deep Teal
      // User Speaking: Emerald to Cyan
      // Idle: Ethereal Teal / Mint Glow
      let primaryColor = "#20CFC0"; // Electric Mint
      let secondaryColor = "#1C6B68"; // Deep Teal
      let outerGlow = "rgba(32, 207, 192, 0.25)";

      if (isUserSpeaking) {
        primaryColor = "#10B981"; // Emerald
        secondaryColor = "#06B6D4"; // Cyan
        outerGlow = "rgba(16, 185, 129, 0.4)";
      } else if (isAiSpeaking) {
        primaryColor = "#20CFC0"; // Luminous Mint
        secondaryColor = "#38BDF8"; // Sky Blue
        outerGlow = "rgba(32, 207, 192, 0.5)";
      }

      // 1. Ambient Background Radial Glow
      const glowGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        baseRadius * 0.2,
        centerX,
        centerY,
        baseRadius * 1.8
      );
      glowGrad.addColorStop(0, outerGlow);
      glowGrad.addColorStop(1, "rgba(15, 23, 42, 0)");

      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 1.8, 0, Math.PI * 2);
      ctx.fill();

      // 2. Multi-layer Organic Morphing Fluid Waveform
      const numRings = 3;
      for (let r = 0; r < numRings; r++) {
        ctx.beginPath();
        const numPoints = 64;
        const ringRadius = baseRadius - r * 16;

        for (let i = 0; i <= numPoints; i++) {
          const angle = (i / numPoints) * Math.PI * 2;
          const noise =
            Math.sin(angle * 4 + phaseRef.current + r) * 8 * dynamicEnergy +
            Math.cos(angle * 6 - phaseRef.current * 1.5) * 6 * dynamicEnergy;
          const rad = ringRadius + noise;
          const x = centerX + Math.cos(angle) * rad;
          const y = centerY + Math.sin(angle) * rad;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();

        // Gradient for this ring
        const ringGrad = ctx.createLinearGradient(0, 0, width, height);
        if (r === 0) {
          ringGrad.addColorStop(0, primaryColor);
          ringGrad.addColorStop(1, secondaryColor);
          ctx.fillStyle = ringGrad;
          ctx.globalAlpha = 0.85;
          ctx.fill();
        } else {
          ctx.strokeStyle = r === 1 ? secondaryColor : primaryColor;
          ctx.lineWidth = 3;
          ctx.globalAlpha = 0.5 - r * 0.15;
          ctx.stroke();
        }
      }

      // 3. Central Core Particle Highlight
      ctx.globalAlpha = 1.0;
      const coreGrad = ctx.createRadialGradient(
        centerX - baseRadius * 0.2,
        centerY - baseRadius * 0.2,
        2,
        centerX,
        centerY,
        baseRadius * 0.6
      );
      coreGrad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
      coreGrad.addColorStop(0.4, "rgba(255, 255, 255, 0.2)");
      coreGrad.addColorStop(1, "rgba(255, 255, 255, 0)");

      ctx.fillStyle = coreGrad;
      ctx.beginPath();
      ctx.arc(centerX, centerY, baseRadius * 0.6, 0, Math.PI * 2);
      ctx.fill();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isAiSpeaking, isUserSpeaking, audioLevel, size]);

  return (
    <div className="relative flex items-center justify-center">
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size }}
        className="rounded-full drop-shadow-[0_0_35px_rgba(245,158,11,0.3)] transition-transform duration-300"
      />

      {/* Center Status Ring Badge */}
      <div className="absolute -bottom-8 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700/80 backdrop-blur-md shadow-lg text-xs font-semibold">
        <span
          className={`h-2 w-2 rounded-full animate-pulse ${
            isUserSpeaking
              ? "bg-emerald-400"
              : isAiSpeaking
              ? "bg-amber-400"
              : "bg-slate-400"
          }`}
        />
        <span className="text-slate-200">
          {isUserSpeaking
            ? "Listening to You..."
            : isAiSpeaking
            ? "AI Interviewer Speaking"
            : "Live Full-Duplex Audio"}
        </span>
      </div>
    </div>
  );
};
