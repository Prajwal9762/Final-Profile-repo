import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Cpu, Code, Wrench, Sparkles, Orbit, Layers, CheckCircle2, X, Terminal, Flame, Database, Layout } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { BRAND_GITHUB_HANDLE } from '../utils/brand';

interface SkillItem {
  id: string;
  name: string;
  category: 'CORE_LANGUAGES' | 'USED_TOOLS' | 'CS_EXPLORATIONS';
  icon: string;
  description: string;
  level: string;
  tags: string[];
  codeSnippet?: string;
}

export const SkillsSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [selectedSkill, setSelectedSkill] = useState<SkillItem | null>(null);
  const [constellationMode, setConstellationMode] = useState(false);

  const skills: SkillItem[] = [
    // CORE LANGUAGES (The ones user knows)
    {
      id: 'c',
      name: 'C Programming',
      category: 'CORE_LANGUAGES',
      icon: '⚙️',
      description: 'Fundamental procedural logic, pointers, memory allocation (malloc/free), arrays, structures, file I/O, and core computational problem solving.',
      level: 'Core Foundation',
      tags: ['Pointers', 'Memory Logic', 'Structures', 'GCC', 'Code::Blocks'],
      codeSnippet: `#include <stdio.h>\n\nint main() {\n    printf("Prajwal Pokharel // C Core Online\\n");\n    return 0;\n}`,
    },
    {
      id: 'cpp',
      name: 'C++ (CPP)',
      category: 'CORE_LANGUAGES',
      icon: '⚡',
      description: 'Object-Oriented Programming (OOP), classes, objects, inheritance, polymorphism, templates, standard template library (STL), and algorithms.',
      level: 'OOP & Algorithms',
      tags: ['OOP', 'Classes & Objects', 'STL', 'Inheritance', 'Polymorphism'],
      codeSnippet: `#include <iostream>\n\nclass FoxSigil {\npublic:\n    void pulse() { std::cout << "Solar Fox Energy Activated!\\n"; }\n};\n\nint main() {\n    FoxSigil sigil;\n    sigil.pulse();\n    return 0;\n}`,
    },
    {
      id: 'javascript',
      name: 'JavaScript (ES6+)',
      category: 'CORE_LANGUAGES',
      icon: '📜',
      description: 'Dynamic scripting, modern ES6+ syntax, DOM manipulation, asynchronous programming with Promises & Async/Await, event listeners, and interactive UI logic.',
      level: 'Modern Web Scripting',
      tags: ['ES6+', 'DOM API', 'Async/Await', 'Event Handling', 'Array Methods'],
      codeSnippet: `const student = {\n  name: "Prajwal Pokharel",\n  degree: "BSc CSIT",\n  learn() { return "Exploring code every day!"; }\n};\nconsole.log(student.learn());`,
    },
    {
      id: 'html',
      name: 'HTML5',
      category: 'CORE_LANGUAGES',
      icon: '🌐',
      description: 'Semantic markup, structural document hierarchy, forms, accessible elements, modern metadata, canvas APIs, and web document standards.',
      level: 'Semantic Structuring',
      tags: ['Semantics', 'Forms', 'Structure', 'Accessibility', 'DOM Tree'],
      codeSnippet: `<!DOCTYPE html>\n<html lang="en">\n<head>\n  <title>Prajwal Pokharel Portfolio</title>\n</head>\n<body>\n  <h1>Welcome to Kathmandu Dev Lab</h1>\n</body>\n</html>`,
    },
    {
      id: 'css',
      name: 'CSS3 / Styling',
      category: 'CORE_LANGUAGES',
      icon: '🎨',
      description: 'Modern CSS layouts with Flexbox and Grid, keyframe animations, responsive media queries, glassmorphism visual styling, and Tailwind CSS utility classes.',
      level: 'Design & Motion',
      tags: ['Flexbox', 'CSS Grid', 'Keyframes', 'Tailwind CSS', 'Responsive UI'],
      codeSnippet: `.solar-fox {\n  background: radial-gradient(circle, #f59e0b, #000);\n  animation: pulse-glow 2s infinite ease-in-out;\n}`,
    },

    // USED TOOLS & PLATFORMS (The ones user has used)
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'USED_TOOLS',
      icon: '🟢',
      description: 'JavaScript runtime environment for backend execution, npm package management, Express routing basics, and asynchronous I/O scripts.',
      level: 'Runtime & Backend Basics',
      tags: ['Runtime', 'npm Packages', 'Server Scripts', 'Modules', 'APIs'],
      codeSnippet: `import http from 'http';\n\nconst server = http.createServer((req, res) => {\n  res.end("Prajwal Pokharel Node Server Online\\n");\n});\nserver.listen(3000);`,
    },
    {
      id: 'firebase',
      name: 'Firebase',
      category: 'USED_TOOLS',
      icon: '🔥',
      description: 'Cloud Firestore real-time database, Firebase Authentication (Google popup & email auth), cloud hosting rules, and live reactive document subscriptions.',
      level: 'Cloud Database & Auth',
      tags: ['Firestore', 'Authentication', 'Realtime Sync', 'NoSQL DB', 'Security Rules'],
      codeSnippet: `import { getFirestore, collection, addDoc } from 'firebase/firestore';\n\n// Real-time visitor message transmission\nawait addDoc(collection(db, "guestbook"), {\n  name: "Visitor",\n  timestamp: new Date()\n});`,
    },
    {
      id: 'linux',
      name: 'Linux Environment',
      category: 'USED_TOOLS',
      icon: '🐧',
      description: 'Bash terminal navigation, file system permissions, package management (apt/pacman), process management, shell commands, and development workflows.',
      level: 'OS & Terminal',
      tags: ['Bash Shell', 'CLI Commands', 'Permissions', 'Package Manager', 'Processes'],
      codeSnippet: `$ uname -a\nLinux kathmandu-lab 6.8.0-generic #2026 SMP x86_64 GNU/Linux\n$ g++ -O3 main.cpp -o app && ./app`,
    },
    {
      id: 'vscode',
      name: 'VS Code',
      category: 'USED_TOOLS',
      icon: '💻',
      description: 'Primary code editor configured with syntax highlighters, emmet shortcuts, TypeScript linters, integrated terminals, and Git extensions for daily coding.',
      level: 'Primary Code Editor',
      tags: ['IntelliSense', 'Extensions', 'Integrated Terminal', 'Multi-Cursor', 'Git Tools'],
      codeSnippet: `// VS Code settings.json\n{\n  "editor.fontFamily": "JetBrains Mono, Fira Code",\n  "editor.formatOnSave": true,\n  "editor.tabSize": 2\n}`,
    },
    {
      id: 'codeblocks',
      name: 'Code::Blocks IDE',
      category: 'USED_TOOLS',
      icon: '🧱',
      description: 'Dedicated C and C++ development environment with integrated GNU GCC compiler toolchain, interactive debugger, breakpoint inspector, and project manager.',
      level: 'C / C++ IDE',
      tags: ['GCC / G++', 'MinGW Toolchain', 'Debugger', 'Breakpoints', 'C/C++ Projects'],
      codeSnippet: `/* Code::Blocks C Project Workspace */\n// Built with GNU GCC Compiler\n// Optimized for BSc CSIT Lab Assignments`,
    },

    // CS EXPLORATIONS (Future areas being studied)
    {
      id: 'git',
      name: 'Git & GitHub',
      category: 'CS_EXPLORATIONS',
      icon: '🐙',
      description: `Version control workflows, commit history tracking, repository hosting on GitHub (${BRAND_GITHUB_HANDLE}), and deployment of static sites on GitHub Pages.`,
      level: 'Version Control',
      tags: [BRAND_GITHUB_HANDLE, 'Commits', 'Branches', 'GitHub Pages', 'Remotes'],
    },
    {
      id: 'algorithms',
      name: 'Data Structures & Algorithms',
      category: 'CS_EXPLORATIONS',
      icon: '📊',
      description: 'Study of linked lists, stacks, queues, binary trees, sorting algorithms (Merge sort, Quick sort), Big-O time complexity, and recursion.',
      level: 'Active CSIT Coursework',
      tags: ['Linked Lists', 'Trees', 'Sorting', 'Big-O', 'Recursion'],
    },
  ];

  const categories = [
    { id: 'ALL', label: 'ALL TECHNOLOGIES' },
    { id: 'CORE_LANGUAGES', label: 'KNOWN LANGUAGES' },
    { id: 'USED_TOOLS', label: 'TOOLS & PLATFORMS' },
    { id: 'CS_EXPLORATIONS', label: 'CS EXPLORATIONS' },
  ];

  const filteredSkills =
    activeCategory === 'ALL'
      ? skills
      : skills.filter((s) => s.category === activeCategory);

  return (
    <section id="skills" className="relative py-24 sm:py-32 bg-slate-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-mono text-amber-300 mb-3 w-fit">
              <Cpu className="h-3.5 w-3.5 text-amber-400" />
              <span>02 // TECH MATRIX & KNOWLEDGE BASE</span>
            </div>

            <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
              SKILLS & TOOLKIT
            </h2>
            <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-xl">
              Accurate breakdown of the exact languages I know and the development tools I use in my BSc CSIT journey.
            </p>
          </div>

          {/* Mode Switch */}
          <button
            onClick={() => {
              soundFx.playClick();
              setConstellationMode(!constellationMode);
            }}
            data-cursor="TOGGLE"
            className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-4 py-2.5 font-mono text-xs font-semibold text-slate-200 hover:border-amber-500/40 hover:text-amber-300 transition-all backdrop-blur-md self-start sm:self-auto"
          >
            {constellationMode ? <Layers className="h-4 w-4 text-amber-400" /> : <Orbit className="h-4 w-4 text-cyan-400" />}
            <span>VIEW: {constellationMode ? 'CARDS MATRIX' : 'CONSTELLATION NODES'}</span>
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2 mb-8 border-b border-slate-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                soundFx.playClick();
                setActiveCategory(cat.id);
              }}
              data-cursor="FILTER"
              className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${
                activeCategory === cat.id
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Constellation View vs Cards Matrix */}
        {constellationMode ? (
          <div className="relative rounded-3xl border border-amber-500/30 bg-slate-950/80 p-8 min-h-[450px] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full max-w-4xl relative z-10">
              {filteredSkills.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedSkill(s);
                  }}
                  className="group relative flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-800 bg-slate-900/60 hover:border-amber-400/60 hover:bg-amber-500/10 transition-all cursor-pointer text-center"
                >
                  <span className="text-3xl mb-2 group-hover:scale-125 transition-transform">{s.icon}</span>
                  <span className="font-syne text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                    {s.name}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 mt-1">{s.level}</span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSkills.map((s) => (
              <motion.div
                key={s.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedSkill(s);
                }}
                className="group relative rounded-3xl border border-slate-800 bg-slate-950/70 p-6 hover:border-amber-500/40 transition-all hover:shadow-[0_10px_30px_rgba(245,158,11,0.15)] flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
                      <div>
                        <h3 className="font-syne text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                          {s.name}
                        </h3>
                        <span className="font-mono text-[11px] text-amber-400/80">{s.level}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border border-slate-800 bg-slate-900 text-slate-400">
                      {s.category.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    {s.description}
                  </p>
                </div>

                <div>
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-slate-800/80">
                    {s.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="rounded-lg bg-slate-900 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-300"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Skill Detail Modal */}
        <AnimatePresence>
          {selectedSkill && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
              onClick={() => setSelectedSkill(null)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-xl rounded-3xl border border-amber-500/40 bg-slate-950 p-6 sm:p-8 shadow-[0_20px_60px_rgba(245,158,11,0.25)] relative"
              >
                <button
                  onClick={() => setSelectedSkill(null)}
                  className="absolute top-5 right-5 h-8 w-8 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{selectedSkill.icon}</span>
                  <div>
                    <h3 className="font-syne text-2xl font-extrabold text-white">{selectedSkill.name}</h3>
                    <p className="font-mono text-xs text-amber-400">{selectedSkill.level}</p>
                  </div>
                </div>

                <p className="text-slate-300 text-sm leading-relaxed mb-4">
                  {selectedSkill.description}
                </p>

                {selectedSkill.codeSnippet && (
                  <div className="mb-4">
                    <span className="font-mono text-[11px] text-slate-400 mb-1.5 block">CODE SNIPPET PREVIEW:</span>
                    <pre className="p-3 rounded-xl border border-slate-800 bg-slate-900 text-amber-300 font-mono text-xs overflow-x-auto">
                      {selectedSkill.codeSnippet}
                    </pre>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-800">
                  {selectedSkill.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-mono text-amber-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};
