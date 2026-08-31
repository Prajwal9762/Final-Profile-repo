import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Menu, X, RotateCcw, Download, Github, Video, VideoOff, Film } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { VIDEO_PRESETS } from './InteractiveBackground';
import { ThemeSelector } from './ThemeSelector';
import { AmbientSoundPlayer } from './AmbientSoundPlayer';
import { ThemeId, THEMES } from '../utils/theme';
import { BRAND_LOGO_SRC } from '../utils/brand';

interface NavbarProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  onReplayIntro: () => void;
  onOpenExportGuide: () => void;
  onToggleMatrixRain: () => void;
  isMatrixActive: boolean;
  vfxMode: string;
  isVideoBgEnabled: boolean;
  onToggleVideoBg: () => void;
  videoPresetIndex: number;
  onChangeVideoPreset: (index: number) => void;
  currentTheme: ThemeId;
  onSelectTheme: (theme: ThemeId) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onReplayIntro,
  onOpenExportGuide,
  onToggleMatrixRain,
  isMatrixActive,
  vfxMode,
  isVideoBgEnabled,
  onToggleVideoBg,
  videoPresetIndex,
  onChangeVideoPreset,
  currentTheme,
  onSelectTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [nepalTime, setNepalTime] = useState('');
  const [showVideoMenu, setShowVideoMenu] = useState(false);

  const activeThemeObj = THEMES[currentTheme] || THEMES.cyan;

  // Live Nepal Local Time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kathmandu',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setNepalTime(new Intl.DateTimeFormat('en-US', options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'codelab', label: 'Code Lab' },
    { id: 'journey', label: 'Journey' },
    { id: 'github', label: 'GitHub' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    soundFx.playClick();
    onNavigate(id);
    setMobileOpen(false);
  };

  const handleToggleSound = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
    if (!muted) soundFx.playSuccess();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 px-3 sm:px-6 pt-3 sm:pt-5 transition-all duration-300 pointer-events-none">
      <div className="mx-auto max-w-7xl pointer-events-auto">
        <nav
          className={`flex items-center justify-between rounded-3xl px-4 sm:px-6 py-2.5 sm:py-3 transition-all duration-300 border ${
            isScrolled
              ? 'glass-panel shadow-[0_15px_35px_rgba(0,0,0,0.6)] border-white/10 bg-slate-950/85 backdrop-blur-2xl'
              : 'border-white/10 bg-slate-900/50 backdrop-blur-xl'
          }`}
        >
          {/* Logo */}
          <button
            onClick={() => handleNavClick('hero')}
            onMouseEnter={() => soundFx.playHover()}
            data-cursor="HOME"
            className="group flex items-center gap-2.5 text-left shrink-0"
          >
            <div
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border transition-all group-hover:scale-105 shadow-md overflow-hidden bg-black"
              style={{
                borderColor: activeThemeObj.colors.border,
              }}
            >
              <img
                src={BRAND_LOGO_SRC}
                alt="Prajwal Fox Logo"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-20 group-hover:opacity-40 transition-opacity"
                style={{ boxShadow: `inset 0 0 8px ${activeThemeObj.colors.primary}` }}
              />
            </div>
            <div className="hidden sm:block">
              <span className="block font-syne text-sm font-extrabold tracking-wide text-white leading-tight">
                PRAJWAL POKHAREL
              </span>
              <span className="block font-mono text-[10px] text-slate-400">
                Full-Stack & UI Architect
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 rounded-full border border-slate-800 bg-slate-900/60 p-1 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onMouseEnter={() => soundFx.playHover()}
                  data-cursor={item.label.toUpperCase()}
                  className={`relative px-3.5 py-1.5 text-xs font-mono font-medium transition-all rounded-full ${
                    isActive ? 'text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBackground"
                      className="absolute inset-0 rounded-full shadow-lg"
                      style={{
                        backgroundColor: `${activeThemeObj.colors.primary}25`,
                        border: `1px solid ${activeThemeObj.colors.primary}60`,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Tools: Theme Palette, Lo-Fi Audio, Video BG, Audio Sound FX, Deploy Guide */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Theme Selector Dropdown */}
            <ThemeSelector currentTheme={currentTheme} onSelectTheme={onSelectTheme} />

            {/* Ambient Lo-Fi Beats Synthesizer */}
            <AmbientSoundPlayer />

            {/* Video Background Dropdown */}
            <div className="relative hidden md:block">
              <button
                onClick={() => {
                  soundFx.playClick();
                  setShowVideoMenu(!showVideoMenu);
                }}
                onMouseEnter={() => soundFx.playHover()}
                data-cursor="VIDEO"
                title="Video Background Stream"
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
                  isVideoBgEnabled
                    ? 'border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                    : 'border-slate-800 bg-slate-900/90 text-slate-400 hover:border-slate-700'
                }`}
              >
                {isVideoBgEnabled ? (
                  <Video className="h-3.5 w-3.5 text-cyan-400" />
                ) : (
                  <VideoOff className="h-3.5 w-3.5 text-slate-500" />
                )}
                <span className="hidden lg:inline font-bold">VIDEO BG</span>
              </button>

              <AnimatePresence>
                {showVideoMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-12 z-50 w-56 rounded-3xl border border-slate-800 bg-slate-950/95 p-3 shadow-[0_20px_50px_rgba(0,0,0,0.9)] backdrop-blur-xl font-mono text-xs"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[10px] text-cyan-400 font-bold">
                      <span className="flex items-center gap-1">
                        <Film className="h-3 w-3" />
                        <span>VIDEO BACKGROUND</span>
                      </span>
                      <button
                        onClick={onToggleVideoBg}
                        className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          isVideoBgEnabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        }`}
                      >
                        {isVideoBgEnabled ? 'ON' : 'OFF'}
                      </button>
                    </div>

                    <div className="mt-2 space-y-1">
                      {VIDEO_PRESETS.map((preset, idx) => {
                        const isSelected = isVideoBgEnabled && videoPresetIndex === idx;
                        return (
                          <button
                            key={preset.id}
                            onClick={() => {
                              soundFx.playClick();
                              if (!isVideoBgEnabled) onToggleVideoBg();
                              onChangeVideoPreset(idx);
                              setShowVideoMenu(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-xl transition-all flex items-center justify-between ${
                              isSelected
                                ? 'bg-cyan-500/20 border border-cyan-400 text-white font-bold'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                            }`}
                          >
                            <span>{preset.name}</span>
                            {isSelected && <span className="text-[10px] text-cyan-400">●</span>}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sound FX Mute Toggle */}
            <button
              onClick={handleToggleSound}
              onMouseEnter={() => soundFx.playHover()}
              data-cursor={isMuted ? 'UNMUTE' : 'MUTE'}
              title={isMuted ? 'Unmute Sound Effects' : 'Mute Sound Effects'}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-slate-400 hover:text-white transition-all"
            >
              {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-slate-300" />}
            </button>

            {/* Live Nepal Time Badge */}
            <div className="hidden 2xl:flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-[11px] font-mono text-slate-300">
              <span className="text-rose-400">🇳🇵 NPT:</span>
              <span>{nepalTime || 'Kathmandu'}</span>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => {
                soundFx.playClick();
                setMobileOpen(!mobileOpen);
              }}
              data-cursor="MENU"
              className="flex xl:hidden h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/90 text-white"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Animated Menu Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-x-4 top-20 z-50 rounded-3xl border border-slate-800 bg-slate-950/95 p-6 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)] xl:hidden pointer-events-auto"
          >
            <div className="flex flex-col gap-2.5">
              {navItems.map((item, index) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center justify-between rounded-2xl p-3 text-left font-syne text-base font-bold transition-all ${
                      isActive
                        ? 'bg-purple-500/20 text-white border border-purple-500/40 shadow-md'
                        : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs text-slate-500">0{index + 1}</span>
                  </button>
                );
              })}

              <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
                <button
                  onClick={() => {
                    onOpenExportGuide();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600/20 border border-indigo-500/40 p-3 text-xs font-mono text-indigo-300 font-bold"
                >
                  <Download className="h-4 w-4" />
                  <span>GitHub Pages Deployment Guide</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
