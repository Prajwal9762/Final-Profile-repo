import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, Check, Sparkles, X } from 'lucide-react';
import { THEMES, ThemeId, ThemeConfig } from '../utils/theme';
import { soundFx } from '../utils/audio';

interface ThemeSelectorProps {
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onSelectTheme,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const themeList = Object.values(THEMES);

  return (
    <div className="relative">
      <button
        onClick={() => {
          soundFx.playClick();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => soundFx.playHover()}
        data-cursor="PALETTE"
        title="Change Visual Theme & Color Palette"
        className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 text-xs font-mono text-slate-300 hover:border-cyan-500/50 hover:text-white transition-all shadow-sm backdrop-blur-md"
      >
        <div
          className="h-3.5 w-3.5 rounded-full border border-white/20 shadow-sm"
          style={{ backgroundColor: THEMES[currentTheme].colors.primary }}
        />
        <span className="hidden md:inline font-bold">THEME</span>
        <Palette className="h-3.5 w-3.5 text-slate-400" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 z-50 w-72 sm:w-80 rounded-3xl border border-slate-700/80 bg-slate-950/95 p-4 shadow-[0_25px_60px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                  Color Engine & Palette
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-[11px] font-sans text-slate-400 leading-relaxed">
              Switch visual themes instantly across all 3D geometries, canvas particles, glowing gradients, and UI elements.
            </p>

            <div className="mt-4 space-y-2">
              {themeList.map((theme: ThemeConfig) => {
                const isSelected = currentTheme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      soundFx.playSuccess();
                      onSelectTheme(theme.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => soundFx.playHover()}
                    className={`w-full p-3 rounded-2xl text-left transition-all border flex items-center justify-between group ${
                      isSelected
                        ? 'border-white/30 bg-slate-800/90 shadow-lg'
                        : 'border-slate-800/80 bg-slate-900/50 hover:bg-slate-850 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Swatch preview dots */}
                      <div className="flex -space-x-1">
                        <div
                          className="h-5 w-5 rounded-full border border-black/50 shadow-md"
                          style={{ backgroundColor: theme.colors.primary }}
                        />
                        <div
                          className="h-5 w-5 rounded-full border border-black/50 shadow-md"
                          style={{ backgroundColor: theme.colors.secondary }}
                        />
                        <div
                          className="h-5 w-5 rounded-full border border-black/50 shadow-md"
                          style={{ backgroundColor: theme.colors.accent }}
                        />
                      </div>

                      <div>
                        <div className="font-syne text-xs font-bold text-white group-hover:text-cyan-300 transition-colors">
                          {theme.name}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">
                          {theme.subtitle}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-500 text-slate-950 font-bold">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
