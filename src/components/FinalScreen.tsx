import React from 'react';
import { motion } from 'motion/react';
import { ArrowUp, Download, Heart } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { BRAND_LOGO_SRC } from '../utils/brand';

interface FinalScreenProps {
  onScrollTop: () => void;
  onOpenExportGuide: () => void;
}

export const FinalScreen: React.FC<FinalScreenProps> = ({ onScrollTop, onOpenExportGuide }) => {
  return (
    <footer className="relative pt-24 pb-12 overflow-hidden bg-[#040609] border-t border-slate-900">
      {/* Background Radial Glow */}
      <div className="absolute inset-x-0 bottom-0 h-96 bg-radial from-cyan-500/10 via-indigo-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Brand Emblem */}
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 rounded-2xl border border-amber-500/40 bg-black p-0.5 shadow-[0_0_30px_rgba(245,158,11,0.25)]">
            <img
              src={BRAND_LOGO_SRC}
              alt="Prajwal Fox Logo"
              referrerPolicy="no-referrer"
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        </div>

        {/* Giant Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="my-12"
        >
          <h2 className="font-syne text-5xl sm:text-8xl xl:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-cyan-400 to-indigo-400 tracking-tight leading-none uppercase select-none">
            SEE YOU ON THE OTHER SIDE.
          </h2>
        </motion.div>

        {/* Quick Back-to-Top Button */}
        <div className="flex justify-center mb-12">
          <button
            onClick={() => {
              soundFx.playClick();
              onScrollTop();
            }}
            data-cursor="TOP"
            className="group flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-500/40 bg-slate-900/90 text-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.2)] hover:scale-110 hover:border-cyan-300 transition-all"
          >
            <ArrowUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>

        {/* Footer Info Row */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-slate-400">
          <div>
            <span>© 2026 Prajwal Pokharel. </span>
            <span className="text-cyan-400 font-semibold">Built while learning.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenExportGuide}
              className="flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>GitHub Pages Deployment Guide</span>
            </button>

            <span>•</span>

            <a
              href="https://prajwal-pokharel.com.np"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-400 hover:text-cyan-300 transition-colors"
            >
              prajwal-pokharel.com.np
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
