import React, { useEffect, useRef } from 'react';
import { THEMES, ThemeId } from '../utils/theme';
import { BRAND_LOGO_SRC } from '../utils/brand';

export interface BackgroundProps {
  isMobile: boolean;
  isVideoEnabled?: boolean;
  videoSource?: string;
  themeId?: ThemeId;
}

export const VIDEO_PRESETS = [
  {
    id: 'cyber-network',
    name: 'Cyber Network',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-technology-network-lines-movement-27668-large.mp4',
  },
  {
    id: 'digital-data',
    name: 'Digital Data Stream',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-and-data-41538-large.mp4',
  },
  {
    id: 'glowing-dots',
    name: 'Neon Quantum Dust',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-glowing-lines-and-dots-in-a-dark-background-41552-large.mp4',
  },
];

export const InteractiveBackground: React.FC<BackgroundProps> = ({
  isMobile,
  isVideoEnabled = true,
  videoSource = VIDEO_PRESETS[0].url,
  themeId = 'cyan',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const mousePos = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  const activeTheme = THEMES[themeId] || THEMES.cyan;

  // Ensure video plays smoothly when enabled
  useEffect(() => {
    if (videoRef.current) {
      if (isVideoEnabled) {
        videoRef.current.play().catch(() => {
          // Auto-play policy catch
        });
      } else {
        videoRef.current.pause();
      }
    }
  }, [isVideoEnabled, videoSource]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let time = 0;

    const particleCount = isMobile ? 35 : 75;
    const emberCount = isMobile ? 15 : 30;

    // Standard constellation network particles
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
    }> = [];

    // Rising Fox embers
    const embers: Array<{
      x: number;
      y: number;
      vy: number;
      vx: number;
      size: number;
      alpha: number;
      color: string;
      wobble: number;
      wobbleSpeed: number;
    }> = [];

    const emberColors = ['#f97316', '#fb923c', '#fdba74', '#f59e0b', '#fbbf24', '#38bdf8', '#818cf8'];
    const colors = activeTheme.canvasColors;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.5 + 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    for (let i = 0; i < emberCount; i++) {
      embers.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vy: -(Math.random() * 0.8 + 0.4),
        vx: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 3 + 1.2,
        alpha: Math.random() * 0.7 + 0.3,
        color: emberColors[Math.floor(Math.random() * emberColors.length)],
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.04 + 0.02,
      });
    }

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current.targetX = e.clientX;
      mousePos.current.targetY = e.clientY;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      time += 0.015;
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.05;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw Rotating Celestial Fox Ring in Background Center
      const ringCenterX = width * 0.75;
      const ringCenterY = height * 0.45;
      const ringRadius = isMobile ? 140 : 230;

      ctx.save();
      ctx.translate(ringCenterX, ringCenterY);
      ctx.rotate(time * 0.15);

      // Outer Golden Glow Ring
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.18)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
      ctx.shadowBlur = 18;
      ctx.stroke();

      // Dash Orbit Ring
      ctx.beginPath();
      ctx.arc(0, 0, ringRadius * 0.85, 0, Math.PI * 2);
      ctx.setLineDash([12, 16]);
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.16)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);

      // 4 Star Flare Diamonds on the Cardinal Points
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        const starX = Math.cos(angle) * ringRadius;
        const starY = Math.sin(angle) * ringRadius;

        ctx.save();
        ctx.translate(starX, starY);
        ctx.rotate(time * 0.5);

        ctx.beginPath();
        const starSize = 10;
        ctx.moveTo(0, -starSize);
        ctx.lineTo(starSize * 0.35, 0);
        ctx.lineTo(0, starSize);
        ctx.lineTo(-starSize * 0.35, 0);
        ctx.closePath();
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#f59e0b';
        ctx.shadowBlur = 12;
        ctx.fill();
        ctx.restore();
      }

      ctx.restore();
      ctx.shadowBlur = 0;

      // 2. Render Rising Fox Embers
      for (let i = 0; i < embers.length; i++) {
        const e = embers[i];
        e.y += e.vy;
        e.wobble += e.wobbleSpeed;
        e.x += Math.sin(e.wobble) * 0.6 + e.vx;

        if (e.y < -20) {
          e.y = height + 20;
          e.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
        ctx.fillStyle = e.color;
        ctx.globalAlpha = e.alpha * (0.6 + Math.sin(e.wobble) * 0.4);
        ctx.shadowColor = e.color;
        ctx.shadowBlur = 10;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // 3. Draw Constellation Particles & Connection Webs
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130 && !isMobile) {
          const force = (130 - dist) / 130;
          p.x -= (dx / dist) * force * 2.5;
          p.y -= (dy / dist) * force * 2.5;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const pdx = p.x - p2.x;
          const pdy = p.y - p2.y;
          const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

          if (pdist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = activeTheme.colors.primary;
            ctx.globalAlpha = (1 - pdist / 100) * 0.15;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isMobile, themeId, activeTheme]);

  return (
    <div
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden transition-colors duration-700"
      style={{ backgroundColor: activeTheme.colors.bg }}
    >
      {/* Layer 1: Video Background Loop */}
      {isVideoEnabled && (
        <div className="absolute inset-0 transition-opacity duration-1000 opacity-25">
          <video
            ref={videoRef}
            src={videoSource}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover filter brightness-75 contrast-125 saturate-150"
          />
        </div>
      )}

      {/* Layer 2: Dark Vignette Gradient Overlay */}
      <div className="absolute inset-0 bg-radial from-transparent via-[#05070c]/70 to-[#020408]/95 mix-blend-multiply" />

      {/* Layer 3: Animated Ambient Glow Blobs */}
      <div
        className="absolute top-1/4 -left-20 h-96 w-96 rounded-full blur-[130px] animate-pulse-glow transition-colors duration-700 opacity-30"
        style={{ backgroundColor: '#f97316' }}
      />
      <div
        className="absolute bottom-1/3 -right-20 h-[30rem] w-[30rem] rounded-full blur-[150px] animate-pulse-glow transition-colors duration-700 opacity-25"
        style={{ backgroundColor: activeTheme.colors.secondary }}
      />

      {/* Layer 4: Interactive Canvas (Fox Rings + Embers + Particles) */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-90" />

      {/* Layer 5: Fine Cyber Grid Mesh */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(to right, ${activeTheme.colors.primary} 1px, transparent 1px), linear-gradient(to bottom, ${activeTheme.colors.primary} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Layer 6: Subtle Mouse Follow Solar Glow Aura */}
      {!isMobile && (
        <div
          className="absolute h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[100px] transition-transform duration-300 ease-out opacity-25"
          style={{
            left: `${mousePos.current.targetX}px`,
            top: `${mousePos.current.targetY}px`,
            backgroundColor: activeTheme.colors.primary,
          }}
        />
      )}
    </div>
  );
};

