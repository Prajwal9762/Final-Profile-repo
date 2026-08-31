import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Zap, Sparkles, Eye, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { BRAND_LOGO_SRC } from '../utils/brand';

export const CyberCreature: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [foxMode, setFoxMode] = useState<'solar' | 'cyber'>('solar');
  const [energyLevel, setEnergyLevel] = useState(96);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 500);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 420);

    let mouseX = width / 2;
    let mouseY = height / 2;
    let time = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Fox Geometric Nodes (Symmetric geometric points representing the Solar Fox Sigil)
    const foxNodes = [
      // Nose / Snout
      { id: 'nose', x: 0, y: 70, z: 0 },
      { id: 'snout_L', x: -26, y: 48, z: 0 },
      { id: 'snout_R', x: 26, y: 48, z: 0 },
      { id: 'muzzle_L', x: -16, y: 64, z: 0 },
      { id: 'muzzle_R', x: 16, y: 64, z: 0 },

      // Eyes & Brow
      { id: 'eye_L_inner', x: -28, y: 8, z: 0 },
      { id: 'eye_L_outer', x: -62, y: -4, z: 0 },
      { id: 'eye_R_inner', x: 28, y: 8, z: 0 },
      { id: 'eye_R_outer', x: 62, y: -4, z: 0 },

      // Diamond Forehead Sigil (Crucial feature from logo!)
      { id: 'diamond_top', x: 0, y: -42, z: 0 },
      { id: 'diamond_right', x: 16, y: -24, z: 0 },
      { id: 'diamond_bottom', x: 0, y: -6, z: 0 },
      { id: 'diamond_left', x: -16, y: -24, z: 0 },

      // Forehead & Crown
      { id: 'crown_top', x: 0, y: -68, z: 0 },
      { id: 'forehead_L', x: -35, y: -38, z: 0 },
      { id: 'forehead_R', x: 35, y: -38, z: 0 },

      // Fox Ears (Pointed & Alert)
      { id: 'ear_L_base_in', x: -24, y: -62, z: 0 },
      { id: 'ear_L_base_out', x: -75, y: -42, z: 0 },
      { id: 'ear_L_tip', x: -92, y: -125, z: 0 },

      { id: 'ear_R_base_in', x: 24, y: -62, z: 0 },
      { id: 'ear_R_base_out', x: 75, y: -42, z: 0 },
      { id: 'ear_R_tip', x: 92, y: -125, z: 0 },

      // Cheeks / Fluff Tufts
      { id: 'cheek_L_top', x: -82, y: 12, z: 0 },
      { id: 'cheek_L_mid', x: -105, y: 38, z: 0 },
      { id: 'cheek_L_bot', x: -78, y: 64, z: 0 },

      { id: 'cheek_R_top', x: 82, y: 12, z: 0 },
      { id: 'cheek_R_mid', x: 105, y: 38, z: 0 },
      { id: 'cheek_R_bot', x: 78, y: 64, z: 0 },

      // Chest Fur / Collar
      { id: 'chest_top', x: 0, y: 88, z: 0 },
      { id: 'chest_L', x: -45, y: 115, z: 0 },
      { id: 'chest_mid', x: 0, y: 135, z: 0 },
      { id: 'chest_R', x: 45, y: 115, z: 0 },
    ];

    const foxEdges = [
      // Snout
      ['nose', 'muzzle_L'], ['nose', 'muzzle_R'],
      ['muzzle_L', 'snout_L'], ['muzzle_R', 'snout_R'],
      ['snout_L', 'snout_R'], ['nose', 'chest_top'],

      // Eyes
      ['eye_L_inner', 'eye_L_outer'], ['eye_R_inner', 'eye_R_outer'],
      ['snout_L', 'eye_L_inner'], ['snout_R', 'eye_R_inner'],
      ['snout_L', 'eye_L_outer'], ['snout_R', 'eye_R_outer'],

      // Diamond Forehead
      ['diamond_top', 'diamond_right'], ['diamond_right', 'diamond_bottom'],
      ['diamond_bottom', 'diamond_left'], ['diamond_left', 'diamond_top'],
      ['diamond_bottom', 'eye_L_inner'], ['diamond_bottom', 'eye_R_inner'],
      ['diamond_top', 'crown_top'],
      ['diamond_left', 'forehead_L'], ['diamond_right', 'forehead_R'],

      // Crown & Forehead
      ['crown_top', 'ear_L_base_in'], ['crown_top', 'ear_R_base_in'],
      ['forehead_L', 'ear_L_base_out'], ['forehead_R', 'ear_R_base_out'],
      ['forehead_L', 'crown_top'], ['forehead_R', 'crown_top'],

      // Ears
      ['ear_L_base_in', 'ear_L_tip'], ['ear_L_base_out', 'ear_L_tip'],
      ['ear_R_base_in', 'ear_R_tip'], ['ear_R_base_out', 'ear_R_tip'],

      // Cheeks
      ['ear_L_base_out', 'cheek_L_top'], ['cheek_L_top', 'cheek_L_mid'], ['cheek_L_mid', 'cheek_L_bot'],
      ['ear_R_base_out', 'cheek_R_top'], ['cheek_R_top', 'cheek_R_mid'], ['cheek_R_mid', 'cheek_R_bot'],
      ['cheek_L_bot', 'chest_L'], ['cheek_R_bot', 'chest_R'],
      ['eye_L_outer', 'cheek_L_top'], ['eye_R_outer', 'cheek_R_top'],

      // Chest
      ['chest_top', 'chest_L'], ['chest_top', 'chest_R'],
      ['chest_L', 'chest_mid'], ['chest_R', 'chest_mid'],
    ];

    const particles: Array<{ x: number; y: number; vx: number; vy: number; life: number; color: string }> = [];

    const render = () => {
      time += 0.035;
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2 + Math.sin(time) * 5; // Breathing motion

      // Responsive head tilt towards mouse
      const tiltX = (mouseX - centerX) * 0.12;
      const tiltY = (mouseY - centerY) * 0.12;

      // 1. Draw Solar Halo Ring Behind Head (Signature motif)
      ctx.save();
      ctx.translate(centerX + tiltX * 0.2, centerY + tiltY * 0.2);

      ctx.beginPath();
      ctx.arc(0, -10, 140, 0, Math.PI * 2);
      ctx.strokeStyle = foxMode === 'solar' ? 'rgba(245, 158, 11, 0.4)' : 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 2;
      ctx.shadowColor = foxMode === 'solar' ? '#f59e0b' : '#38bdf8';
      ctx.shadowBlur = 15;
      ctx.stroke();

      // Rotating dashed energy ring
      ctx.rotate(time * 0.2);
      ctx.beginPath();
      ctx.arc(0, -10, 155, 0, Math.PI * 2);
      ctx.strokeStyle = foxMode === 'solar' ? 'rgba(249, 115, 22, 0.25)' : 'rgba(168, 85, 247, 0.25)';
      ctx.setLineDash([10, 14]);
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
      ctx.shadowBlur = 0;

      // 2. Transform Nodes with parallax & head tilt
      const transformedNodes: Record<string, { x: number; y: number }> = {};

      foxNodes.forEach((node) => {
        const x = centerX + node.x + tiltX + Math.sin(time + node.y * 0.05) * 1.5;
        const y = centerY + node.y + tiltY + Math.cos(time + node.x * 0.05) * 1.5;
        transformedNodes[node.id] = { x, y };
      });

      // 3. Draw Wireframe Mesh Edges
      foxEdges.forEach(([fromId, toId]) => {
        const p1 = transformedNodes[fromId];
        const p2 = transformedNodes[toId];
        if (!p1 || !p2) return;

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);

        const strokeColor = foxMode === 'solar' ? '#f97316' : '#38bdf8';
        ctx.strokeStyle = strokeColor;
        ctx.globalAlpha = 0.65;
        ctx.lineWidth = 1.4;
        ctx.stroke();
      });

      // 4. Fill Diamond Forehead Sigil with Radiant Energy
      const dTop = transformedNodes['diamond_top'];
      const dRight = transformedNodes['diamond_right'];
      const dBottom = transformedNodes['diamond_bottom'];
      const dLeft = transformedNodes['diamond_left'];

      if (dTop && dRight && dBottom && dLeft) {
        ctx.beginPath();
        ctx.moveTo(dTop.x, dTop.y);
        ctx.lineTo(dRight.x, dRight.y);
        ctx.lineTo(dBottom.x, dBottom.y);
        ctx.lineTo(dLeft.x, dLeft.y);
        ctx.closePath();
        ctx.fillStyle = foxMode === 'solar' ? 'rgba(254, 240, 138, 0.85)' : 'rgba(224, 242, 254, 0.85)';
        ctx.shadowColor = foxMode === 'solar' ? '#f59e0b' : '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 5. Render Glowing Nodes
      Object.entries(transformedNodes).forEach(([id, pt]) => {
        const isEye = id.startsWith('eye_');
        const isDiamond = id.startsWith('diamond_');
        const isEarTip = id.includes('tip');

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, isEye || isDiamond ? 3.5 : isEarTip ? 4 : 2, 0, Math.PI * 2);

        if (isEye) {
          ctx.fillStyle = '#fbbf24';
          ctx.shadowColor = '#f59e0b';
          ctx.shadowBlur = 14;
          ctx.globalAlpha = 0.95;
        } else if (isDiamond) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#fde047';
          ctx.shadowBlur = 12;
          ctx.globalAlpha = 1;
        } else {
          ctx.fillStyle = foxMode === 'solar' ? '#f97316' : '#38bdf8';
          ctx.shadowColor = foxMode === 'solar' ? '#f97316' : '#38bdf8';
          ctx.shadowBlur = 8;
          ctx.globalAlpha = 0.75;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 6. Glowing Eye Sight Beams tracking cursor
      ['eye_L_inner', 'eye_R_inner'].forEach((eyeId) => {
        const eye = transformedNodes[eyeId];
        if (eye) {
          const dx = mouseX - eye.x;
          const dy = mouseY - eye.y;
          const angle = Math.atan2(dy, dx);

          ctx.beginPath();
          ctx.moveTo(eye.x, eye.y);
          ctx.lineTo(eye.x + Math.cos(angle) * 30, eye.y + Math.sin(angle) * 30);
          ctx.strokeStyle = foxMode === 'solar' ? 'rgba(251, 191, 36, 0.85)' : 'rgba(56, 189, 248, 0.85)';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      // 7. Spawn floating solar sparks from ears
      if (Math.random() < 0.35) {
        const sourcePt = Math.random() < 0.5 ? transformedNodes['ear_L_tip'] : transformedNodes['ear_R_tip'];
        if (sourcePt) {
          particles.push({
            x: sourcePt.x,
            y: sourcePt.y,
            vx: (Math.random() - 0.5) * 1.5,
            vy: -Math.random() * 2 - 0.5,
            life: 1,
            color: foxMode === 'solar' ? '#f59e0b' : '#38bdf8',
          });
        }
      }

      // Render sparks
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;

        if (p.life <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 420;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [foxMode]);

  return (
    <div className="relative rounded-3xl border border-amber-500/30 bg-slate-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden flex flex-col justify-between">
      {/* Background ambient lighting */}
      <div className="absolute top-0 right-0 h-48 w-48 bg-radial from-amber-500/20 via-orange-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Top Header Card Controls */}
      <div className="relative z-10 flex items-center justify-between border-b border-slate-800 pb-4 mb-2">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl border border-amber-500/40 bg-amber-500/10 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
            <img
              src={BRAND_LOGO_SRC}
              alt="Fox Emblem"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="font-syne text-sm font-bold text-white flex items-center gap-1.5">
              <span>SOLAR FOX GUARDIAN</span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
            </h3>
            <p className="font-mono text-[10px] text-amber-400/80">KINETIC MESH // ONLINE</p>
          </div>
        </div>

        {/* Mode Toggle Button */}
        <div className="flex items-center gap-1 p-1 rounded-xl border border-slate-800 bg-slate-900/90 font-mono text-[10px]">
          <button
            onClick={() => {
              soundFx.playClick();
              setFoxMode('solar');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              foxMode === 'solar'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Flame className="h-3 w-3" />
            <span>SOLAR</span>
          </button>
          <button
            onClick={() => {
              soundFx.playClick();
              setFoxMode('cyber');
            }}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
              foxMode === 'cyber'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Zap className="h-3 w-3" />
            <span>CYBER</span>
          </button>
        </div>
      </div>

      {/* Kinetic Canvas Area */}
      <div className="relative h-72 sm:h-80 w-full my-2 flex items-center justify-center">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full cursor-crosshair" />

        {/* Floating instruction overlay */}
        <div className="absolute bottom-2 left-2 rounded-lg border border-slate-800 bg-black/60 px-2.5 py-1 text-[10px] font-mono text-slate-400 backdrop-blur-md pointer-events-none flex items-center gap-1.5">
          <Eye className="h-3 w-3 text-amber-400 animate-pulse" />
          <span>Move cursor to guide vision</span>
        </div>
      </div>

      {/* Bottom Telemetry Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 font-mono text-[10px]">
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-center">
          <span className="text-slate-400 block">CORE SIGIL</span>
          <span className="text-amber-400 font-bold">SOLAR DIAMOND</span>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-center">
          <span className="text-slate-400 block">FREQUENCY</span>
          <span className="text-cyan-400 font-bold">60 FPS REALTIME</span>
        </div>
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-center">
          <span className="text-slate-400 block">HARMONY</span>
          <span className="text-emerald-400 font-bold">{energyLevel}% SYNCHRONIZED</span>
        </div>
      </div>
    </div>
  );
};
