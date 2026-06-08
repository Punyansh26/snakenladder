import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useAI } from '../../hooks/useAI';
import { ScreenWrapper } from '../../components/Animations/ScreenWrapper';
import { Board } from '../../components/Board/Board';
import { ThreeDDie } from '../../components/Dice/3DDie';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { THEME_CONFIGS } from '../../utils/themes';
import { FaHome, FaCog, FaHistory, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export const GameScreen: React.FC = () => {
  // Mount the AI turn controller hook
  useAI();

  const { 
    state, rollDice, activatePowerUp, goToScreen, resetActiveGame, changeVolume
  } = useGame();

  const activeTheme = THEME_CONFIGS[state.theme];

  // Get active turn player details
  const activePlayer = state.players.find(p => p.id === state.currentTurn);
  const isHumanTurn = activePlayer ? activePlayer.isHuman : false;

  // Keyboard accessibility controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'Enter') && isHumanTurn && state.status === 'playing') {
        e.preventDefault(); // prevent scroll
        rollDice();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isHumanTurn, state.status, rollDice]);

  // Handle manual roll button
  const handleRollClick = () => {
    if (isHumanTurn && state.status === 'playing') {
      rollDice();
    }
  };

  // Toggle master audio mute
  const handleToggleMute = () => {
    const nextVol = state.sfxVolume > 0 ? 0 : 0.5;
    changeVolume('sfx', nextVol);
    changeVolume('music', nextVol > 0 ? 0.3 : 0);
  };

  const isAudioOn = state.sfxVolume > 0;

  return (
    <ScreenWrapper className={`${activeTheme.bodyBg} transition-colors duration-500 overflow-x-hidden min-h-screen py-6 px-4`}>
      {/* Upper Navigation Bar */}
      <div className="w-full max-w-5xl flex justify-between items-center mb-4 select-none">
        
        {/* Game Title */}
        <h2 className={`text-xl font-bold tracking-wider m-0 ${activeTheme.fontHeading} bg-gradient-to-r ${activeTheme.titleGradient} bg-clip-text text-transparent`}>
          Snakes & Ladders
        </h2>

        {/* Buttons */}
        <div className="flex gap-2">
          <Button
            type="ghost"
            onClick={handleToggleMute}
            className="p-2 sm:px-3 rounded-lg text-xs"
            id="audio-toggle"
          >
            {isAudioOn ? <FaVolumeUp className="text-sm" /> : <FaVolumeMute className="text-sm text-red-400" />}
          </Button>
          <Button
            type="secondary"
            onClick={() => goToScreen('settings')}
            className="py-1.5 px-3 text-xs flex items-center gap-1.5"
            id="settings-btn"
          >
            <FaCog /> Settings
          </Button>
          <Button
            type="secondary"
            onClick={resetActiveGame}
            className="py-1.5 px-3 text-xs flex items-center gap-1.5"
            id="quit-btn"
          >
            <FaHome /> Leave
          </Button>
        </div>
      </div>

      {/* Main Screen Layout Grid */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Game Board (7 grid spans) */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <Board />
        </div>

        {/* Right Column: Dashboards & Dice Controls (5 grid spans) */}
        <div className="lg:col-span-5 flex flex-col gap-4 w-full h-full justify-start">
          
          {/* Turn Indicator Panel */}
          <Card className="p-4 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] uppercase font-bold opacity-60 tracking-wider">Active Turn</span>
              <h3 
                className="text-lg font-black tracking-tight mt-0.5" 
                style={{ color: activePlayer?.colorHex }}
              >
                {activePlayer?.name} {activePlayer?.isCpu && '🤖'}
              </h3>
            </div>
            
            {/* Pulsing Status Label */}
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                state.status === 'rolling' ? 'bg-amber-400 animate-ping' :
                state.status === 'moving' ? 'bg-indigo-400 animate-pulse' :
                'bg-emerald-400 animate-ping'
              }`} />
              <span className="text-xs uppercase font-bold tracking-wider">
                {state.status === 'rolling' ? 'Rolling...' :
                 state.status === 'moving' ? 'Moving...' :
                 state.status === 'snake_slide' ? 'Snake Slide!' :
                 state.status === 'ladder_climb' ? 'Ladder Climb!' :
                 'Roll Ready'}
              </span>
            </div>
          </Card>

          {/* Dice & Roller Control Board */}
          <Card className="flex flex-col items-center justify-center p-4">
            
            {/* The 3D Die Container */}
            <ThreeDDie
              value={state.diceValue}
              isRolling={state.status === 'rolling'}
              onClick={handleRollClick}
              disabled={!isHumanTurn || state.status !== 'playing'}
            />

            {/* Hint message */}
            <div className="text-center min-h-[2.5rem] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.p
                  key={state.status}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className={`text-xs sm:text-sm leading-snug font-medium max-w-[280px] ${activeTheme.fontBody}`}
                >
                  {state.status === 'rolling' && 'The dice is spinning in midair...'}
                  {state.status === 'moving' && 'Advancing token tile-by-tile...'}
                  {state.status === 'snake_slide' && 'Oh no! Sliding down a slippery snake...'}
                  {state.status === 'ladder_climb' && 'Incredible! Scaling up the ladder rungs!'}
                  {state.status === 'playing' && (
                    isHumanTurn 
                      ? 'Press SPACEBAR or TAP the die above to roll!' 
                      : 'Computer is evaluating its options...'
                  )}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Roll Button */}
            <Button
              type="primary"
              onClick={handleRollClick}
              disabled={!isHumanTurn || state.status !== 'playing'}
              className="mt-3 w-full max-w-[200px] py-2.5 text-sm"
              id="roll-button"
            >
              Roll Die
            </Button>
          </Card>

          {/* Player Cards/Power-ups Dashboard */}
          <Card className="flex flex-col gap-3 p-4">
            <div className="flex justify-between items-center border-b border-white/5 pb-1">
              <span className="text-xs font-bold text-white">🎒 Strategy Cards</span>
              {state.activePowerUp && (
                <span className="text-[10px] font-bold bg-fuchsia-600 text-white px-2 py-0.5 rounded-full animate-pulse">
                  ACTIVE: {state.activePowerUp.toUpperCase()}
                </span>
              )}
            </div>

            {/* Active player's power-ups list */}
            {activePlayer && (
              <div className="grid grid-cols-4 gap-2">
                {activePlayer.powerups.map((pu) => {
                  const isAvailable = pu.count > 0;
                  const isSelected = state.activePowerUp === pu.type;
                  const canUse = isHumanTurn && state.status === 'playing' && isAvailable && !state.activePowerUp;

                  return (
                    <button
                      key={pu.type}
                      disabled={!canUse || isSelected}
                      onClick={() => activatePowerUp(pu.type)}
                      className={`flex flex-col items-center p-2 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-fuchsia-600/30 border-fuchsia-500 scale-105 shadow-[0_0_10px_rgba(217,70,239,0.4)]' 
                          : canUse
                            ? 'bg-black/15 border-white/10 hover:bg-black/30 hover:border-white/20'
                            : 'bg-black/5 border-transparent opacity-40 cursor-not-allowed'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{pu.iconName}</span>
                      <span className="text-[10px] font-black text-white mt-1 leading-none">{pu.name}</span>
                      <span className="text-[9px] font-bold opacity-75 mt-0.5 bg-white/10 px-1.5 py-0.5 rounded-full leading-none">
                        {pu.count}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Game Event/History Logs */}
          <Card className="flex-1 p-4 flex flex-col min-h-[140px] max-h-[180px] lg:max-h-[220px]">
            <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-2 text-left border-b border-white/5 pb-1 select-none">
              <FaHistory /> Move History
            </span>

            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2 scrollbar-thin">
              {state.history.length === 0 ? (
                <p className="text-xs opacity-50 italic text-center py-4 select-none">No moves logged yet.</p>
              ) : (
                state.history.map((log) => {
                  let badgeColor = 'bg-white/10 text-white';
                  if (log.type === 'snake') badgeColor = 'bg-red-500/20 text-red-400 border border-red-500/30';
                  if (log.type === 'ladder') badgeColor = 'bg-green-500/20 text-green-400 border border-green-500/30';
                  if (log.type === 'powerup') badgeColor = 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30';

                  return (
                    <div 
                      key={log.id} 
                      className="flex gap-2 items-start text-[11px] leading-tight text-left"
                    >
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider select-none shrink-0 ${badgeColor}`}>
                        {log.type}
                      </span>
                      <p className="opacity-90 flex-1 min-w-0 break-words font-medium">
                        <span className="font-bold mr-1 text-white">{log.playerName}:</span>
                        {log.message}
                      </p>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

        </div>
      </div>
    </ScreenWrapper>
  );
};
export default GameScreen;
