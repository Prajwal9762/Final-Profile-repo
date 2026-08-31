import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Code, Terminal, Cpu, Flame, Sparkles, Compass, GraduationCap, MapPin, Mail, Globe } from 'lucide-react';
import { CyberCreature } from './CyberCreature';
import { soundFx } from '../utils/audio';
import { BRAND_LOGO_SRC, BRAND_EMAIL, BRAND_WEBSITE, BRAND_LOCATION, BRAND_NAME, BRAND_GITHUB_HANDLE } from '../utils/brand';

export const AboutSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [activeTab, setActiveTab] = useState<'story' | 'academic' | 'philosophy' | 'goals'>('story');

  const stats = [
    { label: 'Degree & Track', value: 'BSc CSIT Student' },
    { label: 'Base Camp', value: 'Kathmandu, Nepal 🇳🇵' },
    { label: 'Foundation Stack', value: 'C / C++ • JS • HTML/CSS' },
    { label: 'Exploration Tools', value: 'Node • Firebase • Linux' },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300 mb-3">
            <User className="h-3.5 w-3.5 text-amber-400" />
            <span>01 // ABOUT THE DEVELOPER</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            WHO AM I?
          </h2>
          <p className="mt-2 text-xl font-syne text-amber-400 font-bold flex items-center gap-2">
            <span>{BRAND_NAME}</span>
            <span className="text-sm font-mono text-slate-400 font-normal">({BRAND_GITHUB_HANDLE})</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Side: Interactive Main Card */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="glass-panel rounded-3xl border border-amber-500/30 bg-slate-950/80 p-6 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative overflow-hidden">
              <div className="absolute top-0 right-0 h-40 w-40 bg-radial from-amber-500/20 to-transparent blur-3xl pointer-events-none" />

              {/* Tab Navigation */}
              <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-6">
                {[
                  { id: 'story', label: 'My Story', icon: Compass },
                  { id: 'academic', label: 'BSc CSIT Focus', icon: GraduationCap },
                  { id: 'philosophy', label: 'Mindset & Craft', icon: Flame },
                  { id: 'goals', label: 'Learning Goals', icon: Sparkles },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        soundFx.playClick();
                        setActiveTab(tab.id as typeof activeTab);
                      }}
                      data-cursor="SELECT"
                      className={`flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Tab Content Panels */}
              <div className="min-h-[220px]">
                {activeTab === 'story' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-slate-300 leading-relaxed font-sans text-sm sm:text-base"
                  >
                    <p>
                      Hello! I am <strong className="text-white">Prajwal Pokharel</strong>, a passionate <strong className="text-amber-300">BSc CSIT student and tech learner</strong> living in Kathmandu, Nepal.
                    </p>
                    <p>
                      I have hands-on command over <strong className="text-white">HTML, CSS, JavaScript, C, and C++</strong>, while actively expanding my development toolkit using <strong className="text-cyan-300">Node.js, Firebase real-time systems, Linux environments, VS Code, and Code::Blocks</strong>.
                    </p>
                    <p>
                      I focus on foundational computer science principles, clean syntax structure, and immersive web experiences. I love combining logic with vibrant visual design and smooth animations to bring software alive.
                    </p>
                  </motion.div>
                )}

                {activeTab === 'academic' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-slate-300 leading-relaxed font-sans text-sm sm:text-base"
                  >
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
                          BSc in Computer Science & Information Technology (CSIT)
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">Kathmandu, Nepal</span>
                      </div>
                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                        Rigorous academic journey covering structured programming in C/C++, object-oriented architectures, computer algorithms, relational databases, data structures, and operating system concepts.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                        <span className="text-amber-400 font-bold block mb-1">PROGRAMMING</span>
                        <span className="text-slate-300">C • C++ • JavaScript</span>
                      </div>
                      <div className="p-3 rounded-xl border border-slate-800 bg-slate-900/40">
                        <span className="text-cyan-400 font-bold block mb-1">WEB & CLOUD</span>
                        <span className="text-slate-300">HTML5 • CSS3 • Firebase • Node.js</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'philosophy' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-4 text-slate-300 leading-relaxed font-sans text-sm sm:text-base"
                  >
                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <h4 className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                        1. TRANSPARENT & GROUNDED LEARNING
                      </h4>
                      <p className="text-slate-300 text-xs sm:text-sm">
                        I believe in transparent authenticity: rather than pretending to have decades of corporate experience, I celebrate being an active student, learning deeply every day through problem-solving and clean code.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
                      <h4 className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold mb-2">
                        2. CRAFTSMANSHIP & ANIMATION ENERGY
                      </h4>
                      <p className="text-slate-300 text-xs sm:text-sm">
                        Code should not only execute without errors — it should provide an inspiring experience with reactive motion, responsive visual geometry, and tactile feedback.
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'goals' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2.5 font-mono text-xs sm:text-sm"
                  >
                    {[
                      'Master data structures and algorithm optimization in C & C++',
                      'Build high-performance full-stack web applications using Node.js & Firebase',
                      'Develop creative interactive UI canvases and shader animations',
                      'Expand Linux command-line mastery and Git collaboration workflows',
                      'Publish useful developer tools on prajwal-pokharel.com.np',
                    ].map((goal, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/50 p-3 text-slate-200"
                      >
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                          {index + 1}
                        </span>
                        <span>{goal}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Quick Stats Grid */}
              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800/80">
                {stats.map((st, idx) => (
                  <div key={idx} className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 text-center">
                    <span className="block font-mono text-[10px] text-slate-400 uppercase">{st.label}</span>
                    <span className="block font-syne text-xs sm:text-sm font-bold text-amber-300 mt-1">{st.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side: Cyber Sentinel Creature Visual */}
          <div className="lg:col-span-5">
            <CyberCreature isMobile={isMobile} />
          </div>
        </div>
      </div>
    </section>
  );
};
