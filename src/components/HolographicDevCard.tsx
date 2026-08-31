import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, QrCode, Cpu, Sparkles, Terminal, Code2, RotateCw, MapPin, Globe, Award, Radio } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { BRAND_LOGO_SRC, BRAND_GITHUB_HANDLE, BRAND_WEBSITE } from '../utils/brand';

export const HolographicDevCard: React.FC = () => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glareX, setGlareX] = useState(50);
  const [glareY, setGlareY] = useState(50);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isNfcActive, setIsNfcActive] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -16;
    const rY = ((x - centerX) / centerX) * 16;

    setRotateX(rX);
    setRotateY(rY);

    setGlareX((x / rect.width) * 100);
    setGlareY((y / rect.height) * 100);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handleFlip = () => {
    soundFx.playClick();
    setIsFlipped(!isFlipped);
  };

  const handleSimulateNfc = () => {
    soundFx.playSuccess();
    setIsNfcActive(true);
    setTimeout(() => setIsNfcActive(false), 1800);
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* 3D Container with Perspective */}
      <div
        className="perspective-1000 select-none py-4"
        style={{ perspective: '1200px' }}
      >
        <motion.div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          animate={{
            rotateX,
            rotateY: isFlipped ? rotateY + 180 : rotateY,
          }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-[320px] sm:w-[380px] h-[520px] rounded-3xl cursor-pointer"
        >
          {/* Holographic Dynamic Glare Shimmer Layer */}
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none z-30 transition-opacity duration-300 opacity-60 mix-blend-color-dodge"
            style={{
              background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45) 0%, rgba(168,85,247,0.3) 30%, rgba(6,182,212,0.2) 60%, transparent 80%)`,
            }}
          />

          {/* FRONT SIDE */}
          <div
            className="absolute inset-0 rounded-3xl border border-white/20 bg-gradient-to-br from-slate-900/95 via-purple-950/80 to-slate-950/95 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Holographic Wireframe Grid */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#a855f7 1px, transparent 1px)',
                backgroundSize: '16px 16px',
              }}
            />

            {/* Card Header */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-400">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-mono text-[9px] uppercase tracking-widest text-purple-400 font-bold">
                    VERIFIED DEVELOPER ID
                  </div>
                  <div className="font-mono text-[10px] text-slate-300 font-bold">
                    DEV-NEP-2026-PP
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="font-mono text-[10px] text-emerald-400 font-bold">ACTIVE</span>
              </div>
            </div>

            {/* Profile Center */}
            <div className="relative z-10 my-auto text-center">
              <div className="relative mx-auto w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500 via-orange-500 to-cyan-500 p-0.5 shadow-[0_0_35px_rgba(249,115,22,0.5)] mb-4 group">
                <div className="w-full h-full rounded-2xl bg-black flex flex-col items-center justify-center overflow-hidden relative">
                  <img
                    src={BRAND_LOGO_SRC}
                    alt="Prajwal Fox Avatar"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <span className="absolute bottom-1 font-mono text-[8px] text-amber-300 font-bold tracking-wider px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-sm border border-amber-500/40">
                    FOX CORE
                  </span>
                </div>
              </div>

              <h3 className="font-syne text-2xl font-extrabold text-white tracking-wide">
                Prajwal Pokharel
              </h3>
              <p className="font-mono text-xs text-purple-300 mt-0.5">
                Full-Stack & Frontend Engineer
              </p>

              <div className="mt-3 flex items-center justify-center gap-2 text-[11px] font-mono text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-rose-400" />
                <span>Kathmandu / Pokhara, Nepal 🇳🇵</span>
              </div>
            </div>

            {/* Stats & Skills Badges */}
            <div className="relative z-10 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                  <div className="text-[9px] text-slate-400">EXP LEVEL</div>
                  <div className="text-xs font-bold text-white">L4 ARCH</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                  <div className="text-[9px] text-slate-400">STACK</div>
                  <div className="text-xs font-bold text-cyan-300">TS / REACT</div>
                </div>
                <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-2">
                  <div className="text-[9px] text-slate-400">STATUS</div>
                  <div className="text-xs font-bold text-emerald-400">OPEN TO WORK</div>
                </div>
              </div>

              {/* Barcode & NFC Trigger */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 font-mono text-[9px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Radio className="h-3 w-3 text-purple-400" />
                  <span>NFC ENABLED</span>
                </div>
                <div className="tracking-widest font-bold text-slate-300">
                  ||| | |||| || | ||||| |||
                </div>
              </div>
            </div>
          </div>

          {/* BACK SIDE */}
          <div
            className="absolute inset-0 rounded-3xl border border-purple-500/40 bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 p-6 shadow-[0_25px_60px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 font-mono text-xs text-purple-300 font-bold">
                <span>SECURITY CREDENTIALS</span>
                <span>v2.6.4</span>
              </div>

              <div className="mt-4 space-y-3 font-mono text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Core Philosophy</div>
                  <div className="mt-1 font-sans text-xs text-slate-200">
                    "Obsessed with smooth 60fps micro-animations, clean software architecture, and building intuitive user experiences."
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                  <div className="text-[10px] text-slate-500 uppercase">Key Proficiencies</div>
                  <div className="text-[11px] text-purple-300">• React 19, TypeScript, Next.js</div>
                  <div className="text-[11px] text-cyan-300">• Three.js WebGL, Tailwind CSS, Motion</div>
                  <div className="text-[11px] text-emerald-300">• RESTful APIs, Node.js, Git Architecture</div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 font-mono text-[10px]">
                <Globe className="h-3.5 w-3.5 text-cyan-400" />
                <span>{BRAND_WEBSITE.replace('https://', '')}</span>
              </div>

              <div className="text-[10px] font-mono text-purple-400 font-bold">
                {BRAND_GITHUB_HANDLE}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Interactive Controls below Card */}
      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleFlip}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-800 bg-slate-900/90 text-xs font-mono text-slate-300 hover:text-white hover:border-purple-500/40 transition-all backdrop-blur-md"
        >
          <RotateCw className="h-3.5 w-3.5 text-purple-400" />
          <span>Flip Card ({isFlipped ? 'Front' : 'Back'})</span>
        </button>

        <button
          onClick={handleSimulateNfc}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-purple-500/40 bg-purple-500/10 text-xs font-mono text-purple-300 hover:bg-purple-500/20 transition-all font-bold"
        >
          <Radio className="h-3.5 w-3.5 animate-pulse" />
          <span>{isNfcActive ? 'NFC Beam Transmitted! ✓' : 'Simulate NFC Tap'}</span>
        </button>
      </div>
    </div>
  );
};
