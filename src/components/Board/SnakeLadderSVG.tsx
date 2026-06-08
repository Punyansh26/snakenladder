import React from 'react';
import { BOARD_CONFIG } from '../../data/board';
import { getCellCenterCoords } from '../../utils/gameLogic';
import { THEME_CONFIGS } from '../../utils/themes';
import { useGame } from '../../context/GameContext';

export const SnakeLadderSVG: React.FC = () => {
  const { state } = useGame();
  const activeTheme = THEME_CONFIGS[state.theme];

  // Helper to draw a wavy snake body
  const renderSnake = (from: number, to: number, id: string) => {
    const start = getCellCenterCoords(from); // Head
    const end = getCellCenterCoords(to); // Tail

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Perpendicular vector for wave offset
    const px = -dy / len;
    const py = dx / len;

    // Control points to create a winding snake body
    const waveAmp = Math.min(10, len * 0.15); // Adjust wave height based on length
    const cp1x = start.x + dx * 0.25 + px * waveAmp;
    const cp1y = start.y + dy * 0.25 + py * waveAmp;
    const cp2x = start.x + dx * 0.75 - px * waveAmp;
    const cp2y = start.y + dy * 0.75 - py * waveAmp;

    const bodyPath = `M ${start.x} ${start.y} C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${end.x} ${end.y}`;

    // Angle of head direction for eyes/tongue
    const headAngle = Math.atan2(cp1y - start.y, cp1x - start.x) * (180 / Math.PI);

    return (
      <g key={`snake-${id}`} className="transition-all duration-500">
        {/* Shadow/Glow (larger stroke behind) */}
        <path
          d={bodyPath}
          fill="none"
          stroke={state.theme === 'neon' ? activeTheme.svgConfig.snakeColor : 'rgba(0,0,0,0.15)'}
          strokeWidth={state.theme === 'neon' ? 6 : 4}
          strokeLinecap="round"
          className={state.theme === 'neon' ? 'opacity-40 blur-[3px]' : 'opacity-30'}
        />

        {/* Outer Snake Body */}
        <path
          d={bodyPath}
          fill="none"
          stroke={activeTheme.svgConfig.snakeColor}
          strokeWidth={3}
          strokeLinecap="round"
          strokeDasharray={state.theme === 'space' ? '6 3' : undefined} // Scaley look in space
        />

        {/* Inner Snake Stripe */}
        <path
          d={bodyPath}
          fill="none"
          stroke={activeTheme.svgConfig.snakeHeadColor}
          strokeWidth={1}
          strokeLinecap="round"
          className="opacity-70"
        />

        {/* Snake Head */}
        <g transform={`translate(${start.x}, ${start.y}) rotate(${headAngle})`}>
          {/* Tongue */}
          <path
            d="M 0 0 L 5 -2 M 0 0 L 5 2"
            stroke="#ef4444"
            strokeWidth={1}
            fill="none"
          />
          {/* Head Shape */}
          <ellipse
            cx="0"
            cy="0"
            rx="3.5"
            ry="2.5"
            fill={activeTheme.svgConfig.snakeHeadColor}
            stroke={activeTheme.svgConfig.snakeColor}
            strokeWidth={0.5}
          />
          {/* Glowing Eyes */}
          <circle cx="1.5" cy="-1" r="0.6" fill={state.theme === 'neon' ? '#39ff14' : '#ffffff'} />
          <circle cx="1.5" cy="1" r="0.6" fill={state.theme === 'neon' ? '#39ff14' : '#ffffff'} />
        </g>

        {/* Snake Tail */}
        <circle
          cx={end.x}
          cy={end.y}
          r="1.2"
          fill={activeTheme.svgConfig.snakeColor}
        />
      </g>
    );
  };

  // Helper to draw a detailed ladder
  const renderLadder = (from: number, to: number, id: string) => {
    const start = getCellCenterCoords(from); // Base
    const end = getCellCenterCoords(to); // Top

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.sqrt(dx * dx + dy * dy);

    // Unit perpendicular vector to offset left/right rails
    const railOffset = 2.2; // Distance between rails in percentage
    const px = (-dy / len) * railOffset;
    const py = (dx / len) * railOffset;

    // Rails coordinates
    const rail1Start = { x: start.x + px, y: start.y + py };
    const rail1End = { x: end.x + px, y: end.y + py };
    const rail2Start = { x: start.x - px, y: start.y - py };
    const rail2End = { x: end.x - px, y: end.y - py };

    // Calculate rungs
    const rungCount = Math.max(3, Math.floor(len / 8));
    const rungs = [];

    for (let i = 1; i < rungCount; i++) {
      const t = i / rungCount;
      const r1 = {
        x: rail1Start.x + (rail1End.x - rail1Start.x) * t,
        y: rail1Start.y + (rail1End.y - rail1Start.y) * t,
      };
      const r2 = {
        x: rail2Start.x + (rail2End.x - rail2Start.x) * t,
        y: rail2Start.y + (rail2End.y - rail2Start.y) * t,
      };
      rungs.push({ r1, r2 });
    }

    return (
      <g key={`ladder-${id}`} className="transition-all duration-500">
        {/* Glow behind ladder for Neon Theme */}
        {state.theme === 'neon' && (
          <g className="opacity-30 blur-[4px]">
            <line x1={rail1Start.x} y1={rail1Start.y} x2={rail1End.x} y2={rail1End.y} stroke={activeTheme.svgConfig.ladderColor} strokeWidth={5} />
            <line x1={rail2Start.x} y1={rail2Start.y} x2={rail2End.x} y2={rail2End.y} stroke={activeTheme.svgConfig.ladderColor} strokeWidth={5} />
          </g>
        )}

        {/* Left and Right Rails */}
        <line
          x1={rail1Start.x}
          y1={rail1Start.y}
          x2={rail1End.x}
          y2={rail1End.y}
          stroke={activeTheme.svgConfig.ladderColor}
          strokeWidth={1.8}
          strokeLinecap="round"
        />
        <line
          x1={rail2Start.x}
          y1={rail2Start.y}
          x2={rail2End.x}
          y2={rail2End.y}
          stroke={activeTheme.svgConfig.ladderColor}
          strokeWidth={1.8}
          strokeLinecap="round"
        />

        {/* Rungs */}
        {rungs.map((rung, index) => (
          <line
            key={index}
            x1={rung.r1.x}
            y1={rung.r1.y}
            x2={rung.r2.x}
            y2={rung.r2.y}
            stroke={activeTheme.svgConfig.ladderRungColor}
            strokeWidth={1.2}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  };

  return (
    <svg 
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-10"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glowing marker definitions can be placed here if needed */}
      </defs>

      {/* Render all ladders */}
      {Object.entries(BOARD_CONFIG.ladders).map(([from, to]) => 
        renderLadder(Number(from), Number(to), `${from}-${to}`)
      )}

      {/* Render all snakes */}
      {Object.entries(BOARD_CONFIG.snakes).map(([from, to]) => 
        renderSnake(Number(from), Number(to), `${from}-${to}`)
      )}
    </svg>
  );
};
