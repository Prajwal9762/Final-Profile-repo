import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { soundFx } from '../utils/audio';
import { BRAND_LOGO_SRC } from '../utils/brand';

interface LoadingScreenProps {
  onComplete: () => void;
  forceReplay?: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, forceReplay }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('INITIALIZING CORE MATRIX...');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Check if session flag exists
    const hasLoadedBefore = sessionStorage.getItem('pp_portfolio_loaded');
    if (hasLoadedBefore && !forceReplay) {
      onComplete();
      return;
    }

    const statuses = [
      'INITIALIZING CORE MATRIX...',
      'CALIBRATING INTERACTIVE CURSOR...',
      'SYNTHESIZING CYBERPUNK MESH...',
      'ESTABLISHING CONNECTION...',
      'PRAJWAL POKHAREL PORTFOLIO READY',
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 8) + 4;
      if (currentProgress > 100) currentProgress = 100;

      setProgress(currentProgress);

      const statusIndex = Math.min(
        Math.floor((currentProgress / 100) * statuses.length),
        statuses.length - 1
      );
      setStatusText(statuses[statusIndex]);
      soundFx.playBeep();

      if (currentProgress >= 100) {
        clearInterval(interval);
        sessionStorage.setItem('pp_portfolio_loaded', 'true');
        soundFx.playSuccess();
        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 600);
        }, 300);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [onComplete, forceReplay]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: 'blur(20px)' }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#05070d] text-white overflow-hidden"
        >
          {/* Background Ambient Glow */}
          <div className="absolute h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px] animate-pulse" />
          <div className="absolute h-[30rem] w-[30rem] rounded-full bg-purple-500/10 blur-[150px]" />

          {/* Grid lines background */}
          <div
            className="absolute inset-0 opacity-[0.05] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(#38bdf8 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          {/* Center Logo Box */}
          <div className="relative flex flex-col items-center justify-center z-10 px-4 text-center">
            {/* Glowing Icon Emblem */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-3xl border border-amber-500/40 bg-black shadow-[0_0_50px_rgba(245,158,11,0.35)] backdrop-blur-md overflow-hidden p-1"
            >
              <img
                src={BRAND_LOGO_SRC}
                alt="Prajwal Fox Emblem"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover rounded-2xl"
              />

              {/* Rotating outer ring */}
              <div className="absolute -inset-1 rounded-3xl border-2 border-amber-400/50 border-t-transparent border-b-transparent animate-spin pointer-events-none" />
            </motion.div>

            {/* Name Title */}
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-syne text-2xl sm:text-4xl font-extrabold tracking-wider text-slate-100"
            >
              PRAJWAL POKHAREL
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-2 font-mono text-xs text-cyan-400/80 tracking-widest uppercase"
            >
              {statusText}
            </motion.p>

            {/* Progress Percentage */}
            <div className="mt-8 flex items-baseline gap-1 font-mono">
              <span className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                {progress}
              </span>
              <span className="text-xl text-cyan-400 font-bold">%</span>
            </div>

            {/* Animated Progress Bar */}
            <div className="mt-4 h-1.5 w-64 sm:w-80 overflow-hidden rounded-full bg-slate-800/80 p-0.5 border border-slate-700/50">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 shadow-[0_0_12px_#38bdf8]"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Top/Bottom Cinematic Borders */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
