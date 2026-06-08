import React, { useEffect, useRef, useCallback } from 'react';
import { useGame } from '../../context/GameContext';
import { getCellCenterCoords } from '../../utils/gameLogic';
import confetti from 'canvas-confetti';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  maxLife: number;
  shape: 'circle' | 'star' | 'square';
}

export const ParticleEffect: React.FC = () => {
  const { state } = useGame();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const lastStateRef = useRef({
    positions: {} as { [id: string]: number },
    status: state.status,
  });

  // Confetti trigger for win celebration
  useEffect(() => {
    if (state.status === 'finished' && state.winnerId) {
      // Launch continuous confetti
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 50 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        // Confetti from two sides
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } 
        }));
        confetti(Object.assign({}, defaults, { 
          particleCount, 
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } 
        }));
      }, 250);

      return () => clearInterval(interval);
    }
  }, [state.status, state.winnerId]);

  // Canvas-based board particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Resize canvas to match board sizing
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const particles = particlesRef.current;

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        // Apply light gravity to some shapes
        if (p.shape === 'square') p.vy += 0.05; 
        
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
        p.life++;

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;

        if (p.shape === 'star') {
          // Draw a small 4-point star/sparkle
          ctx.beginPath();
          ctx.moveTo(p.x, p.y - p.size);
          ctx.lineTo(p.x + p.size * 0.3, p.y - p.size * 0.3);
          ctx.lineTo(p.x + p.size, p.y);
          ctx.lineTo(p.x + p.size * 0.3, p.y + p.size * 0.3);
          ctx.lineTo(p.x, p.y + p.size);
          ctx.lineTo(p.x - p.size * 0.3, p.y + p.size * 0.3);
          ctx.lineTo(p.x - p.size, p.y);
          ctx.lineTo(p.x - p.size * 0.3, p.y - p.size * 0.3);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Helper to spawn a burst of particles on a cell position
  const spawnBurst = useCallback((cell: number, type: 'ladder' | 'snake' | 'glow') => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const baseCoords = getCellCenterCoords(cell);
    // Convert percentage coordinates to canvas pixels
    const pxX = (baseCoords.x / 100) * canvas.width;
    const pxY = (baseCoords.y / 100) * canvas.height;

    const particles = particlesRef.current;
    const count = type === 'snake' ? 30 : 40;

    let colors = ['#f59e0b', '#fbbf24', '#fef08a', '#ffffff']; // Gold/Yellow (ladder)
    if (type === 'snake') {
      colors = ['#ef4444', '#dc2626', '#b91c1c', '#f87171']; // Red (snake)
    } else if (type === 'glow') {
      colors = state.theme === 'neon' 
        ? ['#06b6d4', '#ec4899', '#a855f7', '#ffffff'] // Neon colors
        : ['#6366f1', '#8b5cf6', '#a855f7', '#ffffff']; // Space/Default colors
    }

    const shape = type === 'ladder' ? 'star' : 'circle';

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 3.5 + 1;
      particles.push({
        x: pxX,
        y: pxY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (type === 'ladder' ? 1.5 : 0), // drift up for ladders
        size: Math.random() * 4 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        life: 0,
        maxLife: Math.floor(Math.random() * 25) + 20,
        shape: shape as 'circle' | 'star' | 'square',
      });
    }
  }, [state.theme]);

  // Watch for state triggers to spawn particles
  useEffect(() => {
    const currentPositions = state.players.reduce((acc, p) => {
      acc[p.id] = p.position;
      return acc;
    }, {} as { [id: string]: number });

    const prevPositions = lastStateRef.current.positions;
    const prevStatus = lastStateRef.current.status;

    // Check if any player climbed a ladder
    if (state.status === 'ladder_climb' && prevStatus !== 'ladder_climb') {
      // Find who is climbing
      const activePlayer = state.players.find(p => p.id === state.currentTurn);
      if (activePlayer) {
        spawnBurst(activePlayer.position, 'ladder');
      }
    }

    // Check if any player slid down a snake
    if (state.status === 'snake_slide' && prevStatus !== 'snake_slide') {
      const activePlayer = state.players.find(p => p.id === state.currentTurn);
      if (activePlayer) {
        spawnBurst(activePlayer.position, 'snake');
      }
    }

    // Spawn a light spark when players land on standard tiles
    state.players.forEach(p => {
      const prevPos = prevPositions[p.id];
      if (prevPos !== undefined && prevPos !== p.position && state.status === 'playing') {
        spawnBurst(p.position, 'glow');
      }
    });

    // Save previous state values
    lastStateRef.current = {
      positions: currentPositions,
      status: state.status,
    };
  }, [state.players, state.status, state.currentTurn, spawnBurst]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none z-30"
    />
  );
};
