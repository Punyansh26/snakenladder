import type { GameState, Player, PowerUpType } from '../types/game';
import { checkSnakeOrLadder } from '../utils/gameLogic';

// Dynamic Programming Value Map
// valueMap[cell] = expected turns to reach 100 (lower is better, 0 is victory)
let expectedTurnsMap: number[] = new Array(101).fill(0);

/**
 * Precomputes the expected turns to reach 100 from every cell on the board
 * using value iteration. Runs once to power Hard and Impossible AIs.
 */
export function precomputeBoardValues() {
  const V = new Array(101).fill(50); // Initial guess: 50 turns
  V[100] = 0; // 0 turns to reach 100

  // 100 iterations is more than enough for a 100-state acyclic-ish Markov Chain to converge
  for (let iter = 0; iter < 150; iter++) {
    for (let i = 1; i < 100; i++) {
      let sum = 0;
      for (let roll = 1; roll <= 6; roll++) {
        let nextPos = i + roll;
        if (nextPos > 100) {
          nextPos = i; // Overshoot rule: stay in place
        }
        
        // Resolve snakes and ladders
        const landing = checkSnakeOrLadder(nextPos);
        const resolvedPos = landing.destination;
        
        sum += V[resolvedPos];
      }
      V[i] = 1 + sum / 6;
    }
  }
  expectedTurnsMap = V;
}

// Perform precomputation immediately
precomputeBoardValues();

/**
 * Returns a score for landing on a cell. Higher is better.
 * We base this on the precomputed expected turns to win.
 */
export function evaluatePosition(cell: number): number {
  if (cell >= 100) return 1000;
  // Score = 100 - expected turns to win (so fewer expected turns = higher score)
  return 150 - expectedTurnsMap[cell];
}

/**
 * Calculates the best choice of action/power-up for the CPU.
 */
export function calculateAIMove(
  cpu: Player,
  gameState: GameState
): { powerupToUse: PowerUpType | null } {
  const currentPos = cpu.position;
  const difficulty = gameState.difficulty;

  // Easy AI: 100% random. 90% rolls normally, 10% plays a random available power-up.
  if (difficulty === 'easy') {
    if (Math.random() < 0.15) {
      const available = cpu.powerups.filter(pu => pu.count > 0);
      if (available.length > 0) {
        const randomPu = available[Math.floor(Math.random() * available.length)];
        return { powerupToUse: randomPu.type };
      }
    }
    return { powerupToUse: null };
  }

  // Medium AI: Simple heuristics
  if (difficulty === 'medium') {
    // Check if there is a snake head nearby (within 6 tiles)
    let snakeHeadInFront = false;
    let nearestSnakeDist = 0;
    
    for (let r = 1; r <= 6; r++) {
      const landing = checkSnakeOrLadder(currentPos + r);
      if (landing.type === 'snake') {
        snakeHeadInFront = true;
        nearestSnakeDist = r;
        break;
      }
    }

    // Heuristic 1: If there is a snake head and we have a shield, use it
    const shieldCount = cpu.powerups.find(pu => pu.type === 'shield')?.count || 0;
    if (snakeHeadInFront && shieldCount > 0) {
      // 50% chance to play shield to be safe
      if (Math.random() < 0.5) {
        return { powerupToUse: 'shield' };
      }
    }

    // Heuristic 2: If a snake is exactly 4, 5, or 6 steps away and we have a "Safe" card (rolls 1-3), use it to avoid landing on it.
    const safeCount = cpu.powerups.find(pu => pu.type === 'safe')?.count || 0;
    if (snakeHeadInFront && nearestSnakeDist >= 4 && safeCount > 0) {
      return { powerupToUse: 'safe' };
    }

    // Heuristic 3: If there's a ladder base exactly 3, 4, 5, 6 steps away and we have a Boost card, use it to leap or climb.
    for (let r = 1; r <= 6; r++) {
      const landing = checkSnakeOrLadder(currentPos + r);
      if (landing.type === 'ladder') {
        const boostCount = cpu.powerups.find(pu => pu.type === 'boost')?.count || 0;
        if (boostCount > 0 && Math.random() < 0.6) {
          return { powerupToUse: 'boost' };
        }
      }
    }

    return { powerupToUse: null };
  }

  // Hard & Impossible AI: Expected Value Optimization
  // We compute the Expected Value (score) for each possible choice:
  // 1. Standard Roll (1-6)
  // 2. Safe Roll (1-3) - if available
  // 3. Boost Roll (3-8, i.e., 1-6 + 2) - if available
  // 4. Standard Roll + Shield (protects against snakes in that turn) - if available

  const hasShield = (cpu.powerups.find(pu => pu.type === 'shield')?.count || 0) > 0;
  const hasSafe = (cpu.powerups.find(pu => pu.type === 'safe')?.count || 0) > 0;
  const hasBoost = (cpu.powerups.find(pu => pu.type === 'boost')?.count || 0) > 0;

  // Option 1: Standard Roll
  let standardEV = 0;
  for (let r = 1; r <= 6; r++) {
    let next = currentPos + r;
    if (next > 100) next = currentPos;
    const landing = checkSnakeOrLadder(next);
    standardEV += evaluatePosition(landing.destination);
  }
  standardEV /= 6;

  let bestEV = standardEV;
  let bestChoice: PowerUpType | null = null;

  // Option 2: Safe Roll (1-3)
  if (hasSafe) {
    let safeEV = 0;
    for (let r = 1; r <= 3; r++) {
      let next = currentPos + r;
      if (next > 100) next = currentPos;
      const landing = checkSnakeOrLadder(next);
      safeEV += evaluatePosition(landing.destination);
    }
    safeEV /= 3;

    // We add a slight penalty to safe roll for Hard AI so it doesn't hoard/waste it unless it's very useful.
    const threshold = difficulty === 'impossible' ? 0.5 : 2.0;
    if (safeEV > bestEV + threshold) {
      bestEV = safeEV;
      bestChoice = 'safe';
    }
  }

  // Option 3: Boost Roll (Standard + 2)
  if (hasBoost) {
    let boostEV = 0;
    for (let r = 1; r <= 6; r++) {
      let next = currentPos + r + 2;
      if (next > 100) next = currentPos;
      const landing = checkSnakeOrLadder(next);
      boostEV += evaluatePosition(landing.destination);
    }
    boostEV /= 6;

    const threshold = difficulty === 'impossible' ? 0.5 : 2.0;
    if (boostEV > bestEV + threshold) {
      bestEV = boostEV;
      bestChoice = 'boost';
    }
  }

  // Option 4: Shield (Standard roll, but if we hit a snake, we don't slide)
  if (hasShield) {
    let shieldEV = 0;
    let snakeSpotted = false;
    for (let r = 1; r <= 6; r++) {
      let next = currentPos + r;
      if (next > 100) next = currentPos;
      const landing = checkSnakeOrLadder(next);
      if (landing.type === 'snake') {
        snakeSpotted = true;
        // Shield blocks slide, so we evaluate the snake head position rather than tail
        shieldEV += evaluatePosition(next);
      } else {
        shieldEV += evaluatePosition(landing.destination);
      }
    }
    shieldEV /= 6;

    // Only use shield if there actually is a snake we might hit!
    if (snakeSpotted) {
      const threshold = difficulty === 'impossible' ? 0.2 : 1.5;
      if (shieldEV > bestEV + threshold) {
        bestChoice = 'shield';
      }
    }
  }

  // Hard AI occasionally makes sub-optimal choices (adds 15% random noise)
  if (difficulty === 'hard' && Math.random() < 0.15) {
    return { powerupToUse: null };
  }

  return { powerupToUse: bestChoice };
}

/**
 * Decides whether the CPU should use a Reroll power-up after landing on a bad tile
 * (e.g. slid down a snake, or rolled a 1 when they needed a high number).
 */
export function shouldCPUReroll(
  cpu: Player,
  rollResult: number,
  newPos: number,
  landedOnSnake: boolean,
  gameState: GameState
): boolean {
  const hasReroll = (cpu.powerups.find(pu => pu.type === 'reroll')?.count || 0) > 0;
  if (!hasReroll || gameState.status === 'finished') return false;

  const difficulty = gameState.difficulty;

  // Easy AI: 20% chance to reroll if it landed on a snake, otherwise never
  if (difficulty === 'easy') {
    return landedOnSnake && Math.random() < 0.2;
  }

  // Medium AI: Rerolls if it landed on a snake, or if it rolled a 1/2 and is far behind
  if (difficulty === 'medium') {
    if (landedOnSnake) return true;
    
    // If we are far behind player 1 and rolled a small number
    const p1 = gameState.players.find(p => p.id === 'p1')!;
    if (p1.position - cpu.position > 25 && rollResult <= 2) {
      return Math.random() < 0.5;
    }
    return false;
  }

  // Hard & Impossible AI: Compare current EV vs Expected EV of a fresh roll
  const currentEV = evaluatePosition(newPos);
  
  // Calculate expected EV of standard roll
  let standardEV = 0;
  for (let r = 1; r <= 6; r++) {
    let next = cpu.position + r; // note: cpu.position is the position *before* this roll
    if (next > 100) next = cpu.position;
    const landing = checkSnakeOrLadder(next);
    standardEV += evaluatePosition(landing.destination);
  }
  standardEV /= 6;

  // Reroll if the new EV is significantly worse than expected EV of standard roll
  const threshold = difficulty === 'impossible' ? 2 : 5;
  if (standardEV > currentEV + threshold) {
    return true;
  }

  return false;
}
