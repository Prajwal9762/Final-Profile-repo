import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Copy, Download, Github, Terminal, BookOpen, ExternalLink } from 'lucide-react';
import { soundFx } from '../utils/audio';

export const GitHubPagesExportGuide: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [guideMode, setGuideMode] = useState<'switch_git' | 'gh_pages'>('switch_git');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, stepIndex: number) => {
    soundFx.playClick();
    navigator.clipboard.writeText(text);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const switchGitSteps = [
    {
      title: '1. Check Current Git Remote',
      cmd: 'git remote -v',
      desc: 'See which GitHub repository your project is currently linked to.',
    },
    {
      title: '2. Change Remote URL to Your New GitHub Repo',
      cmd: '# Option A: Update existing origin URL:\ngit remote set-url origin https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git\n\n# Option B: Or remove old and add new:\ngit remote remove origin\ngit remote add origin https://github.com/YOUR_NEW_USERNAME/YOUR_NEW_REPO.git',
      desc: 'Replace with the clone URL of your new GitHub repository.',
    },
    {
      title: '3. Verify and Push to the New GitHub Repo',
      cmd: 'git branch -M main\ngit add .\ngit commit -m "Initial commit to new repository"\ngit push -u origin main',
      desc: 'The -u flag sets the upstream tracking so future pushes only require "git push".',
    },
    {
      title: '4. If You Need to Switch GitHub Accounts on Your Machine',
      cmd: '# Update git commit author identity:\ngit config user.name "Your New Name"\ngit config user.email "your-new-email@example.com"\n\n# Or use GitHub CLI to switch login:\ngh auth login',
      desc: 'Ensures your commits and push permissions are authenticated with the new GitHub account.',
    },
  ];

  const steps = [
    {
      title: '1. Download / Clone Source Code',
      cmd: 'git clone https://github.com/prajwal9762/prajwal-pokharel-portfolio.git\ncd prajwal-pokharel-portfolio',
      desc: 'Ensure all portfolio files are placed in your local git repository folder.',
    },
    {
      title: '2. Install Dependencies & Build',
      cmd: 'npm install\nnpm run build',
      desc: 'This generates the fully static production HTML, JS, and CSS bundle in the dist/ folder.',
    },
    {
      title: '3. Push Code to GitHub Repository',
      cmd: 'git add .\ngit commit -m "Deploy Ultra-Animated Portfolio"\ngit push origin main',
      desc: 'Push your source code to your GitHub repository (@prajwal9762).',
    },
    {
      title: '4. Enable GitHub Pages Deployment',
      cmd: '# Option A: GitHub Actions (Recommended for Vite)\n# Create file .github/workflows/deploy.yml with static deploy action\n# Or Option B: Set GitHub Pages Source in Repository Settings -> Pages -> Deploy from root / gh-pages branch',
      desc: 'In GitHub Repository Settings -> Pages, select Source as GitHub Actions or gh-pages branch. Your custom domain (prajwal-pokharel.com.np) will automatically render the full site!',
    },
  ];

  const activeList = guideMode === 'switch_git' ? switchGitSteps : steps;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-xl overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-3xl border border-cyan-500/40 bg-slate-950 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] relative text-left my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-syne text-2xl font-extrabold text-white">
                  Git & Deployment Operations
                </h3>
                <p className="font-mono text-xs text-cyan-400">
                  Target domain: https://prajwal-pokharel.com.np
                </p>
              </div>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl border border-slate-800 bg-slate-900/90 font-mono text-xs mb-6">
            <button
              onClick={() => {
                soundFx.playClick();
                setGuideMode('switch_git');
              }}
              className={`py-2 px-3 rounded-xl transition-all font-bold text-center ${
                guideMode === 'switch_git'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🔄 SWITCH / CONNECT GIT REMOTE
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setGuideMode('gh_pages');
              }}
              className={`py-2 px-3 rounded-xl transition-all font-bold text-center ${
                guideMode === 'gh_pages'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 GITHUB PAGES DEPLOYMENT
            </button>
          </div>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-sans">
            {guideMode === 'switch_git'
              ? 'Follow these direct CLI commands to re-link your local repository to a new or different GitHub repository/account.'
              : 'This portfolio is engineered purely with static client-side web technologies (Vite, React, Three.js, Tailwind CSS) requiring zero backend server — 100% compatible with GitHub Pages hosting.'}
          </p>

          {/* Steps List */}
          <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
            {activeList.map((step, idx) => (
              <div key={idx} className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4 font-mono text-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-cyan-300">{step.title}</span>
                  <button
                    onClick={() => copyToClipboard(step.cmd, idx)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-300"
                  >
                    {copiedStep === idx ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedStep === idx ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>

                <pre className="rounded-xl bg-slate-950 p-3 text-emerald-400 overflow-x-auto text-[11px] leading-relaxed border border-slate-800/80">
                  {step.cmd}
                </pre>

                <p className="mt-2 text-slate-400 text-[11px] font-sans">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CNAME configuration reminder */}
          <div className="mt-6 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs font-mono text-amber-300">
            <strong>Custom Domain Note:</strong> Put a file named <code className="text-white">CNAME</code> containing <code className="text-white">prajwal-pokharel.com.np</code> in your public/ folder so GitHub Pages automatically points your custom domain!
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="rounded-xl bg-cyan-500 px-6 py-2.5 font-mono text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-colors"
            >
              GOT IT, THANKS!
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
