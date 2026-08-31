import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Layers, Plus, Github, ExternalLink, Sparkles, Code2, Play, Eye, Terminal, Cpu, Globe, Heart, Flame, Wrench, Database } from 'lucide-react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { soundFx } from '../utils/audio';
import { BRAND_GITHUB, BRAND_WEBSITE } from '../utils/brand';

interface LabProject {
  id: string;
  title: string;
  category: string;
  status: 'IN PROGRESS' | 'ACTIVE LAB' | 'PLANNED CONCEPT';
  description: string;
  tech: string[];
  icon: React.ElementType;
  demoType: 'algo' | 'js_sandbox' | 'firebase' | 'terminal';
}

export const ProjectsSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [activeLabTab, setActiveLabTab] = useState<string>('all');
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [clappingId, setClappingId] = useState<string | null>(null);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);

  // Interactive C/C++ Algo Simulator state
  const [algoArray, setAlgoArray] = useState<number[]>([42, 17, 89, 33, 65, 24, 91, 58]);
  const [isSorting, setIsSorting] = useState(false);
  const [sortingStep, setSortingStep] = useState<string>('Array ready for sorting');

  // Firestore Real-time Reactions for cheering student journey
  useEffect(() => {
    try {
      const docRef = doc(db, 'portfolio_meta', 'project_claps');
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setReactions(snapshot.data() as Record<string, number>);
          }
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, 'portfolio_meta/project_claps');
        }
      );
      return () => unsubscribe();
    } catch {
      // Fallback
    }
  }, []);

  const handleClap = async (projectId: string) => {
    soundFx.playClick();
    setClappingId(projectId);
    setTimeout(() => setClappingId(null), 600);

    const newCount = (reactions[projectId] || 0) + 1;
    setReactions((prev) => ({ ...prev, [projectId]: newCount }));

    try {
      const docRef = doc(db, 'portfolio_meta', 'project_claps');
      await setDoc(docRef, { [projectId]: newCount }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'portfolio_meta/project_claps');
    }
  };

  const runBubbleSortStep = async () => {
    if (isSorting) return;
    setIsSorting(true);
    soundFx.playSuccess();

    const arr = [...algoArray];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        setSortingStep(`Comparing index ${j} (${arr[j]}) with ${j + 1} (${arr[j + 1]})`);
        if (arr[j] > arr[j + 1]) {
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          setAlgoArray([...arr]);
          await new Promise((r) => setTimeout(r, 250));
        }
      }
    }
    setSortingStep('Algorithm Completed! Array is sorted.');
    setIsSorting(false);
  };

  const resetArray = () => {
    soundFx.playClick();
    const fresh = Array.from({ length: 8 }, () => Math.floor(Math.random() * 85) + 12);
    setAlgoArray(fresh);
    setSortingStep('Array randomized! Click Run Bubble Sort.');
  };

  const labProjects: LabProject[] = [
    {
      id: 'cpp_algo_visualizer',
      title: 'C / C++ Algorithm & Pointer Visualizer',
      category: 'Data Structures Lab',
      status: 'ACTIVE LAB',
      description: 'Hands-on simulator demonstrating fundamental sorting algorithms (Bubble Sort, Selection Sort), pointer manipulation, and memory layout logic taught in BSc CSIT.',
      tech: ['C', 'C++', 'Algorithms', 'Logic & Memory'],
      icon: Cpu,
      demoType: 'algo',
    },
    {
      id: 'js_canvas_engine',
      title: 'Solar Fox Interactive Canvas & DOM Engine',
      category: 'Web Graphics Experiment',
      status: 'ACTIVE LAB',
      description: 'Rich dynamic canvas rendering real-time geometric mesh wireframes, parallax cursor tracking, and celestial particles built with clean vanilla JavaScript & HTML5 canvas math.',
      tech: ['JavaScript (ES6+)', 'HTML5 Canvas', 'Math & Physics', 'CSS Animations'],
      icon: Flame,
      demoType: 'js_sandbox',
    },
    {
      id: 'firebase_guestbook',
      title: 'Firebase Real-Time Community & Live Auth Wall',
      category: 'Cloud Database Experiment',
      status: 'IN PROGRESS',
      description: 'Full-stack cloud prototype integrating Google Authentication popups and Firestore real-time collections for instant visitor messaging and reaction broadcast.',
      tech: ['Firebase Firestore', 'Firebase Auth', 'Node.js', 'JavaScript'],
      icon: Database,
      demoType: 'firebase',
    },
    {
      id: 'linux_cli_suite',
      title: 'Linux Bash Automation & Shell Scripts',
      category: 'Systems & OS',
      status: 'PLANNED CONCEPT',
      description: 'Collection of custom shell scripts for automating code compilation (gcc/g++), checking Git status, formatting C source files, and running test benches.',
      tech: ['Linux', 'Bash', 'GCC Compiler', 'Git'],
      icon: Terminal,
      demoType: 'terminal',
    },
  ];

  return (
    <section id="projects" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300 mb-3 w-fit">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              <span>03 // LAB EXPERIMENTS & PROTOTYPES</span>
            </div>

            <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              ACTIVE LAB WORK
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
              As an active <strong>BSc CSIT student</strong>, here are the real algorithmic prototypes, interactive web experiments, and cloud databases I am building and experimenting with.
            </p>
          </div>

          <a
            href={BRAND_GITHUB}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="GITHUB"
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 hover:border-amber-500/40 hover:text-amber-300 transition-all backdrop-blur-md self-start sm:self-auto"
          >
            <Github className="h-4 w-4 text-amber-400" />
            <span>FOLLOW ON GITHUB (@prajwal9762)</span>
          </a>
        </div>

        {/* Interactive C/C++ Algo Lab Feature Banner */}
        <div className="mb-12 rounded-3xl border border-amber-500/40 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 bg-radial from-amber-500/20 to-transparent blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
                <Cpu className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <h3 className="font-syne text-lg font-bold text-white flex items-center gap-2">
                  <span>LIVE LAB DEMO: C/C++ BUBBLE SORT VISUALIZER</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    INTERACTIVE
                  </span>
                </h3>
                <p className="font-mono text-xs text-slate-400">Memory Array Sorting & Pointer Swapping Simulation</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetArray}
                disabled={isSorting}
                className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900 font-mono text-xs text-slate-300 hover:text-white disabled:opacity-50"
              >
                Randomize
              </button>
              <button
                onClick={runBubbleSortStep}
                disabled={isSorting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-mono text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.4)] hover:bg-amber-400 transition-all disabled:opacity-50"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{isSorting ? 'SORTING...' : 'RUN SORT'}</span>
              </button>
            </div>
          </div>

          {/* Visual Bars */}
          <div className="h-44 sm:h-52 flex items-end justify-center gap-2 sm:gap-4 p-4 rounded-2xl border border-slate-800/80 bg-slate-900/40 mb-4">
            {algoArray.map((val, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2 flex-1 max-w-[50px]">
                <span className="font-mono text-[10px] text-amber-300 font-bold">{val}</span>
                <motion.div
                  layout
                  className="w-full rounded-t-lg bg-gradient-to-t from-amber-600 via-amber-400 to-yellow-200 border-t border-amber-200/80 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
                  style={{ height: `${(val / 100) * 120 + 20}px` }}
                />
                <span className="font-mono text-[9px] text-slate-500">[{idx}]</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-slate-400">
            <span className="text-amber-400 font-semibold">{sortingStep}</span>
            <span className="text-slate-500">Time Complexity: O(n²) • In-place</span>
          </div>
        </div>

        {/* Lab Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {labProjects.map((p) => {
            const Icon = p.icon;
            const clapCount = reactions[p.id] || 0;
            const isClapping = clappingId === p.id;

            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 sm:p-7 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-syne text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {p.title}
                        </h3>
                        <span className="font-mono text-[11px] text-slate-400">{p.category}</span>
                      </div>
                    </div>

                    <span className="font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300">
                      {p.status}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                    {p.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {p.tech.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] font-mono text-slate-300"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <button
                      onClick={() => handleClap(p.id)}
                      data-cursor="CHEER"
                      className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 font-mono text-xs transition-all ${
                        isClapping
                          ? 'scale-110 bg-amber-500 text-slate-950 font-bold'
                          : 'border border-slate-800 bg-slate-900/60 text-slate-300 hover:border-amber-500/40 hover:text-amber-300'
                      }`}
                    >
                      <Heart className={`h-3.5 w-3.5 ${clapCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>Cheer ({clapCount})</span>
                    </button>

                    <a
                      href={BRAND_GITHUB}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 font-mono text-xs text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      <span>View Source</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
