import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../../context/GameContext';
import { ScreenWrapper } from '../../components/Animations/ScreenWrapper';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import type { Difficulty } from '../../types/game';
import { THEME_CONFIGS } from '../../utils/themes';
import { GiSnake, GiLadder } from 'react-icons/gi';
import { FaPlay, FaBookOpen, FaCog, FaTrophy } from 'react-icons/fa';

export const HomeScreen: React.FC = () => {
  const { state, startGame, goToScreen } = useGame();
  const activeTheme = THEME_CONFIGS[state.theme];
  const [showDifficultySelect, setShowDifficultySelect] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'stats'>('menu');

  const handleStartPvP = () => {
    startGame('PvP', 'easy');
  };

  const handleStartPvC = (difficulty: Difficulty) => {
    startGame('PvC', difficulty);
  };

  const hasSavedGame = localStorage.getItem('snakes-ladders-save') !== null;

  // Render achievement counts
  const unlockedCount = state.achievements.filter(a => a.unlocked).length;

  return (
    <ScreenWrapper className={`${activeTheme.bodyBg} transition-colors duration-500`}>
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        
        {/* Animated Game Logo */}
        <motion.div 
          className="flex flex-col items-center text-center select-none"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 80, delay: 0.1 }}
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <motion.div
              animate={{ rotate: [0, -10, 10, 0], y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            >
              <GiSnake className="text-5xl sm:text-6xl text-rose-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]" />
            </motion.div>
            <span className={`text-4xl sm:text-5xl tracking-tighter ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent`}>
              Snakes &
            </span>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.5 }}
            >
              <GiLadder className="text-5xl sm:text-6xl text-amber-500 drop-shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
            </motion.div>
          </div>
          <span className={`text-3xl sm:text-4xl tracking-widest leading-none ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent`}>
            LADDERS
          </span>
          <p className={`text-xs mt-2 opacity-75 font-medium tracking-widest ${activeTheme.fontBody}`}>
            ULTIMATE STRATEGY EDITION
          </p>
        </motion.div>

        {/* Main Control Panel */}
        <Card className="w-full flex flex-col gap-4">
          <div className="flex border-b border-white/10 pb-2 mb-2 justify-center gap-4">
            <button
              onClick={() => setActiveTab('menu')}
              className={`pb-1 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                activeTab === 'menu' 
                  ? 'border-fuchsia-500 text-current opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-85'
              }`}
            >
              Play Menu
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`pb-1 text-sm font-bold border-b-2 cursor-pointer transition-all ${
                activeTab === 'stats' 
                  ? 'border-fuchsia-500 text-current opacity-100' 
                  : 'border-transparent opacity-60 hover:opacity-85'
              }`}
            >
              Achievements & Stats
            </button>
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'menu' ? (
              <motion.div 
                key="menu-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="flex flex-col gap-3"
              >
                {!showDifficultySelect ? (
                  <>
                    {/* Resume Game if present */}
                    {hasSavedGame && (
                      <Button
                        type="primary"
                        onClick={() => goToScreen('game')}
                        className="py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 border border-violet-400/40 text-white shadow-lg animate-pulse"
                      >
                        <FaPlay className="text-sm" /> Resume Match
                      </Button>
                    )}

                    <Button
                      type="primary"
                      onClick={() => setShowDifficultySelect(true)}
                      className="py-3"
                    >
                      Play vs Computer
                    </Button>

                    <Button
                      type="secondary"
                      onClick={handleStartPvP}
                      className="py-3"
                    >
                      Local PvP (Pass & Play)
                    </Button>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <Button
                        type="secondary"
                        onClick={() => goToScreen('rules')}
                        className="py-2.5 text-sm"
                      >
                        <FaBookOpen /> Rules
                      </Button>

                      <Button
                        type="secondary"
                        onClick={() => goToScreen('settings')}
                        className="py-2.5 text-sm"
                      >
                        <FaCog /> Settings
                      </Button>
                    </div>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col gap-2.5"
                  >
                    <h3 className={`text-center font-bold mb-1 ${activeTheme.fontHeading}`}>
                      Select AI Difficulty
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        type="secondary"
                        onClick={() => handleStartPvC('easy')}
                        className="py-2.5 hover:bg-green-500/10 hover:text-green-400 hover:border-green-500/40"
                      >
                        🟢 Easy AI
                      </Button>
                      <Button
                        type="secondary"
                        onClick={() => handleStartPvC('medium')}
                        className="py-2.5 hover:bg-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/40"
                      >
                        🟡 Medium AI
                      </Button>
                      <Button
                        type="secondary"
                        onClick={() => handleStartPvC('hard')}
                        className="py-2.5 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/40"
                      >
                        🟠 Hard AI
                      </Button>
                      <Button
                        type="secondary"
                        onClick={() => handleStartPvC('impossible')}
                        className="py-2.5 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/40 border-red-500/20"
                      >
                        🔴 Impossible
                      </Button>
                    </div>

                    <Button
                      type="ghost"
                      onClick={() => setShowDifficultySelect(false)}
                      className="mt-2 text-sm text-center py-2"
                    >
                      Back to Menu
                    </Button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="stats-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col gap-3"
              >
                {/* Achievements overview */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="font-bold flex items-center gap-2"><FaTrophy className="text-amber-400" /> Achievements</span>
                  <span className="text-sm font-bold px-2 py-0.5 bg-white/10 rounded-full">{unlockedCount} / {state.achievements.length}</span>
                </div>

                <div className="max-h-48 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
                  {state.achievements.map(ach => (
                    <div 
                      key={ach.id} 
                      className={`flex items-center gap-3 p-2 rounded-xl transition-all border ${
                        ach.unlocked 
                          ? 'bg-fuchsia-500/10 border-fuchsia-500/30' 
                          : 'bg-black/15 border-transparent opacity-50'
                      }`}
                    >
                      <span className="text-2xl">{ach.unlocked ? ach.icon : '🔒'}</span>
                      <div className="text-left flex-1 min-w-0">
                        <p className="font-bold text-xs sm:text-sm leading-tight text-white">{ach.title}</p>
                        <p className="text-[10px] leading-tight opacity-75">{ach.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Match history summary */}
                <div className="border-t border-white/10 pt-2.5 mt-1 flex flex-col gap-1">
                  <p className="text-xs font-bold opacity-60 text-left">MATCH HISTORY</p>
                  {state.matchHistory.length === 0 ? (
                    <p className="text-[11px] opacity-50 italic text-center py-2">No matches played yet.</p>
                  ) : (
                    <div className="flex flex-col gap-1.5 max-h-24 overflow-y-auto scrollbar-thin">
                      {state.matchHistory.map((m, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] sm:text-xs bg-black/10 p-1.5 rounded-lg border border-white/5">
                          <span className="font-bold text-white truncate max-w-[150px]">{m.winnerName} won</span>
                          <span className="opacity-75">{m.mode === 'PvC' ? `${m.difficulty} AI` : 'PvP'} ({m.turns} turns)</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>

        {/* Credits */}
        <motion.div 
          className="text-center opacity-60 text-[10px] font-medium leading-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
        >
          <p>© 2026 Ultimate Snakes & Ladders Inc.</p>
          <p className="mt-0.5">Designed with passion using React, TypeScript & Framer Motion</p>
        </motion.div>

      </div>
    </ScreenWrapper>
  );
};
export default HomeScreen;
