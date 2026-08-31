import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Compass, Sparkles, CheckCircle, AlertTriangle, ArrowUpRight, Zap, Target } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface Milestone {
  stage: string;
  title: string;
  period: string;
  description: string;
  takeaway: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'ONGOING';
  badgeColor: string;
}

export const JourneySection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalHeight = rect.height;

      const progress = Math.max(
        0,
        Math.min(1, (windowHeight - rect.top) / (totalHeight + windowHeight / 2))
      );
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const milestones: Milestone[] = [
    {
      stage: 'START',
      title: 'First Sparks of Curiosity',
      period: 'Foundation Phase',
      description: 'Opening terminal for the first time, writing HTML tags, understanding how computers render visual interfaces from code.',
      takeaway: 'Realizing that everything on the web is constructed line-by-line.',
      status: 'COMPLETED',
      badgeColor: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
    },
    {
      stage: 'LEARN',
      title: 'Deep-Diving Languages',
      period: 'Exploration Phase',
      description: 'Studying JavaScript fundamentals, async programming, Python scripting, and C/C++ memory mechanics.',
      takeaway: 'Building strong computational foundations before jumping into heavy abstractions.',
      status: 'COMPLETED',
      badgeColor: 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300',
    },
    {
      stage: 'BUILD',
      title: 'Crafting Interactive Web Apps',
      period: 'Implementation Phase',
      description: 'Putting concepts into practice with Vite, React, Tailwind CSS, Three.js 3D animations, and custom canvas interactions.',
      takeaway: 'Action beats passive watching. Building reveals what you actually understand.',
      status: 'COMPLETED',
      badgeColor: 'border-sky-500/40 bg-sky-500/10 text-sky-300',
    },
    {
      stage: 'FAIL',
      title: 'Debugging & Refactoring',
      period: 'Crucial Lessons',
      description: 'Encountering broken builds, CSS layout overflows, memory leaks in animation loops, and learning how to read error logs with patience.',
      takeaway: 'Errors are not roadblocks — they are precise instructions on what needs fixing.',
      status: 'COMPLETED',
      badgeColor: 'border-rose-500/40 bg-rose-500/10 text-rose-300',
    },
    {
      stage: 'IMPROVE',
      title: 'System Optimization & AI Tools',
      period: 'Refinement Phase',
      description: 'Optimizing rendering loops to 60 FPS, learning Git branch workflows, exploring Gemini AI APIs, and hosting static assets.',
      takeaway: 'Constantly elevating standards for UI polish, performance, and accessibility.',
      status: 'IN_PROGRESS',
      badgeColor: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
    },
    {
      stage: 'GROW',
      title: 'Creating Meaningful Value',
      period: 'Future Outlook',
      description: 'Continuing to build open-source tools, expanding software engineering capabilities, and shipping impactful web applications.',
      takeaway: 'The learning loop never ends.',
      status: 'ONGOING',
      badgeColor: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-300',
    },
  ];

  return (
    <section id="journey" className="relative py-24 sm:py-32 bg-slate-950/60">
      <div ref={containerRef} className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-mono text-cyan-300 mb-3">
            <Compass className="h-3.5 w-3.5 text-cyan-400" />
            <span>04 // CINEMATIC TIMELINE</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            MY LEARNING JOURNEY
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base max-w-xl">
            A non-linear path of continuous discovery, trial, error, and growth.
          </p>
        </div>

        {/* Timeline Line Container */}
        <div className="relative">
          {/* Static Background Beam Track */}
          <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-slate-800/80 rounded-full" />

          {/* Dynamic Scroll-Grown Laser Line */}
          <div
            className="absolute left-6 sm:left-1/2 top-0 w-1 -translate-x-1/2 bg-gradient-to-b from-cyan-400 via-sky-400 to-indigo-500 rounded-full shadow-[0_0_20px_#38bdf8]"
            style={{ height: `${scrollProgress * 100}%` }}
          />

          {/* Timeline Nodes */}
          <div className="space-y-12">
            {milestones.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.stage}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center gap-6 ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Center Node Pin */}
                  <div className="absolute left-6 sm:left-1/2 top-0 sm:top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-400 bg-slate-950 text-cyan-300 shadow-[0_0_20px_#38bdf8]">
                    <span className="font-mono text-xs font-extrabold">{index + 1}</span>
                  </div>

                  {/* Milestone Card Content */}
                  <div className={`w-full sm:w-1/2 pl-14 sm:pl-0 ${isEven ? 'sm:pr-12 sm:text-right' : 'sm:pl-12'}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: '-50px' }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                      onMouseEnter={() => soundFx.playHover()}
                      data-cursor="MILESTONE"
                      className="interactive-card rounded-3xl border border-slate-800 bg-slate-900/80 p-6 glass-panel-hover transition-all duration-300 relative overflow-hidden"
                    >
                      {/* Top Header */}
                      <div className={`flex flex-wrap items-center gap-2 mb-3 ${isEven ? 'sm:justify-end' : ''}`}>
                        <span className="font-syne text-xl font-extrabold text-white tracking-wider">
                          {item.stage}
                        </span>
                        <span className={`rounded-full border px-2.5 py-0.5 font-mono text-[10px] font-bold ${item.badgeColor}`}>
                          {item.period}
                        </span>
                      </div>

                      <h4 className="font-syne text-base font-bold text-cyan-300 mb-2">
                        {item.title}
                      </h4>

                      <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4 font-sans">
                        {item.description}
                      </p>

                      <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-3 text-left">
                        <span className="font-mono text-[10px] text-cyan-400 uppercase tracking-widest block font-bold mb-1">
                          Key Takeaway:
                        </span>
                        <p className="font-mono text-xs text-slate-300 italic">
                          "{item.takeaway}"
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
