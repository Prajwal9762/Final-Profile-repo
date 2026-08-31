import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Terminal as TerminalIcon, Sparkles, Play, Code2 } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { THEMES, ThemeId } from '../utils/theme';
import { BRAND_GITHUB } from '../utils/brand';

export const HeroVisual: React.FC<{ isMobile: boolean; themeId?: ThemeId }> = ({
  isMobile,
  themeId = 'cyan',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [terminalTab, setTerminalTab] = useState<'terminal' | 'interactive'>('terminal');
  const [cmdInput, setCmdInput] = useState('');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    '$ whoami',
    'prajwal pokharel // developer',
    '$ location',
    'kathmandu, nepal 🇳🇵',
    '$ focus',
    'react 19, typescript, algorithmic performance, full-stack systems',
    '$ portfolio',
    'https://prajwal-pokharel.com.np',
  ]);

  const activeTheme = THEMES[themeId] || THEMES.cyan;

  // Three.js 3D Floating Geometry
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Clear any previous canvas
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Inner Glowing Polyhedron (Icosahedron)
    const geometry = new THREE.IcosahedronGeometry(1.6, 1);
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: activeTheme.threeColor,
      linewidth: 2,
    });
    const wireframeMesh = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    scene.add(wireframeMesh);

    // Inner Core Solid
    const coreGeo = new THREE.IcosahedronGeometry(0.9, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: activeTheme.threeColor,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Outer Orbiting Ring
    const torusGeo = new THREE.TorusGeometry(2.5, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: activeTheme.threeColor,
      wireframe: true,
    });
    const torusMesh = new THREE.Mesh(torusGeo, torusMat);
    torusMesh.rotation.x = Math.PI / 3;
    scene.add(torusMesh);

    // Orbiting Particles Ring
    const particlesGeo = new THREE.BufferGeometry();
    const pCount = 120;
    const posArray = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const angle = (i / pCount) * Math.PI * 2;
      const radius = 2.8 + (Math.random() - 0.5) * 0.4;
      posArray[i * 3] = Math.cos(angle) * radius;
      posArray[i * 3 + 1] = (Math.random() - 0.5) * 0.8;
      posArray[i * 3 + 2] = Math.sin(angle) * radius;
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const pMat = new THREE.PointsMaterial({
      size: 0.04,
      color: activeTheme.threeColor,
      transparent: true,
      opacity: 0.8,
    });
    const particleSystem = new THREE.Points(particlesGeo, pMat);
    scene.add(particleSystem);

    let animationFrameId: number;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / width - 0.5) * 2;
      mouseY = -((e.clientY - rect.top) / height - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      wireframeMesh.rotation.x += 0.005;
      wireframeMesh.rotation.y += 0.008;

      coreMesh.rotation.x -= 0.007;
      coreMesh.rotation.y -= 0.005;

      torusMesh.rotation.z += 0.006;
      particleSystem.rotation.y += 0.004;

      // Mouse reactivity tilt
      scene.rotation.y += (mouseX * 0.5 - scene.rotation.y) * 0.05;
      scene.rotation.x += (-mouseY * 0.5 - scene.rotation.x) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [themeId, activeTheme]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cmdInput.trim()) return;

    soundFx.playBeep();
    const cmd = cmdInput.trim().toLowerCase();
    let response = '';

    if (cmd === 'help') {
      response = 'Available commands: whoami, location, focus, skills, github, contact, clear';
    } else if (cmd === 'whoami') {
      response = 'Prajwal Pokharel — Aspiring Software Developer from Nepal.';
    } else if (cmd === 'location') {
      response = 'Kathmandu / Pokhara, Nepal (Timezone: Asia/Kathmandu, UTC+5:45)';
    } else if (cmd === 'focus') {
      response = 'High-performance React 19 web applications, clean TypeScript, UI algorithms.';
    } else if (cmd === 'skills') {
      response = 'HTML5, CSS3, JavaScript, TypeScript, React, Tailwind CSS, Python, Git, Linux.';
    } else if (cmd === 'github') {
      response = BRAND_GITHUB;
    } else if (cmd === 'contact') {
      response = 'Official Site: https://prajwal-pokharel.com.np';
    } else if (cmd === 'clear') {
      setTerminalLogs([]);
      setCmdInput('');
      return;
    } else {
      response = `Command not recognized: '${cmd}'. Type 'help' for options.`;
    }

    setTerminalLogs((prev) => [...prev, `$ ${cmdInput}`, response]);
    setCmdInput('');
  };

  return (
    <div className="relative w-full max-w-lg lg:max-w-xl mx-auto flex flex-col items-center">
      {/* 3D Three.js Polyhedron Container */}
      <div
        ref={mountRef}
        data-cursor="3D SHAPE"
        className="h-64 sm:h-80 w-full relative cursor-grab active:cursor-grabbing flex items-center justify-center"
      >
        <div
          className="absolute inset-0 pointer-events-none blur-3xl opacity-20"
          style={{ backgroundColor: activeTheme.colors.primary }}
        />
      </div>

      {/* Futuristic Developer Terminal Widget */}
      <div className="w-full glass-panel rounded-3xl border border-slate-800 bg-slate-950/90 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden font-mono text-xs scanline-effect backdrop-blur-2xl">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/80 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-rose-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
            <span className="ml-2 text-slate-400 text-[11px]">prajwal@nepal-dev:~</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                soundFx.playClick();
                setTerminalTab('terminal');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                terminalTab === 'terminal'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              TERMINAL
            </button>
            <button
              onClick={() => {
                soundFx.playClick();
                setTerminalTab('interactive');
              }}
              className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold transition-colors ${
                terminalTab === 'interactive'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              MACROS
            </button>
          </div>
        </div>

        {/* Terminal Content Body */}
        {terminalTab === 'terminal' ? (
          <div className="p-4 h-48 overflow-y-auto space-y-2 text-slate-300 selection:bg-purple-500/30">
            {terminalLogs.map((log, idx) => (
              <div key={idx} className={log.startsWith('$') ? 'text-cyan-300 font-bold' : 'text-slate-300 pl-3 border-l border-slate-800'}>
                {log}
              </div>
            ))}

            <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800/60">
              <span className="text-cyan-400 font-bold">$</span>
              <input
                type="text"
                value={cmdInput}
                onChange={(e) => setCmdInput(e.target.value)}
                placeholder="type 'help' or command..."
                className="w-full bg-transparent text-white outline-none placeholder:text-slate-600 font-mono text-xs"
              />
            </form>
          </div>
        ) : (
          <div className="p-4 h-48 flex flex-col justify-between text-slate-300">
            <div>
              <div className="text-white font-bold flex items-center gap-2 mb-2 font-syne">
                <Code2 className="h-4 w-4 text-purple-400" />
                <span>Interactive Shell Commands</span>
              </div>
              <p className="text-slate-400 text-[11px] leading-relaxed mb-3">
                Execute live system queries on Prajwal's portfolio state.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {[
                { cmd: 'whoami', label: 'Who is Prajwal?' },
                { cmd: 'location', label: 'Nepal Location' },
                { cmd: 'skills', label: 'Tech Stack' },
                { cmd: 'contact', label: 'Official URL' },
              ].map((item) => (
                <button
                  key={item.cmd}
                  onClick={() => {
                    setCmdInput(item.cmd);
                    handleCommandSubmit({ preventDefault: () => {} } as React.FormEvent);
                    setTerminalTab('terminal');
                  }}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-left hover:border-purple-500/40 hover:bg-purple-500/10 text-slate-200 hover:text-white transition-all"
                >
                  <span className="text-[11px] font-mono">{item.label}</span>
                  <Play className="h-3 w-3 text-purple-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
