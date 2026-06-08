import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../../context/GameContext';

interface DieProps {
  value: number;
  isRolling: boolean;
  onClick?: () => void;
  disabled?: boolean;
}

// Maps die face values to their corresponding 3D rotation angles
const FACE_ROTATIONS: { [key: number]: { x: number; y: number } } = {
  1: { x: 0, y: 0 },
  2: { x: 0, y: -90 },
  3: { x: -90, y: 0 },
  4: { x: 90, y: 0 },
  5: { x: 0, y: 90 },
  6: { x: 0, y: 180 },
};

// Dot positions on a 3x3 grid for each face of the die
const FACE_DOTS: { [key: number]: number[] } = {
  1: [4],
  2: [0, 8],
  3: [0, 4, 8],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8],
};

export const ThreeDDie: React.FC<DieProps> = ({ value, isRolling, onClick, disabled }) => {
  const { state } = useGame();
  const theme = state.theme;

  // Determine styles based on theme
  let dieColorClass = 'bg-[#f4ebd0] border-amber-950';
  let dotColorClass = 'bg-amber-950 shadow-inner';
  let glowClass = '';

  if (theme === 'neon') {
    dieColorClass = 'bg-slate-900 border-2 border-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.4)]';
    dotColorClass = 'bg-fuchsia-500 shadow-[0_0_5px_rgba(217,70,239,0.8)]';
    glowClass = isRolling ? 'shadow-[0_0_30px_rgba(6,182,212,0.8)] animate-pulse' : 'shadow-[0_0_15px_rgba(6,182,212,0.3)]';
  } else if (theme === 'space') {
    dieColorClass = 'bg-indigo-900 border border-indigo-400 shadow-lg';
    dotColorClass = 'bg-white shadow-[0_0_4px_rgba(255,255,255,0.8)]';
    glowClass = isRolling ? 'shadow-[0_0_25px_rgba(168,85,247,0.7)]' : '';
  } else if (theme === 'jungle') {
    dieColorClass = 'bg-emerald-800 border-2 border-amber-800';
    dotColorClass = 'bg-yellow-400';
    glowClass = isRolling ? 'shadow-[0_0_20px_rgba(250,204,21,0.6)]' : '';
  }

  // Get rotation for current value
  const rotation = FACE_ROTATIONS[value] || { x: 0, y: 0 };

  // Rolling animation: consistent tumbling with synchronized timing
  const ROLL_DURATION = 0.6; // Single consistent duration for all properties
  
  const currentAnimate = isRolling 
    ? {
        rotateX: [0, 180, 360, 540, 720],
        rotateY: [0, 90, 270, 450, 720],
        scale: [1, 1.15, 1, 1.15, 1],
        y: [0, -30, 0, -30, 0],
      }
    : {
        rotateX: rotation.x,
        rotateY: rotation.y,
        scale: 1,
        y: 0,
      };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* 3D Container with Perspective */}
      <div 
        className={`w-24 h-24 flex items-center justify-center relative cursor-pointer select-none rounded-xl transition-all duration-300 ${glowClass}`}
        style={{ perspective: '400px' }}
        onClick={!disabled && !isRolling ? onClick : undefined}
      >
        <motion.div
          className="w-16 h-16 relative transform-gpu"
          style={{ transformStyle: 'preserve-3d' }}
          animate={currentAnimate}
          transition={isRolling ? {
            rotateX: { repeat: Infinity, duration: ROLL_DURATION, ease: "linear" },
            rotateY: { repeat: Infinity, duration: ROLL_DURATION * 1.2, ease: "linear" },
            y: { repeat: Infinity, duration: ROLL_DURATION * 0.8, ease: "easeInOut" },
            scale: { repeat: Infinity, duration: ROLL_DURATION * 0.8, ease: "easeInOut" },
          } : {
            type: 'spring',
            stiffness: 200,
            damping: 20,
            mass: 0.8,
          }}
        >
          {/* Faces of the die */}
          {[1, 2, 3, 4, 5, 6].map((faceNum) => {
            let transformStyle = '';
            switch (faceNum) {
              case 1: transformStyle = 'rotateY(0deg) translateZ(2rem)'; break;
              case 2: transformStyle = 'rotateY(90deg) translateZ(2rem)'; break;
              case 3: transformStyle = 'rotateX(90deg) translateZ(2rem)'; break;
              case 4: transformStyle = 'rotateX(-90deg) translateZ(2rem)'; break;
              case 5: transformStyle = 'rotateY(-90deg) translateZ(2rem)'; break;
              case 6: transformStyle = 'rotateY(180deg) translateZ(2rem)'; break;
            }

            return (
              <div
                key={faceNum}
                className={`w-16 h-16 absolute rounded-lg border flex items-center justify-center backface-hidden ${dieColorClass}`}
                style={{
                  transform: transformStyle,
                  backfaceVisibility: 'hidden',
                  WebkitBackfaceVisibility: 'hidden',
                }}
              >
                {/* 3x3 Dot Grid */}
                <div className="w-12 h-12 grid grid-cols-3 grid-rows-3 gap-1 p-1">
                  {Array.from({ length: 9 }).map((_, dotIdx) => {
                    const hasDot = FACE_DOTS[faceNum].includes(dotIdx);
                    return (
                      <div key={dotIdx} className="flex items-center justify-center">
                        {hasDot && (
                          <div className={`w-2.5 h-2.5 rounded-full ${dotColorClass}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
