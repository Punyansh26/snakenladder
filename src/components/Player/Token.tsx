import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import type { Player } from '../../types/game';
import { getCellCenterCoords } from '../../utils/gameLogic';
import { useGame } from '../../context/GameContext';

interface TokenProps {
  player: Player;
}

export const Token: React.FC<TokenProps> = ({ player }) => {
  const { state } = useGame();
  const controls = useAnimation();

  // Get other players on the same cell to calculate offsets
  const sameCellPlayers = state.players.filter(p => p.position === player.position);
  const playerIndex = sameCellPlayers.findIndex(p => p.id === player.id);
  const siblingsCount = sameCellPlayers.length;

  const baseCoords = getCellCenterCoords(player.position);
  
  // Apply offset if multiple players share the tile
  let offsetX = 0;
  let offsetY = 0;
  
  if (siblingsCount > 1) {
    // Position tokens in a small circle around the center of the cell
    const angle = (playerIndex / siblingsCount) * 2 * Math.PI;
    const radius = 2.0; // percentage-based offset radius inside the cell
    offsetX = Math.cos(angle) * radius;
    offsetY = Math.sin(angle) * radius;
  }

  const coords = {
    x: baseCoords.x + offsetX,
    y: baseCoords.y + offsetY,
  };

  // Trigger bounce/hop animation when position changes
  useEffect(() => {
    // Skip hopping animation on initial game setup
    if (player.position === 1 && state.status === 'setup') return;

    controls.start({
      y: [0, -25, 0],
      scale: [1, 1.25, 1],
      transition: {
        duration: 0.25 / state.animationSpeed,
        ease: 'easeInOut',
      },
    });
  }, [player.position, controls, state.animationSpeed, state.status]);

  const isCurrentTurn = state.currentTurn === player.id && state.status === 'playing';

  // Theme-specific styles
  const colorMap = {
    red: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      border: 'border-red-300 shadow-[0_0_8px_rgba(239,68,68,0.5)]',
      glow: 'shadow-[0_0_15px_rgba(244,63,94,0.8)] border-red-400',
    },
    blue: {
      bg: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      border: 'border-blue-300 shadow-[0_0_8px_rgba(59,130,246,0.5)]',
      glow: 'shadow-[0_0_15px_rgba(99,102,241,0.8)] border-blue-400',
    },
    green: {
      bg: 'bg-gradient-to-r from-emerald-500 to-teal-600',
      border: 'border-emerald-300 shadow-[0_0_8px_rgba(16,185,129,0.5)]',
      glow: 'shadow-[0_0_15px_rgba(20,184,166,0.8)] border-emerald-400',
    },
  };

  const style = colorMap[player.color];

  return (
    <motion.div
      className="absolute z-20 pointer-events-none select-none"
      style={{
        left: `${coords.x}%`,
        top: `${coords.y}%`,
        x: '-50%',
        y: '-50%',
        width: '3.6%',
        height: '3.6%',
      }}
      animate={{
        left: `${coords.x}%`,
        top: `${coords.y}%`,
      }}
      transition={{
        type: 'spring',
        stiffness: 120,
        damping: 14,
      }}
    >
      {/* Elevated Token with Shadow */}
      <motion.div
        animate={controls}
        className={`w-full h-full rounded-full flex items-center justify-center border-2 ${
          isCurrentTurn ? style.glow : style.border
        } ${style.bg} relative transition-shadow duration-300`}
      >
        {/* Shadow base on board */}
        <div className="absolute -bottom-1 w-[80%] h-1 bg-black/30 rounded-full blur-[1px] -z-10" />

        {/* Inner core styling */}
        <div className="w-[45%] h-[45%] rounded-full bg-white/45 animate-pulse" />

        {/* Turn indicator pulse circle */}
        {isCurrentTurn && (
          <span className="absolute -inset-2.5 rounded-full border border-white/40 animate-ping opacity-45" />
        )}
      </motion.div>
    </motion.div>
  );
};
