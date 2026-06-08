import React from 'react';
import { useGame } from '../../context/GameContext';
import { ScreenWrapper } from '../../components/Animations/ScreenWrapper';
import { Button } from '../../components/UI/Button';
import { Card } from '../../components/UI/Card';
import { THEME_CONFIGS } from '../../utils/themes';
import { motion } from 'framer-motion';
import { FaHome, FaRedo, FaTrophy } from 'react-icons/fa';

export const WinnerScreen: React.FC = () => {
  const { state, startGame, resetActiveGame } = useGame();
  const activeTheme = THEME_CONFIGS[state.theme];

  // Find winner details
  const winner = state.players.find(p => p.id === state.winnerId);
  const winnerName = winner ? winner.name : 'Unknown';
  const isWinnerHuman = winner ? winner.isHuman : false;

  const handleRematch = () => {
    startGame(state.mode, state.difficulty);
  };

  // Convert duration
  const startTime = state.stats.startTime;
  const endTime = state.stats.endTime || state.stats.startTime;
  const durationSec = Math.max(1, Math.round((endTime - startTime) / 1000));
  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return mins > 0 ? `${mins}m ${remainder}s` : `${remainder}s`;
  };

  return (
    <ScreenWrapper className={`${activeTheme.bodyBg} transition-colors duration-500`}>
      <div className="max-w-md w-full flex flex-col items-center gap-6">
        
        {/* Victory Banner */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 100 }}
          className="text-center"
        >
          <span className="text-6xl animate-bounce inline-block mb-3">
            {isWinnerHuman ? '🎉' : '🤖'}
          </span>
          <h1 className={`text-4xl sm:text-5xl ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent leading-tight`}>
            VICTORY!
          </h1>
          <p className="text-lg font-bold text-white mt-1 shadow-sm">
            {winnerName} is the champion!
          </p>
        </motion.div>

        {/* Stats Card */}
        <Card className="w-full flex flex-col gap-4">
          <h3 className={`text-lg font-bold text-white border-b border-white/10 pb-2 flex items-center gap-2 ${activeTheme.fontHeading}`}>
            📊 Match Statistics
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
            
            <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-left">
              <span className="opacity-70 text-[10px] sm:text-xs block">TOTAL TURNS</span>
              <span className="text-base sm:text-lg font-black text-white">{state.stats.turns}</span>
            </div>

            <div className="bg-black/20 p-2.5 rounded-xl border border-white/5 text-left">
              <span className="opacity-70 text-[10px] sm:text-xs block">MATCH DURATION</span>
              <span className="text-base sm:text-lg font-black text-white">{formatDuration(durationSec)}</span>
            </div>

            {state.players.map(p => (
              <div key={p.id} className="bg-black/20 p-3 rounded-xl border border-white/5 text-left col-span-2">
                <div className="flex items-center justify-between border-b border-white/5 pb-1 mb-2">
                  <span className="font-bold text-xs" style={{ color: p.colorHex }}>{p.name}</span>
                  <span className="text-[10px] opacity-75">Tile: {p.position}</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-2 text-[10px] sm:text-xs">
                  <div className="flex justify-between">
                    <span className="opacity-75">🪜 Ladders Climbed:</span>
                    <span className="font-bold text-white">{state.stats.laddersClimbed[p.id] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">🐍 Snakes Landed:</span>
                    <span className="font-bold text-white">{state.stats.snakesLanded[p.id] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">🎲 6s Rolled:</span>
                    <span className="font-bold text-white">{state.stats.sixesRolled[p.id] || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-75">🛡️ Cards Played:</span>
                    <span className="font-bold text-white">{state.stats.powerupsUsed[p.id] || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Highlights newly unlocked achievements if any */}
          <div className="flex flex-col gap-1 border-t border-white/10 pt-2 text-left">
            <span className="text-xs font-bold opacity-60 flex items-center gap-1"><FaTrophy className="text-amber-400" /> ACHIEVEMENTS ATTAINED</span>
            {state.achievements.filter(a => a.unlocked).length === 0 ? (
              <p className="text-[10px] opacity-50 italic">No achievements unlocked yet.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {state.achievements.filter(a => a.unlocked).map(a => (
                  <span key={a.id} className="text-[10px] font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                    {a.icon} {a.title}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Navigation Controls */}
        <div className="flex gap-3 w-full">
          <Button
            type="primary"
            onClick={handleRematch}
            className="flex-1 py-3 text-sm flex justify-center items-center gap-2"
          >
            <FaRedo className="text-xs" /> Rematch
          </Button>

          <Button
            type="secondary"
            onClick={resetActiveGame}
            className="flex-1 py-3 text-sm flex justify-center items-center gap-2"
          >
            <FaHome className="text-xs" /> Main Menu
          </Button>
        </div>

      </div>
    </ScreenWrapper>
  );
};
export default WinnerScreen;
