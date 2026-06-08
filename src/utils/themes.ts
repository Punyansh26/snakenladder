export interface ThemeConfig {
  name: string;
  bodyBg: string;
  boardBg: string;
  boardBorder: string;
  gridLine: string;
  cellEven: string;
  cellOdd: string;
  cellText: string;
  fontHeading: string;
  fontBody: string;
  primaryButton: string;
  secondaryButton: string;
  panelBg: string;
  titleGradient: string;
  svgConfig: {
    snakeColor: string;
    snakeHeadColor: string;
    ladderColor: string;
    ladderRungColor: string;
  };
}

export const THEME_CONFIGS: { [key: string]: ThemeConfig } = {
  classic: {
    name: 'Classic Wood',
    bodyBg: 'bg-gradient-to-br from-amber-50 to-orange-100 text-amber-900',
    boardBg: 'bg-[#f4ebd0]',
    boardBorder: 'border-8 border-amber-900 shadow-2xl rounded-xl',
    gridLine: 'border-amber-900/20',
    cellEven: 'bg-[#e2d4b7]/50',
    cellOdd: 'bg-[#eedfb9]/30',
    cellText: 'text-amber-950 font-semibold font-serif',
    fontHeading: 'font-serif font-bold',
    fontBody: 'font-serif',
    primaryButton: 'bg-amber-800 hover:bg-amber-950 text-amber-50 border border-amber-950 shadow-md transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    secondaryButton: 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-950/20 shadow-sm transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    panelBg: 'bg-amber-50/90 backdrop-blur-sm border-2 border-amber-900/25 rounded-2xl shadow-xl',
    titleGradient: 'from-amber-950 via-amber-800 to-amber-950',
    svgConfig: {
      snakeColor: '#b45309', // amber-700
      snakeHeadColor: '#78350f', // amber-900
      ladderColor: '#d97706', // amber-600
      ladderRungColor: '#854d0e', // amber-800
    },
  },
  neon: {
    name: 'Neon Cyberpunk',
    bodyBg: 'bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-cyan-400',
    boardBg: 'bg-slate-950/90 backdrop-blur-md',
    boardBorder: 'border-4 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.6)] rounded-xl',
    gridLine: 'border-purple-500/30',
    cellEven: 'bg-slate-900/70',
    cellOdd: 'bg-purple-950/20',
    cellText: 'text-cyan-400 font-bold font-mono tracking-wider',
    fontHeading: 'font-mono uppercase tracking-widest font-black',
    fontBody: 'font-mono text-xs md:text-sm',
    primaryButton: 'bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.6)] border border-fuchsia-400 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    secondaryButton: 'bg-slate-900 hover:bg-slate-800 text-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.3)] border border-cyan-500/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    panelBg: 'bg-slate-900/80 backdrop-blur-md border border-purple-500/50 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    titleGradient: 'from-cyan-400 via-fuchsia-500 to-cyan-400 animate-pulse',
    svgConfig: {
      snakeColor: '#ec4899', // pink-500
      snakeHeadColor: '#f43f5e', // rose-500
      ladderColor: '#06b6d4', // cyan-500
      ladderRungColor: '#3b82f6', // blue-500
    },
  },
  space: {
    name: 'Space Galaxy',
    bodyBg: 'bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-indigo-200',
    boardBg: 'bg-indigo-950/60 backdrop-blur-md',
    boardBorder: 'border-4 border-indigo-500/70 shadow-[0_0_30px_rgba(99,102,241,0.5)] rounded-xl',
    gridLine: 'border-indigo-400/20',
    cellEven: 'bg-blue-950/40',
    cellOdd: 'bg-indigo-900/20',
    cellText: 'text-indigo-200 font-extrabold tracking-wide font-sans',
    fontHeading: 'font-sans tracking-tight font-extrabold',
    fontBody: 'font-sans',
    primaryButton: 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg border border-indigo-400/35 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    secondaryButton: 'bg-indigo-950/60 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    panelBg: 'bg-indigo-950/40 backdrop-blur-lg border border-indigo-500/20 rounded-2xl shadow-2xl',
    titleGradient: 'from-blue-400 via-indigo-200 to-purple-400',
    svgConfig: {
      snakeColor: '#ef4444', // red-500
      snakeHeadColor: '#f97316', // orange-500
      ladderColor: '#10b981', // emerald-500
      ladderRungColor: '#a855f7', // purple-500
    },
  },
  jungle: {
    name: 'Jungle Nature',
    bodyBg: 'bg-gradient-to-br from-emerald-950 via-green-900 to-stone-900 text-emerald-100',
    boardBg: 'bg-emerald-950/50 backdrop-blur-sm',
    boardBorder: 'border-6 border-emerald-900 shadow-2xl rounded-xl',
    gridLine: 'border-emerald-800/30',
    cellEven: 'bg-emerald-900/40',
    cellOdd: 'bg-stone-900/30',
    cellText: 'text-emerald-100 font-semibold font-sans',
    fontHeading: 'font-sans tracking-wide font-bold',
    fontBody: 'font-sans',
    primaryButton: 'bg-emerald-700 hover:bg-emerald-600 text-white shadow-md border border-emerald-600/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    secondaryButton: 'bg-stone-900/50 hover:bg-stone-800 text-emerald-200 border border-emerald-900/50 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200',
    panelBg: 'bg-emerald-950/65 backdrop-blur-md border border-emerald-800/40 rounded-2xl shadow-xl',
    titleGradient: 'from-green-400 via-emerald-100 to-yellow-200',
    svgConfig: {
      snakeColor: '#10b981', // emerald-500
      snakeHeadColor: '#047857', // emerald-700
      ladderColor: '#d97706', // amber-600
      ladderRungColor: '#b45309', // amber-700
    },
  },
};
