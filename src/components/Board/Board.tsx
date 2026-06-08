import React from 'react';
import { useGame } from '../../context/GameContext';
import { THEME_CONFIGS } from '../../utils/themes';
import { SnakeLadderSVG } from './SnakeLadderSVG';
import { ParticleEffect } from '../UI/ParticleEffect';
import { Token } from '../Player/Token';
import { BOARD_CONFIG } from '../../data/board';

export const Board: React.FC = () => {
  const { state } = useGame();
  const activeTheme = THEME_CONFIGS[state.theme];

  // Generate grid rows from 9 (top) down to 0 (bottom)
  const rows = Array.from({ length: 10 }, (_, i) => 9 - i);
  const cols = Array.from({ length: 10 }, (_, i) => i);

  // Helper to determine cell number on the zig-zag board
  const getCellNumber = (row: number, col: number): number => {
    const isRowOdd = row % 2 !== 0;
    const base = row * 10;
    return isRowOdd ? base + (9 - col) + 1 : base + col + 1;
  };

  return (
    <div className={`relative w-full aspect-square max-w-[500px] sm:max-w-[550px] mx-auto select-none ${activeTheme.boardBorder} ${activeTheme.boardBg} overflow-hidden transition-all duration-500`}>
      {/* 10x10 Grid */}
      <div className="grid grid-cols-10 grid-rows-10 w-full h-full">
        {rows.map((row) =>
          cols.map((col) => {
            const cellNum = getCellNumber(row, col);
            const isEven = (row + col) % 2 === 0;
            const cellColorClass = isEven ? activeTheme.cellEven : activeTheme.cellOdd;

            // Check if cell has snake head/tail or ladder base/top
            const isSnakeHead = BOARD_CONFIG.snakes[cellNum] !== undefined;
            const isLadderBase = BOARD_CONFIG.ladders[cellNum] !== undefined;

            // Special cell marker colors
            let markerLabel = '';
            let markerClass = '';
            if (isSnakeHead) {
              markerLabel = '🐍';
              markerClass = 'text-xs text-red-500 font-bold';
            } else if (isLadderBase) {
              markerLabel = '🪜';
              markerClass = 'text-xs text-green-500 font-bold animate-pulse';
            } else if (cellNum === 100) {
              markerLabel = '🏆';
              markerClass = 'text-sm animate-bounce';
            }

            return (
              <div
                key={`${row}-${col}`}
                className={`relative border ${activeTheme.gridLine} ${cellColorClass} flex flex-col items-center justify-between p-1 transition-colors duration-500`}
              >
                {/* Cell Number */}
                <span className={`text-[10px] sm:text-xs leading-none self-start ${activeTheme.cellText}`}>
                  {cellNum}
                </span>

                {/* Snake/Ladder indicators inside cell */}
                {markerLabel && (
                  <span className={`leading-none pb-0.5 sm:pb-1 ${markerClass}`}>
                    {markerLabel}
                  </span>
                )}

                {/* Highlight cell when current turn player is on it */}
                {state.players.some(p => p.position === cellNum && state.status === 'playing') && (
                  <div className="absolute inset-0.5 border border-white/20 rounded-md bg-white/5 pointer-events-none" />
                )}
              </div>
            );
          })
        )}
      </div>

      {/* SVG Canvas for Snakes and Ladders */}
      <SnakeLadderSVG />

      {/* HTML5 Canvas for action particles */}
      <ParticleEffect />

      {/* Player Tokens */}
      {state.players.map((player) => (
        <Token key={player.id} player={player} />
      ))}
    </div>
  );
};
export default Board;
