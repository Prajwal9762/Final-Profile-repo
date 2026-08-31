import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Code2, Play, RotateCcw, Sparkles, Terminal, Activity, Cpu, Zap, Layers, Compass, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

type LabTab = 'pathfinder' | 'physics' | 'search_race' | 'evaluator';

export const CodeLabSection: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [activeTab, setActiveTab] = useState<LabTab>('pathfinder');

  return (
    <section id="codelab" className="relative py-24 sm:py-32 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="flex flex-col items-start mb-12">
          <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-mono text-purple-300 mb-3">
            <Cpu className="h-3.5 w-3.5 text-purple-400" />
            <span>04 // INTERACTIVE CODE LAB & ALGORITHM VISUALIZER</span>
          </div>

          <h2 className="font-syne text-4xl sm:text-6xl font-extrabold text-white tracking-tight">
            ALGORITHM PLAYGROUND
          </h2>
          <p className="mt-2 text-slate-400 text-sm sm:text-base max-w-2xl">
            Live interactive simulations, pathfinding algorithms, and physics experiments written from scratch in TypeScript. Test, benchmark, and run them in real time.
          </p>

          {/* Lab Tabs */}
          <div className="mt-8 flex flex-wrap gap-2 p-1.5 rounded-2xl border border-slate-800 bg-slate-900/90 backdrop-blur-xl">
            {[
              { id: 'pathfinder', label: '🗺️ A* PATHFINDER', desc: 'Grid obstacle solver' },
              { id: 'physics', label: '🧬 ORBIT PHYSICS', desc: 'Particle gravity engine' },
              { id: 'search_race', label: '⚡ ALGO BENCHMARK', desc: 'Binary vs Linear Search' },
              { id: 'evaluator', label: '💻 LIVE REPL', desc: 'Real-time code executor' },
            ].map((tab) => {
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    soundFx.playClick();
                    setActiveTab(tab.id as LabTab);
                  }}
                  onMouseEnter={() => soundFx.playHover()}
                  data-cursor="RUN"
                  className={`flex flex-col text-left px-4 py-2 rounded-xl font-mono transition-all text-xs ${
                    isSelected
                      ? 'bg-purple-500/20 border border-purple-400 text-white shadow-[0_0_20px_rgba(168,85,247,0.3)] font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className="text-[10px] text-slate-500">{tab.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content Canvas */}
        <div className="rounded-3xl border border-slate-800 bg-slate-950/80 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'pathfinder' && <PathfinderVisualizer key="pathfinder" isMobile={isMobile} />}
            {activeTab === 'physics' && <PhysicsSandbox key="physics" isMobile={isMobile} />}
            {activeTab === 'search_race' && <SearchRaceVisualizer key="search_race" />}
            {activeTab === 'evaluator' && <LiveCodeRepl key="evaluator" />}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

/* ---------------------------------------------------- */
/* 1. A* Pathfinder Visualizer                          */
/* ---------------------------------------------------- */
const GRID_ROWS = 14;
const GRID_COLS = 24;

interface GridNode {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
}

const PathfinderVisualizer: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const cols = isMobile ? 12 : GRID_COLS;
  const rows = isMobile ? 10 : GRID_ROWS;

  const [grid, setGrid] = useState<GridNode[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<{ visitedCount: number; pathLength: number; durationMs: number } | null>(null);

  const startPos = { row: 2, col: 2 };
  const endPos = { row: rows - 3, col: cols - 3 };

  const createInitialGrid = () => {
    const newGrid: GridNode[][] = [];
    for (let r = 0; r < rows; r++) {
      const rowArr: GridNode[] = [];
      for (let c = 0; c < cols; c++) {
        const isStart = r === startPos.row && c === startPos.col;
        const isEnd = r === endPos.row && c === endPos.col;
        // Seed default interesting maze walls
        const isWall =
          !isStart &&
          !isEnd &&
          ((c === Math.floor(cols / 3) && r > 2 && r < rows - 2) ||
            (c === Math.floor((cols * 2) / 3) && (r < 4 || r > rows - 5)));

        rowArr.push({
          row: r,
          col: c,
          isStart,
          isEnd,
          isWall,
          isVisited: false,
          isPath: false,
          g: Infinity,
          h: 0,
          f: Infinity,
          parent: null,
        });
      }
      newGrid.push(rowArr);
    }
    return newGrid;
  };

  useEffect(() => {
    setGrid(createInitialGrid());
  }, [isMobile]);

  const toggleWall = (r: number, c: number) => {
    if (isRunning) return;
    soundFx.playBeep();
    setGrid((prev) => {
      const next = prev.map((row) => row.map((cell) => ({ ...cell })));
      if (!next[r][c].isStart && !next[r][c].isEnd) {
        next[r][c].isWall = !next[r][c].isWall;
        next[r][c].isVisited = false;
        next[r][c].isPath = false;
      }
      return next;
    });
  };

  const runAStar = async () => {
    if (isRunning || grid.length === 0) return;
    setIsRunning(true);
    setStats(null);
    soundFx.playCodeRun();

    const startTime = performance.now();
    const workingGrid: GridNode[][] = grid.map((r) =>
      r.map((c) => ({
        ...c,
        isVisited: false,
        isPath: false,
        g: Infinity,
        f: Infinity,
        parent: null,
      }))
    );

    const startNode = workingGrid[startPos.row][startPos.col];
    const endNode = workingGrid[endPos.row][endPos.col];

    startNode.g = 0;
    startNode.h = Math.abs(startNode.row - endNode.row) + Math.abs(startNode.col - endNode.col);
    startNode.f = startNode.h;

    const openSet: GridNode[] = [startNode];
    let visitedCount = 0;

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;

      if (current.row === endNode.row && current.col === endNode.col) {
        // Reconstruct path
        let curr: GridNode | null = current;
        let pathLength = 0;
        const pathNodes: GridNode[] = [];
        while (curr) {
          pathNodes.push(curr);
          curr = curr.parent;
          pathLength++;
        }

        // Animate path highlight
        for (const node of pathNodes.reverse()) {
          workingGrid[node.row][node.col].isPath = true;
          setGrid([...workingGrid]);
          await new Promise((res) => setTimeout(res, 25));
        }

        const endTime = performance.now();
        setStats({
          visitedCount,
          pathLength,
          durationMs: Number((endTime - startTime).toFixed(1)),
        });
        soundFx.playSuccess();
        setIsRunning(false);
        return;
      }

      current.isVisited = true;
      visitedCount++;

      // 4-directional neighbors
      const neighbors = [
        { r: current.row - 1, c: current.col },
        { r: current.row + 1, c: current.col },
        { r: current.row, c: current.col - 1 },
        { r: current.row, c: current.col + 1 },
      ];

      for (const n of neighbors) {
        if (n.r >= 0 && n.r < rows && n.c >= 0 && n.c < cols) {
          const neighbor = workingGrid[n.r][n.c];
          if (!neighbor.isWall && !neighbor.isVisited) {
            const tentativeG = current.g + 1;
            if (tentativeG < neighbor.g) {
              neighbor.parent = current;
              neighbor.g = tentativeG;
              neighbor.h = Math.abs(neighbor.row - endNode.row) + Math.abs(neighbor.col - endNode.col);
              neighbor.f = neighbor.g + neighbor.h;

              if (!openSet.includes(neighbor)) {
                openSet.push(neighbor);
              }
            }
          }
        }
      }

      if (visitedCount % 2 === 0) {
        setGrid([...workingGrid]);
        await new Promise((res) => setTimeout(res, 15));
      }
    }

    setIsRunning(false);
    setStats({ visitedCount, pathLength: 0, durationMs: Number((performance.now() - startTime).toFixed(1)) });
  };

  const resetMaze = () => {
    soundFx.playClick();
    setGrid(createInitialGrid());
    setStats(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
            <span>A* Heuristic Pathfinder</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
              O(E + V log V)
            </span>
          </h3>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Click on any grid square to add or remove obstacle walls, then click "Solve Path".
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetMaze}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-900 text-xs font-mono text-slate-300 hover:text-white transition-all disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Grid</span>
          </button>

          <button
            onClick={runAStar}
            disabled={isRunning}
            data-cursor="EXECUTE"
            className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>{isRunning ? 'Solving...' : 'Solve Path'}</span>
          </button>
        </div>
      </div>

      {/* Grid Canvas */}
      <div className="overflow-x-auto pb-2 flex justify-center">
        <div
          className="grid gap-1 p-3 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner select-none"
          style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              let bg = 'bg-slate-950/60 border-slate-800/60';
              let text = '';

              if (cell.isStart) {
                bg = 'bg-emerald-500 text-slate-950 font-bold shadow-[0_0_12px_#10b981]';
                text = 'S';
              } else if (cell.isEnd) {
                bg = 'bg-rose-500 text-white font-bold shadow-[0_0_12px_#f43f5e]';
                text = 'E';
              } else if (cell.isPath) {
                bg = 'bg-amber-400 border-amber-300 shadow-[0_0_15px_#f59e0b] scale-95';
              } else if (cell.isVisited) {
                bg = 'bg-purple-900/60 border-purple-500/40';
              } else if (cell.isWall) {
                bg = 'bg-slate-700 border-slate-600';
              }

              return (
                <div
                  key={`${rIdx}-${cIdx}`}
                  onClick={() => toggleWall(rIdx, cIdx)}
                  className={`w-6 h-6 sm:w-8 sm:h-8 rounded-md border flex items-center justify-center font-mono text-[10px] cursor-pointer transition-all duration-150 ${bg}`}
                >
                  {text}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Real-time stats footer */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-around gap-4 p-4 rounded-2xl border border-purple-500/30 bg-purple-950/30 font-mono text-xs text-slate-200"
        >
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-purple-400" />
            <span>Nodes Visited: <strong className="text-purple-300">{stats.visitedCount}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Optimal Path Steps: <strong className="text-emerald-300">{stats.pathLength}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>Execution Duration: <strong className="text-amber-300">{stats.durationMs}ms</strong></span>
          </div>
        </motion.div>
      )}
    </div>
  );
};

/* ---------------------------------------------------- */
/* 2. Interactive Physics & Gravity Sandbox            */
/* ---------------------------------------------------- */
const PhysicsSandbox: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleCount, setParticleCount] = useState(isMobile ? 35 : 70);
  const [gravityStrength, setGravityStrength] = useState(0.8);
  const [isRepelling, setIsRepelling] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    const height = (canvas.height = 360);

    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      trail: Array<{ x: number; y: number }>;
    }> = [];

    const colors = ['#a855f7', '#ec4899', '#38bdf8', '#10b981', '#fbbf24'];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        trail: [],
      });
    }

    let mouseX = width / 2;
    let mouseY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.fillStyle = 'rgba(7, 3, 17, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw Center Attractor
      ctx.beginPath();
      ctx.arc(mouseX, mouseY, 12, 0, Math.PI * 2);
      ctx.fillStyle = isRepelling ? 'rgba(244, 63, 94, 0.4)' : 'rgba(168, 85, 247, 0.4)';
      ctx.shadowColor = isRepelling ? '#f43f5e' : '#a855f7';
      ctx.shadowBlur = 20;
      ctx.fill();

      for (const p of particles) {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;

        const force = (gravityStrength * 120) / (dist * dist + 100);
        const dir = isRepelling ? -1 : 1;

        p.vx += (dx / dist) * force * dir;
        p.vy += (dy / dist) * force * dir;

        // Friction dampening
        p.vx *= 0.985;
        p.vy *= 0.985;

        p.x += p.vx;
        p.y += p.vy;

        // Wall bounces
        if (p.x < 0 || p.x > width) p.vx *= -0.9;
        if (p.y < 0 || p.y > height) p.vy *= -0.9;

        // Render particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [particleCount, gravityStrength, isRepelling]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
            <span>Particle Gravitational Attractor</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              N-Body Physics
            </span>
          </h3>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Move your cursor inside the canvas to manipulate the gravitational singularity field.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            setIsRepelling(!isRepelling);
          }}
          className={`px-4 py-2 rounded-xl font-mono text-xs font-bold border transition-all ${
            isRepelling
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-purple-500/20 text-purple-300 border-purple-500/40'
          }`}
        >
          {isRepelling ? 'MODE: REPEL FIELD' : 'MODE: ATTRACT GRAVITY'}
        </button>
      </div>

      <div className="relative rounded-2xl border border-slate-800 overflow-hidden bg-[#070311] shadow-2xl">
        <canvas ref={canvasRef} className="w-full h-80 block cursor-crosshair" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs text-slate-300">
        <div>
          <label className="block mb-1 text-slate-400">Particle Density: {particleCount}</label>
          <input
            type="range"
            min="20"
            max="120"
            value={particleCount}
            onChange={(e) => setParticleCount(Number(e.target.value))}
            className="w-full accent-purple-500 cursor-pointer"
          />
        </div>
        <div>
          <label className="block mb-1 text-slate-400">Gravitational Pull: {gravityStrength.toFixed(1)}G</label>
          <input
            type="range"
            min="0.2"
            max="2.5"
            step="0.1"
            value={gravityStrength}
            onChange={(e) => setGravityStrength(Number(e.target.value))}
            className="w-full accent-cyan-400 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------- */
/* 3. Search Race Visualizer: Binary vs Linear          */
/* ---------------------------------------------------- */
const SearchRaceVisualizer: React.FC = () => {
  const [arraySize, setArraySize] = useState(1000);
  const [targetNumber, setTargetNumber] = useState(742);
  const [linearSteps, setLinearSteps] = useState<number | null>(null);
  const [binarySteps, setBinarySteps] = useState<number | null>(null);
  const [isRacing, setIsRacing] = useState(false);

  const runRace = () => {
    setIsRacing(true);
    soundFx.playCodeRun();

    // Linear Search: Steps = target index
    let lSteps = 0;
    for (let i = 1; i <= arraySize; i++) {
      lSteps++;
      if (i === targetNumber) break;
    }

    // Binary Search: Steps = log2(N)
    let bSteps = 0;
    let low = 1;
    let high = arraySize;
    while (low <= high) {
      bSteps++;
      const mid = Math.floor((low + high) / 2);
      if (mid === targetNumber) break;
      if (mid < targetNumber) low = mid + 1;
      else high = mid - 1;
    }

    setTimeout(() => {
      setLinearSteps(lSteps);
      setBinarySteps(bSteps);
      setIsRacing(false);
      soundFx.playSuccess();
    }, 400);
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-800 pb-4">
        <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
          <span>Search Complexity Race</span>
          <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            O(N) vs O(log N)
          </span>
        </h3>
        <p className="font-mono text-xs text-slate-400 mt-1">
          Compare algorithmic efficiency searching for item <strong className="text-white">#{targetNumber}</strong> in a sorted array of <strong className="text-white">{arraySize.toLocaleString()} elements</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
        <div>
          <label className="block text-slate-400 mb-1">Array Size: {arraySize.toLocaleString()}</label>
          <input
            type="range"
            min="100"
            max="5000"
            step="100"
            value={arraySize}
            onChange={(e) => {
              const val = Number(e.target.value);
              setArraySize(val);
              if (targetNumber > val) setTargetNumber(Math.floor(val * 0.7));
            }}
            className="w-full accent-emerald-400"
          />
        </div>
        <div>
          <label className="block text-slate-400 mb-1">Target Value: {targetNumber}</label>
          <input
            type="range"
            min="1"
            max={arraySize}
            value={targetNumber}
            onChange={(e) => setTargetNumber(Number(e.target.value))}
            className="w-full accent-purple-400"
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={runRace}
          disabled={isRacing}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{isRacing ? 'Running Comparator...' : 'Execute Search Race'}</span>
        </button>
      </div>

      {/* Comparison Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        {/* Linear Search Card */}
        <div className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-syne font-bold text-white text-base">Linear Search</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-rose-500/20 text-rose-300">O(N)</span>
          </div>
          <p className="font-sans text-xs text-slate-400">
            Checks each element sequentially from left to right until the match is found.
          </p>
          <div className="pt-2 border-t border-rose-500/20 flex items-center justify-between font-mono text-sm">
            <span className="text-slate-400">Operations Needed:</span>
            <span className="font-bold text-rose-400 text-lg">
              {linearSteps !== null ? `${linearSteps.toLocaleString()} steps` : '--'}
            </span>
          </div>
        </div>

        {/* Binary Search Card */}
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-syne font-bold text-white text-base">Binary Search (Divide & Conquer)</span>
            <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">O(log N)</span>
          </div>
          <p className="font-sans text-xs text-slate-400">
            Halves search space on every iteration by inspecting middle index.
          </p>
          <div className="pt-2 border-t border-emerald-500/20 flex items-center justify-between font-mono text-sm">
            <span className="text-slate-400">Operations Needed:</span>
            <span className="font-bold text-emerald-400 text-lg">
              {binarySteps !== null ? `${binarySteps} steps (99.8% faster)` : '--'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------------------------------- */
/* 4. Live JavaScript/TypeScript REPL Sandbox          */
/* ---------------------------------------------------- */
const PRESET_SCRIPTS = [
  {
    title: 'Fibonacci Generator (Memoized)',
    code: `// Memoized Fibonacci Sequence generator
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  return memo[n];
}

const terms = Array.from({ length: 15 }, (_, i) => fibMemo(i));
console.log("First 15 Fibonacci Numbers:", terms);
return { terms, result: fibMemo(40) };`,
  },
  {
    title: 'Two Sum Hash Map Lookup',
    code: `// Two Sum Algorithm with O(N) Hash Map
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

const sample = [2, 7, 11, 15, 23, 45];
const indices = twoSum(sample, 26);
console.log("Found indices for target 26:", indices);
return { indices, values: [sample[indices[0]], sample[indices[1]]] };`,
  },
];

const LiveCodeRepl: React.FC = () => {
  const [code, setCode] = useState(PRESET_SCRIPTS[0].code);
  const [output, setOutput] = useState<string>('Click "Execute Script" to evaluate in sandbox.');
  const [execTime, setExecTime] = useState<number | null>(null);

  const handleExecute = () => {
    soundFx.playCodeRun();
    const logs: string[] = [];
    const customConsole = {
      log: (...args: unknown[]) => {
        logs.push(args.map((a) => (typeof a === 'object' ? JSON.stringify(a) : String(a))).join(' '));
      },
    };

    try {
      const start = performance.now();
      // eslint-disable-next-line no-new-func
      const runner = new Function('console', code);
      const res = runner(customConsole);
      const duration = Number((performance.now() - start).toFixed(2));
      setExecTime(duration);

      const outputStr = [
        ...logs,
        res !== undefined ? `↳ Return Value: ${JSON.stringify(res, null, 2)}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      setOutput(outputStr || 'Code executed successfully with zero output.');
      soundFx.playSuccess();
    } catch (err: unknown) {
      setOutput(`Error: ${err instanceof Error ? err.message : String(err)}`);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h3 className="font-syne text-xl font-bold text-white flex items-center gap-2">
            <span>In-Browser Live JS/TS Sandbox</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Interactive REPL
            </span>
          </h3>
          <p className="font-mono text-xs text-slate-400 mt-1">
            Write or edit code directly and execute inside the client runtime.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_SCRIPTS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                soundFx.playClick();
                setCode(preset.code);
              }}
              className="px-2.5 py-1 rounded-xl border border-slate-800 bg-slate-900 text-[11px] font-mono text-slate-300 hover:text-white"
            >
              {preset.title}
            </button>
          ))}
          <button
            onClick={handleExecute}
            data-cursor="RUN"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Run Code</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Editor Area */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 font-mono text-xs">
          <div className="text-[11px] text-slate-500 mb-2">// Editor Input</div>
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={10}
            className="w-full bg-transparent text-cyan-200 outline-none resize-none font-mono text-xs leading-relaxed"
            spellCheck={false}
          />
        </div>

        {/* Output Console */}
        <div className="rounded-2xl border border-slate-800 bg-[#05070f] p-4 font-mono text-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 mb-2">
              <span>// Console Output</span>
              {execTime !== null && <span className="text-emerald-400">{execTime}ms execution</span>}
            </div>
            <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed overflow-y-auto max-h-56">
              {output}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
