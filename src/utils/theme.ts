export type ThemeId = 'cyan' | 'violet' | 'emerald' | 'amber' | 'monochrome';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  subtitle: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    bgCard: string;
    border: string;
    glow: string;
    textGlow: string;
    gradient: string;
  };
  threeColor: number;
  canvasColors: string[];
}

export const THEMES: Record<ThemeId, ThemeConfig> = {
  violet: {
    id: 'violet',
    name: 'Obsidian Violet',
    subtitle: 'Cyberpunk plum, electric violet & neon fuchsia',
    colors: {
      primary: '#a855f7',
      secondary: '#ec4899',
      accent: '#f43f5e',
      bg: '#070311',
      bgCard: '#110924',
      border: 'rgba(168, 85, 247, 0.3)',
      glow: 'rgba(168, 85, 247, 0.45)',
      textGlow: '#c084fc',
      gradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
    },
    threeColor: 0xa855f7,
    canvasColors: ['#a855f7', '#ec4899', '#f43f5e', '#c084fc'],
  },
  emerald: {
    id: 'emerald',
    name: 'Monokai Emerald',
    subtitle: 'Deep carbon, acid emerald & neon gold',
    colors: {
      primary: '#10b981',
      secondary: '#84cc16',
      accent: '#eab308',
      bg: '#030c07',
      bgCard: '#081a10',
      border: 'rgba(16, 185, 129, 0.3)',
      glow: 'rgba(16, 185, 129, 0.45)',
      textGlow: '#34d399',
      gradient: 'from-emerald-400 via-teal-400 to-lime-400',
    },
    threeColor: 0x10b981,
    canvasColors: ['#10b981', '#84cc16', '#34d399', '#eab308'],
  },
  amber: {
    id: 'amber',
    name: 'Solar Flare',
    subtitle: 'Volcanic charcoal, blazing orange & warm ember',
    colors: {
      primary: '#f97316',
      secondary: '#f59e0b',
      accent: '#ef4444',
      bg: '#0d0603',
      bgCard: '#1d0d07',
      border: 'rgba(249, 115, 22, 0.3)',
      glow: 'rgba(249, 115, 22, 0.45)',
      textGlow: '#fb923c',
      gradient: 'from-orange-500 via-amber-500 to-rose-500',
    },
    threeColor: 0xf97316,
    canvasColors: ['#f97316', '#f59e0b', '#fb923c', '#ef4444'],
  },
  cyan: {
    id: 'cyan',
    name: 'Electric Cobalt',
    subtitle: 'Deep midnight, electric cyan & hyper blue',
    colors: {
      primary: '#06b6d4',
      secondary: '#3b82f6',
      accent: '#6366f1',
      bg: '#040814',
      bgCard: '#091329',
      border: 'rgba(6, 182, 212, 0.3)',
      glow: 'rgba(6, 182, 212, 0.45)',
      textGlow: '#38bdf8',
      gradient: 'from-cyan-400 via-sky-400 to-indigo-400',
    },
    threeColor: 0x06b6d4,
    canvasColors: ['#06b6d4', '#38bdf8', '#3b82f6', '#818cf8'],
  },
  monochrome: {
    id: 'monochrome',
    name: 'Titanium Stealth',
    subtitle: 'Brutalist onyx, pure platinum & ruby laser',
    colors: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
      accent: '#ef4444',
      bg: '#09090b',
      bgCard: '#18181b',
      border: 'rgba(248, 250, 252, 0.25)',
      glow: 'rgba(248, 250, 252, 0.3)',
      textGlow: '#e2e8f0',
      gradient: 'from-slate-100 via-slate-300 to-slate-400',
    },
    threeColor: 0xf8fafc,
    canvasColors: ['#f8fafc', '#94a3b8', '#ef4444', '#cbd5e1'],
  },
};

export const applyTheme = (themeId: ThemeId) => {
  const theme = THEMES[themeId] || THEMES.cyan;
  const root = document.documentElement;

  root.style.setProperty('--theme-primary', theme.colors.primary);
  root.style.setProperty('--theme-secondary', theme.colors.secondary);
  root.style.setProperty('--theme-accent', theme.colors.accent);
  root.style.setProperty('--theme-bg', theme.colors.bg);
  root.style.setProperty('--theme-card', theme.colors.bgCard);
  root.style.setProperty('--theme-glow', theme.colors.glow);
  root.style.setProperty('--theme-text-glow', theme.colors.textGlow);
  root.style.setProperty('--theme-border', theme.colors.border);

  try {
    localStorage.setItem('prajwal_portfolio_theme', themeId);
  } catch (e) {
    // Ignore if cookies/localStorage are blocked
  }
};

export const getSavedTheme = (): ThemeId => {
  try {
    const saved = localStorage.getItem('prajwal_portfolio_theme') as ThemeId;
    if (saved && THEMES[saved]) return saved;
  } catch (e) {
    // fallback
  }
  return 'cyan';
};
