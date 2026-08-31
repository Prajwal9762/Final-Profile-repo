import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles, MapPin, Globe, Code, Terminal, Github, CreditCard, Box } from 'lucide-react';
import { HeroVisual } from './HeroVisual';
import { HolographicDevCard } from './HolographicDevCard';
import { soundFx } from '../utils/audio';
import { THEMES, ThemeId } from '../utils/theme';
import { BRAND_LOGO_SRC } from '../utils/brand';

interface HeroProps {
  onExplore: () => void;
  isMobile: boolean;
  themeId?: ThemeId;
}

export const Hero: React.FC<HeroProps> = ({ onExplore, isMobile, themeId = 'cyan' }) => {
  const [typedText, setTypedText] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [visualMode, setVisualMode] = useState<'3d' | 'card'>('3d');

  const activeTheme = THEMES[themeId] || THEMES.cyan;

  const roles = [
    'Software Engineer',
    'Full-Stack Developer',
    'Creative UI Architect',
    'Algorithm Enthusiast',
    'Open Source Builder',
  ];

  useEffect(() => {
    const currentRole = roles[typingIndex];
    const speed = isDeleting ? 35 : 80;

    const timeout = setTimeout(() => {
      if (!isDeleting && typedText === currentRole) {
        setTimeout(() => setIsDeleting(true), 1600);
      } else if (isDeleting && typedText === '') {
        setIsDeleting(false);
        setTypingIndex((prev) => (prev + 1) % roles.length);
      } else {
        setTypedText(
          currentRole.substring(0, isDeleting ? typedText.length - 1 : typedText.length + 1)
        );
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, typingIndex]);

  const firstName = 'PRAJWAL'.split('');
  const lastName = 'POKHAREL'.split('');

  return (
    <section id="hero" className="relative min-h-screen pt-28 sm:pt-36 pb-16 flex flex-col justify-center">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
        {/* Status Badges Row */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 mb-6"
        >
          {/* Brand Emblem Avatar Tag */}
          <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <img
              src={BRAND_LOGO_SRC}
              alt="Fox Sigil"
              referrerPolicy="no-referrer"
              className="h-4 w-4 rounded-full object-cover border border-amber-400/50"
            />
            <span className="font-bold tracking-wider">SOLAR FOX SIGIL</span>
          </div>

          <div
            className="flex items-center gap-2 rounded-full border px-3.5 py-1 text-xs font-mono backdrop-blur-md transition-colors"
            style={{
              borderColor: activeTheme.colors.border,
              backgroundColor: `${activeTheme.colors.primary}15`,
              color: activeTheme.colors.primary,
            }}
          >
            <span className="relative flex h-2 w-2">
              <span
                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ backgroundColor: activeTheme.colors.primary }}
              />
              <span
                className="relative inline-flex rounded-full h-2 w-2"
                style={{ backgroundColor: activeTheme.colors.primary }}
              />
            </span>
            <span>AVAILABLE TO BUILD & COLLABORATE</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-xs font-mono text-slate-300 backdrop-blur-md">
            <MapPin className="h-3.5 w-3.5 text-rose-400" />
            <span>Kathmandu, Nepal 🇳🇵</span>
          </div>

          <a
            href="https://prajwal-pokharel.com.np"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/60 px-3.5 py-1 text-xs font-mono text-slate-300 hover:border-slate-700 hover:text-white transition-all backdrop-blur-md"
          >
            <Globe className="h-3.5 w-3.5 text-cyan-400" />
            <span>prajwal-pokharel.com.np</span>
          </a>

          {/* Visual Mode Selector Switch */}
          <div className="ml-auto hidden md:flex items-center gap-1 p-1 rounded-xl border border-slate-800 bg-slate-900/80 font-mono text-[11px]">
            <button
              onClick={() => {
                soundFx.playClick();
                setVisualMode('3d');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                visualMode === '3d'
                  ? 'bg-slate-800 text-white font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Box className="h-3 w-3" />
              <span>3D WEBGL</span>
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setVisualMode('card');
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                visualMode === 'card'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="h-3 w-3" />
              <span>HOLO PASS</span>
            </button>
          </div>
        </motion.div>

        {/* Main Grid: Kinetic Typography + 3D Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Kinetic Assembling Title */}
            <h1 className="font-syne font-extrabold text-5xl sm:text-7xl xl:text-8xl tracking-tight leading-none text-white select-none">
              {/* PRAJWAL */}
              <div className="flex overflow-hidden">
                {firstName.map((char, index) => (
                  <motion.span
                    key={`fn-${index}`}
                    initial={{ y: 100, opacity: 0, rotateX: 90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block hover:opacity-80 transition-opacity duration-200"
                  >
                    {char}
                  </motion.span>
                ))}
              </div>

              {/* POKHAREL with Gradient */}
              <div className="flex overflow-hidden mt-1 sm:mt-2">
                {lastName.map((char, index) => (
                  <motion.span
                    key={`ln-${index}`}
                    initial={{ y: 100, opacity: 0, rotateX: 90 }}
                    animate={{ y: 0, opacity: 1, rotateX: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="inline-block text-transparent bg-clip-text bg-gradient-to-r hover:scale-105 transition-transform"
                    style={{
                      backgroundImage: `linear-gradient(to right, ${activeTheme.colors.primary}, ${activeTheme.colors.secondary}, ${activeTheme.colors.accent})`,
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
            </h1>

            {/* Subtitle with Typewriter Role */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex flex-wrap items-center gap-2 font-mono text-lg sm:text-2xl text-slate-300"
            >
              <span style={{ color: activeTheme.colors.primary }} className="font-bold">&gt;</span>
              <span className="text-slate-400 font-light">Crafting</span>
              <span
                className="font-bold text-white underline decoration-2 underline-offset-4"
                style={{ textDecorationColor: activeTheme.colors.primary }}
              >
                {typedText}
              </span>
              <span
                className="animate-pulse"
                style={{ color: activeTheme.colors.primary }}
              >
                |
              </span>
            </motion.div>

            {/* Concise Mission Statement */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="mt-5 max-w-2xl text-slate-400 text-sm sm:text-base leading-relaxed font-sans"
            >
              Building high-performance web applications, interactive WebGL experiences, and robust algorithmic tooling from Kathmandu, Nepal. Focused on clean TypeScript architecture, fluid micro-interactions, and real software that works flawlessly.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => {
                  soundFx.playClick();
                  onExplore();
                }}
                data-cursor="EXPLORE"
                className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl px-6 py-3.5 text-sm font-semibold text-white transition-all shadow-xl active:scale-95"
                style={{
                  background: `linear-gradient(to right, ${activeTheme.colors.primary}, ${activeTheme.colors.secondary})`,
                  boxShadow: `0 10px 30px ${activeTheme.colors.glow}`,
                }}
              >
                <span>EXPLORE PORTFOLIO</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>

              <a
                href="https://github.com/prajwal9762"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundFx.playHover()}
                data-cursor="GITHUB"
                className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-slate-500 hover:text-white transition-all backdrop-blur-md shadow-lg"
              >
                <Github className="h-4 w-4" style={{ color: activeTheme.colors.primary }} />
                <span>GitHub Profile</span>
              </a>
            </motion.div>
          </div>

          {/* Right Visual: 3D Polyhedron / Holographic Dev Pass */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="lg:col-span-5"
          >
            {visualMode === '3d' ? (
              <HeroVisual isMobile={isMobile} themeId={themeId} />
            ) : (
              <HolographicDevCard />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
