import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  isActive: boolean;
  onClose: () => void;
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ isActive, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isActive) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01PRAJWALPOKHARELDEVELOPERREACTTYPESCRIPTNEPALCYBER2026';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = Array(columns).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(8, 11, 17, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#06b6d4'; // Cyan Matrix rain font
      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head character in bright white-cyan
        if (Math.random() > 0.85) {
          ctx.fillStyle = '#ffffff';
        } else {
          ctx.fillStyle = i % 2 === 0 ? '#38bdf8' : '#3b82f6';
        }

        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />
      
      {/* CRT Scanline & Glitch overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* Exit Button */}
      <div className="absolute top-20 right-6 z-50 pointer-events-auto">
        <button
          onClick={onClose}
          className="rounded-xl border border-cyan-400 bg-slate-950/90 px-4 py-2 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)] hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center gap-2"
        >
          <span>⚡ EXIT MATRIX MODE</span>
        </button>
      </div>
    </div>
  );
};
