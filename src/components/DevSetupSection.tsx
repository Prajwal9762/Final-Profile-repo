import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Monitor, Terminal, Laptop, Coffee, Keyboard, Cpu, Code2, Sparkles, Check, Flame } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const DevSetupSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'editor' | 'hardware' | 'workflow'>('editor');

  return (
    <section className="relative py-16 sm:py-24 border-t border-slate-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-mono text-pink-300 mb-3">
              <Laptop className="h-3.5 w-3.5 text-pink-400" />
              <span>05 // WORKSTATION & GEAR</span>
            </div>
            <h2 className="font-syne text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
              DEV SETUP & ENVIRONMENT
            </h2>
            <p className="mt-2 text-slate-400 text-sm max-w-xl">
              The tools, configurations, and environment powering everyday engineering and fast prototyping.
            </p>
          </div>

          {/* Sub-tabs */}
          <div className="flex gap-2 p-1 rounded-2xl border border-slate-800 bg-slate-900/90 font-mono text-xs">
            {[
              { id: 'editor', label: 'VS CODE & SHELL' },
              { id: 'hardware', label: 'HARDWARE' },
              { id: 'workflow', label: 'STACK & HABITS' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  soundFx.playClick();
                  setActiveTab(tab.id as 'editor' | 'hardware' | 'workflow');
                }}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-pink-500/20 text-pink-300 border border-pink-500/40 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeTab === 'editor' && (
            <>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Code2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Editor & IDE</h3>
                    <p className="font-mono text-xs text-slate-400">VS Code & Neovim</p>
                  </div>
                </div>
                <ul className="space-y-2.5 font-mono text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Theme:</strong> Tokyo Night / Catppuccin Mocha</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Font:</strong> JetBrains Mono + Fira Code Ligatures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Extensions:</strong> Tailwind CSS IntelliSense, Pretty TypeScript Errors, GitLens</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Shell & CLI</h3>
                    <p className="font-mono text-xs text-slate-400">Zsh + Starship</p>
                  </div>
                </div>
                <ul className="space-y-2.5 font-mono text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Prompt:</strong> Starship Cross-Shell Prompt</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Plugins:</strong> zsh-autosuggestions, zsh-syntax-highlighting</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Package Managers:</strong> pnpm, npm, bun</span>
                  </li>
                </ul>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Browser & DevTools</h3>
                    <p className="font-mono text-xs text-slate-400">Chrome Canary + React Tools</p>
                  </div>
                </div>
                <ul className="space-y-2.5 font-mono text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Inspectors:</strong> React Developer Tools, Redux DevTools</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Performance:</strong> Lighthouse, Web Vitals, Memory Profiler</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span><strong>Design:</strong> Pixel Parallel, ColorZilla, VisBug</span>
                  </li>
                </ul>
              </div>
            </>
          )}

          {activeTab === 'hardware' && (
            <>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Development Rig</h3>
                    <p className="font-mono text-xs text-slate-400">Workstation Specs</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed mb-3">
                  Multi-core processing setup optimized for instant hot-module reload, TypeScript type checking, and parallel build pipelines.
                </p>
                <div className="font-mono text-[11px] text-amber-300">⚡ 16GB High-Speed RAM • SSD NVMe Storage</div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <Keyboard className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Peripherals</h3>
                    <p className="font-mono text-xs text-slate-400">Tactile & Ergonomic</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed mb-3">
                  Mechanical keyboard with lubed linear switches for fatigue-free marathon coding sessions and precision typing.
                </p>
                <div className="font-mono text-[11px] text-purple-300">⌨️ Custom 75% Mechanical Board • Ultra-light Mouse</div>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Monitor className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Display System</h3>
                    <p className="font-mono text-xs text-slate-400">High-DPI Workspace</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed mb-3">
                  Calibrated color-accurate display with high refresh rate for buttery 60fps animation debugging and responsive design testing.
                </p>
                <div className="font-mono text-[11px] text-cyan-300">🖥️ IPS High-Refresh Monitor + Blue-light filter</div>
              </div>
            </>
          )}

          {activeTab === 'workflow' && (
            <>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Daily Coding Routine</h3>
                    <p className="font-mono text-xs text-slate-400">Deep Focus Blocks</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  Morning algorithm exercises & LeetCode challenges, followed by afternoon deep-work blocks on full-stack web applications and open source contributions.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Coffee className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Fuel & Inspiration</h3>
                    <p className="font-mono text-xs text-slate-400">Himalayan Tea & Lo-Fi</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  Fresh brewed Himalayan organic tea, synthwave soundtracks, and continuous reading of official React docs, RFCs, and web architecture papers.
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-syne text-base font-bold text-white">Git Discipline</h3>
                    <p className="font-mono text-xs text-slate-400">Conventional Commits</p>
                  </div>
                </div>
                <p className="font-sans text-xs text-slate-300 leading-relaxed">
                  Strict adherence to conventional commit standards (<code className="text-indigo-300">feat:</code>, <code className="text-indigo-300">fix:</code>, <code className="text-indigo-300">refactor:</code>), PR reviews, and automated CI tests.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};
