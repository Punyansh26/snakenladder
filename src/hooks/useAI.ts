import { useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { calculateAIMove } from '../ai/aiEngine';

export const useAI = () => {
  const { state, rollDice, activatePowerUp } = useGame();
  const aiThinkingRef = useRef<boolean>(false);

  useEffect(() => {
    const activePlayer = state.players.find(p => p.id === state.currentTurn);
    
    // Check if it's CPU's turn and the game is active
    if (
      activePlayer && 
      activePlayer.isCpu && 
      state.status === 'playing' && 
      state.screen === 'game' &&
      !state.winnerId &&
      !aiThinkingRef.current
    ) {
      aiThinkingRef.current = true;
      
      const executeCPUTurn = async () => {
        // 1. Brief pause to make CPU feel like it is "thinking"
        const thinkDelay = 1200 / state.animationSpeed;
        await new Promise(resolve => setTimeout(resolve, thinkDelay));

        // Ensure state hasn't changed during the delay
        const currentActive = state.players.find(p => p.id === state.currentTurn);
        if (!currentActive || !currentActive.isCpu || state.status !== 'playing') {
          aiThinkingRef.current = false;
          return;
        }

        // 2. Decide and play power-up (if Strategy Mode is active or by default)
        const decision = calculateAIMove(currentActive, state);
        
        if (decision.powerupToUse) {
          activatePowerUp(decision.powerupToUse);
          // Small pause after playing a powerup for visual clarity
          await new Promise(resolve => setTimeout(resolve, 800 / state.animationSpeed));
        }

        // 3. Roll the dice
        try {
          await rollDice();
        } catch (e) {
          console.error("AI failed to roll", e);
        } finally {
          aiThinkingRef.current = false;
        }
      };

      executeCPUTurn();
    }
  }, [state, rollDice, activatePowerUp]);
};
