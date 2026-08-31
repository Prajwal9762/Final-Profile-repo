import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import confetti from 'canvas-confetti';

export type VfxMode = 'shockwave' | 'spark' | 'ripple' | 'star' | 'off';

interface VfxEvent {
  id: number;
  x: number;
  y: number;
  mode: VfxMode;
  phrase: string;
}

const VFX_LABEL_MAP: Record<Exclude<VfxMode, 'off'>, string> = {
  shockwave: 'QUANTUM PULSE ⚡',
  spark: 'NEON SPARK 💫',
  ripple: 'ENERGY RIPPLE 🌊',
  star: 'STAR TRAIL 🌌',
};

export const InteractiveFXOverlay: React.FC<{
  currentMode: VfxMode;
  onModeChange: (mode: VfxMode) => void;
}> = ({ currentMode, onModeChange }) => {
  const [events, setEvents] = useState<VfxEvent[]>([]);
  const [dockOpen, setDockOpen] = useState(false);

  const triggerVfxAt = (x: number, y: number, modeOverride?: VfxMode) => {
    const activeMode = modeOverride || currentMode;
    if (activeMode === 'off') return;

    // Trigger audio
    soundFx.playClick();

    // Particle Burst using canvas-confetti
    try {
      const colorSchemes: Record<Exclude<VfxMode, 'off'>, string[]> = {
        shockwave: ['#38bdf8', '#818cf8', '#06b6d4'],
        spark: ['#f43f5e', '#fbbf24', '#a855f7'],
        ripple: ['#06b6d4', '#3b82f6', '#38bdf8'],
        star: ['#a855f7', '#38bdf8', '#facc15'],
      };

      confetti({
        particleCount: activeMode === 'spark' ? 22 : 12,
        spread: 60,
        origin: { x: x / window.innerWidth, y: y / window.innerHeight },
        colors: colorSchemes[activeMode] || ['#38bdf8'],
        scalar: 0.7,
        disableForReducedMotion: true,
      });
    } catch {
      // Fallback
    }

    const newEvent: VfxEvent = {
      id: Date.now() + Math.random(),
      x,
      y,
      mode: activeMode,
      phrase: VFX_LABEL_MAP[activeMode],
    };

    setEvents((prev) => [...prev.slice(-3), newEvent]);

    setTimeout(() => {
      setEvents((prev) => prev.filter((e) => e.id !== newEvent.id));
    }, 900);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('.vfx-dock-container')) return;

      const isInteractive = target.closest(
        'button, a, input, textarea, select, [role="button"], [data-cursor], .interactive-card'
      );

      if (isInteractive) {
        triggerVfxAt(e.clientX, e.clientY);
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [currentMode]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {events.map((ev) => (
          <React.Fragment key={ev.id}>
            {/* Shockwave Rings */}
            {ev.mode === 'shockwave' && (
              <motion.div
                initial={{ scale: 0.1, opacity: 0.9 }}
                animate={{ scale: [0.1, 2.2], opacity: [0.9, 0] }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute pointer-events-none rounded-full border-2 border-cyan-400 bg-cyan-500/10 shadow-[0_0_30px_#38bdf8]"
                style={{
                  width: '80px',
                  height: '80px',
                  left: ev.x - 40,
                  top: ev.y - 40,
                }}
              />
            )}

            {/* Spark Explosive Burst */}
            {ev.mode === 'spark' && (
              <motion.div
                initial={{ scale: 0.2, rotate: 0, opacity: 1 }}
                animate={{ scale: [0.2, 1.6], rotate: 90, opacity: [1, 0] }}
                transition={{ duration: 0.45 }}
                className="absolute pointer-events-none flex items-center justify-center"
                style={{ left: ev.x - 30, top: ev.y - 30 }}
              >
                <div className="w-16 h-16 border-2 border-dashed border-rose-400 rounded-2xl shadow-[0_0_20px_#f43f5e]" />
              </motion.div>
            )}

            {/* Concentric Water Wave Ripple */}
            {ev.mode === 'ripple' && (
              <>
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute pointer-events-none rounded-full border border-sky-400"
                  style={{ width: '100px', height: '100px', left: ev.x - 50, top: ev.y - 50 }}
                />
                <motion.div
                  initial={{ scale: 0.1, opacity: 0.8 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="absolute pointer-events-none rounded-full border border-indigo-400"
                  style={{ width: '100px', height: '100px', left: ev.x - 50, top: ev.y - 50 }}
                />
              </>
            )}

            {/* Star Trail */}
            {ev.mode === 'star' && (
              <motion.div
                initial={{ y: 0, scale: 0.8, opacity: 1 }}
                animate={{ y: -60, scale: 1.3, opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="absolute pointer-events-none font-mono text-cyan-300 text-sm font-extrabold"
                style={{ left: ev.x - 12, top: ev.y - 20 }}
              >
                ✨
              </motion.div>
            )}

            {/* Subtle Floating Label Tag */}
            <motion.div
              initial={{ y: ev.y - 10, x: ev.x - 50, scale: 0.7, opacity: 0 }}
              animate={{ y: ev.y - 50, x: ev.x - 50, scale: 1, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute pointer-events-none rounded-lg border border-cyan-400/60 bg-slate-950/90 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300 shadow-[0_0_15px_rgba(56,189,248,0.4)] backdrop-blur-md"
              style={{ left: 0, top: 0 }}
            >
              {ev.phrase}
            </motion.div>
          </React.Fragment>
        ))}
      </AnimatePresence>

      {/* Floating Interactive FX Dock (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto vfx-dock-container">
        <AnimatePresence>
          {dockOpen && (
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 15 }}
              className="mb-3 rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl flex flex-col gap-1.5 min-w-[210px]"
            >
              <div className="font-mono text-[10px] uppercase tracking-wider text-cyan-400 font-bold px-2 pb-1.5 border-b border-slate-800 flex items-center justify-between">
                <span>✨ CLICK INTERACTION FX</span>
              </div>

              {[
                { id: 'shockwave', label: '⚡ QUANTUM PULSE', desc: 'Glowing neon ring shockwave' },
                { id: 'spark', label: '💫 NEON SPARK', desc: 'Sparkle particle burst' },
                { id: 'ripple', label: '🌊 LIQUID RIPPLE', desc: 'Concentric energy wave' },
                { id: 'star', label: '🌌 STAR TRAIL', desc: 'Aura particle stars' },
                { id: 'off', label: '🚫 MINIMALIST', desc: 'Standard click sound' },
              ].map((item) => {
                const isSelected = currentMode === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onModeChange(item.id as VfxMode);
                      if (item.id !== 'off') {
                        triggerVfxAt(window.innerWidth / 2, window.innerHeight / 2, item.id as VfxMode);
                      }
                    }}
                    className={`flex flex-col text-left px-2.5 py-1.5 rounded-xl transition-all font-mono text-xs ${
                      isSelected
                        ? 'bg-cyan-500/20 border border-cyan-400 text-white shadow-[0_0_15px_rgba(56,189,248,0.3)]'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <span className="font-bold">{item.label}</span>
                    <span className="text-[10px] text-slate-500">{item.desc}</span>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dock Toggle Button */}
        <button
          onClick={() => {
            soundFx.playClick();
            setDockOpen(!dockOpen);
          }}
          data-cursor="FX DOCK"
          className="group flex items-center gap-2 rounded-2xl border border-cyan-400/50 bg-slate-950/90 px-3.5 py-2.5 font-mono text-xs font-bold text-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.3)] hover:scale-105 hover:border-cyan-300 transition-all backdrop-blur-md"
        >
          <span className="text-sm">
            {currentMode === 'shockwave' && '⚡'}
            {currentMode === 'spark' && '💫'}
            {currentMode === 'ripple' && '🌊'}
            {currentMode === 'star' && '🌌'}
            {currentMode === 'off' && '🚫'}
          </span>
          <span className="hidden sm:inline">
            {currentMode === 'off' ? 'FX OFF' : 'INTERACTIVE FX'}
          </span>
          <span className="rounded-md bg-cyan-500/20 px-1.5 py-0.5 text-[10px] text-cyan-400">
            {dockOpen ? 'CLOSE ▲' : 'SELECT ▼'}
          </span>
        </button>
      </div>
    </div>
  );
};
