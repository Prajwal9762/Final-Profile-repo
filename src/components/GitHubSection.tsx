import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Github, Star, GitFork, ExternalLink, Copy, Check, Terminal, Code } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const GitHubSection: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [stars, setStars] = useState(42);

  const handleCopyLink = () => {
    soundFx.playClick();
    navigator.clipboard.writeText('https://github.com/prajwal9762');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="github" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Futuristic Card Wrapper */}
        <div className="glass-panel rounded-3xl border border-cyan-500/40 bg-slate-950/90 p-8 sm:p-12 shadow-[0_25px_60px_rgba(0,0,0,0.7)] relative overflow-hidden">
          {/* Animated Glow Grid Effect */}
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-cyan-500/15 blur-[100px]" />
          <div className="absolute -left-20 -bottom-20 h-80 w-80 rounded-full bg-indigo-500/15 blur-[100px]" />

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative z-10">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-4">
                <Github className="h-3.5 w-3.5 text-cyan-400" />
                <span>05 // OPEN SOURCE PROFILE</span>
              </div>

              <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                @prajwal9762
              </h2>

              <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed font-sans">
                Explore my repositories, experimental code snippets, and active development commits directly on GitHub.
              </p>

              {/* Code activity pulse indicator */}
              <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 font-mono text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-slate-300 font-bold">ACTIVE CODE REPOS</span>
                </span>
                <span>•</span>
                <span className="text-cyan-400">https://github.com/prajwal9762</span>
              </div>
            </div>

            {/* Right Action Box */}
            <div className="flex flex-col items-center gap-4 w-full sm:w-auto">
              <a
                href="https://github.com/prajwal9762"
                target="_blank"
                rel="noopener noreferrer"
                onMouseEnter={() => soundFx.playHover()}
                data-cursor="OPEN GITHUB"
                className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-sky-500 to-indigo-600 px-8 py-4 font-mono text-sm font-bold text-white shadow-[0_0_30px_rgba(56,189,248,0.4)] hover:shadow-[0_0_45px_rgba(56,189,248,0.6)] transition-all active:scale-95"
              >
                <Github className="h-5 w-5 text-white" />
                <span>VISIT GITHUB PROFILE</span>
                <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={handleCopyLink}
                  data-cursor="COPY URL"
                  className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 font-mono text-xs text-slate-300 hover:border-cyan-500/40 hover:text-white transition-all"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4 text-cyan-400" />}
                  <span>{copied ? 'Copied URL!' : 'Copy Profile Link'}</span>
                </button>

                <button
                  onClick={() => {
                    soundFx.playSuccess();
                    setStars(stars + 1);
                  }}
                  data-cursor="STAR"
                  className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-4 py-2.5 font-mono text-xs text-amber-300 hover:border-amber-400/50 transition-all"
                >
                  <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                  <span>{stars}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
