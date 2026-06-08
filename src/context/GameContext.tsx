/* eslint-disable react-hooks/exhaustive-deps, react-hooks/purity, react-hooks/immutability, react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { 
  GameState, Player, PowerUpType, ScreenType, Difficulty, 
  ThemeType, GameHistoryEntry, Achievement, GameMode 
} from '../types/game';
import { checkSnakeOrLadder, getMovePath } from '../utils/gameLogic';
import { audioSynth } from '../utils/audioSynth';

interface GameContextProps {
  state: GameState;
  startGame: (mode: GameMode, difficulty: Difficulty) => void;
  rollDice: () => Promise<void>;
  activatePowerUp: (type: PowerUpType) => void;
  changeTheme: (theme: ThemeType) => void;
  changeVolume: (type: 'music' | 'sfx', volume: number) => void;
  changeAnimationSpeed: (speed: number) => void;
  resetGameProgress: () => void;
  resetActiveGame: () => void;
  goToScreen: (screen: ScreenType) => void;
  unmuteSynth: () => void;
}

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'snake_survivor', title: 'Snake Survivor', description: 'Blocked a snake slide using a Shield', icon: '🛡️', unlocked: false },
  { id: 'ladder_master', title: 'Ladder Master', description: 'Climbed 3 ladders in a single game', icon: '🪜', unlocked: false },
  { id: 'lucky_roller', title: 'Lucky Roller', description: 'Rolled three 6s in a single game', icon: '🎲', unlocked: false },
  { id: 'unstoppable', title: 'Unstoppable', description: 'Won a game in under 15 turns', icon: '⚡', unlocked: false },
  { id: 'ai_crusher', title: 'AI Crusher', description: 'Beat the Impossible AI in a match', icon: '🧠', unlocked: false },
];

const INITIAL_STATE: GameState = {
  screen: 'home',
  mode: 'PvC',
  players: [],
  currentTurn: '',
  status: 'setup',
  diceValue: 1,
  diceTypeUsed: 'standard',
  activePowerUp: null,
  difficulty: 'easy',
  theme: 'classic',
  musicVolume: 0.3,
  sfxVolume: 0.5,
  animationSpeed: 1,
  history: [],
  winnerId: null,
  stats: {
    turns: 0,
    snakesLanded: {},
    laddersClimbed: {},
    sixesRolled: {},
    powerupsUsed: {},
    startTime: 0,
    endTime: null
  },
  achievements: DEFAULT_ACHIEVEMENTS,
  matchHistory: []
};

const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<GameState>(() => {
    const saved = localStorage.getItem('snakes-ladders-save');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved state', e);
      }
    }
    return INITIAL_STATE;
  });
  const isMovingRef = useRef(false);

  // Sync volume on mount
  useEffect(() => {
    audioSynth.setMusicVolume(state.musicVolume);
    audioSynth.setSfxVolume(state.sfxVolume);
  }, []);

  // Save state whenever it changes
  useEffect(() => {
    if (state.status !== 'setup') {
      localStorage.setItem('snakes-ladders-save', JSON.stringify(state));
    }
  }, [state]);

  // Audio start/stop based on page
  useEffect(() => {
    if (state.screen === 'game' && state.status === 'playing') {
      audioSynth.startMusic();
    } else if (state.screen === 'home') {
      audioSynth.startMusic();
    } else if (state.screen === 'winner') {
      audioSynth.stopMusic();
    }
  }, [state.screen]);

  const unmuteSynth = () => {
    audioSynth.toggleMute(false);
  };

  const addLog = (
    history: GameHistoryEntry[], 
    playerId: string, 
    playerName: string, 
    message: string, 
    type: GameHistoryEntry['type']
  ): GameHistoryEntry[] => {
    const entry: GameHistoryEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: Date.now(),
      playerId,
      playerName,
      message,
      type
    };
    return [entry, ...history].slice(0, 50); // Keep last 50 logs
  };

  const unlockAchievement = (id: string) => {
    setState(prev => {
      const achievements = prev.achievements.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          audioSynth.playVictory(); // Play a nice sound on achievement
          return { ...ach, unlocked: true, unlockedAt: Date.now() };
        }
        return ach;
      });
      return { ...prev, achievements };
    });
  };

  const goToScreen = (screen: ScreenType) => {
    audioSynth.playClick();
    setState(prev => ({ ...prev, screen }));
  };

  const changeTheme = (theme: ThemeType) => {
    audioSynth.playClick();
    setState(prev => ({ ...prev, theme }));
  };

  const changeVolume = (type: 'music' | 'sfx', volume: number) => {
    if (type === 'music') {
      audioSynth.setMusicVolume(volume);
      setState(prev => ({ ...prev, musicVolume: volume }));
    } else {
      audioSynth.setSfxVolume(volume);
      setState(prev => ({ ...prev, sfxVolume: volume }));
    }
  };

  const changeAnimationSpeed = (speed: number) => {
    audioSynth.playClick();
    setState(prev => ({ ...prev, animationSpeed: speed }));
  };

  const resetGameProgress = () => {
    audioSynth.playClick();
    audioSynth.stopMusic();
    localStorage.removeItem('snakes-ladders-save');
    setState({
      ...INITIAL_STATE,
      achievements: DEFAULT_ACHIEVEMENTS,
      matchHistory: []
    });
  };

  const resetActiveGame = () => {
    audioSynth.playClick();
    audioSynth.stopMusic();
    localStorage.removeItem('snakes-ladders-save');
    setState(prev => ({
      ...prev,
      screen: 'home',
      status: 'setup',
      players: [],
      currentTurn: '',
      winnerId: null,
      stats: {
        turns: 0,
        snakesLanded: {},
        laddersClimbed: {},
        sixesRolled: {},
        powerupsUsed: {},
        startTime: 0,
        endTime: null
      }
    }));
  };

  const startGame = (mode: GameMode, difficulty: Difficulty) => {
    audioSynth.playClick();
    
    const p1: Player = {
      id: 'p1',
      name: 'Player 1',
      color: 'red',
      position: 1,
      previousPosition: 1,
      isHuman: true,
      isCpu: false,
      colorHex: '#ef4444',
      powerups: [
        { type: 'shield', count: 1, name: 'Shield', description: 'Blocks the next snake slide', iconName: '🛡️' },
        { type: 'reroll', count: 1, name: 'Reroll', description: 'Rerolls the dice once', iconName: '🔄' },
        { type: 'boost', count: 1, name: 'Boost', description: 'Adds +2 to your roll', iconName: '⚡' },
        { type: 'safe', count: 1, name: 'Safe Roll', description: 'Limits roll to 1-3 to avoid snakes', iconName: '🟢' },
      ]
    };

    const p2: Player = mode === 'PvP' ? {
      id: 'p2',
      name: 'Player 2',
      color: 'blue',
      position: 1,
      previousPosition: 1,
      isHuman: true,
      isCpu: false,
      colorHex: '#3b82f6',
      powerups: [
        { type: 'shield', count: 1, name: 'Shield', description: 'Blocks the next snake slide', iconName: '🛡️' },
        { type: 'reroll', count: 1, name: 'Reroll', description: 'Rerolls the dice once', iconName: '🔄' },
        { type: 'boost', count: 1, name: 'Boost', description: 'Adds +2 to your roll', iconName: '⚡' },
        { type: 'safe', count: 1, name: 'Safe Roll', description: 'Limits roll to 1-3 to avoid snakes', iconName: '🟢' },
      ]
    } : {
      id: 'cpu',
      name: `CPU (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`,
      color: 'green',
      position: 1,
      previousPosition: 1,
      isHuman: false,
      isCpu: true,
      colorHex: '#10b981',
      powerups: [
        { type: 'shield', count: 1, name: 'Shield', description: 'Blocks the next snake slide', iconName: '🛡️' },
        { type: 'reroll', count: 1, name: 'Reroll', description: 'Rerolls the dice once', iconName: '🔄' },
        { type: 'boost', count: 1, name: 'Boost', description: 'Adds +2 to your roll', iconName: '⚡' },
        { type: 'safe', count: 1, name: 'Safe Roll', description: 'Limits roll to 1-3 to avoid snakes', iconName: '🟢' },
      ]
    };

    const initialHistory = addLog([], 'system', 'Game', `Match started! Mode: ${mode} (${mode === 'PvC' ? difficulty : 'Local'})`, 'info');

    setState(prev => ({
      ...prev,
      screen: 'game',
      mode,
      difficulty,
      players: [p1, p2],
      currentTurn: p1.id,
      status: 'playing',
      diceValue: 1,
      diceTypeUsed: 'standard',
      activePowerUp: null,
      winnerId: null,
      history: initialHistory,
      stats: {
        turns: 0,
        snakesLanded: { p1: 0, p2: 0, cpu: 0 },
        laddersClimbed: { p1: 0, p2: 0, cpu: 0 },
        sixesRolled: { p1: 0, p2: 0, cpu: 0 },
        powerupsUsed: { p1: 0, p2: 0, cpu: 0 },
        startTime: Date.now(),
        endTime: null
      }
    }));
  };

  const activatePowerUp = (type: PowerUpType) => {
    setState(prev => {
      const currentPlayer = prev.players.find(p => p.id === prev.currentTurn);
      if (!currentPlayer || prev.status !== 'playing') return prev;

      const powerup = currentPlayer.powerups.find(pu => pu.type === type);
      if (!powerup || powerup.count <= 0) return prev;

      // Update player powerups
      const updatedPlayers = prev.players.map(p => {
        if (p.id === prev.currentTurn) {
          return {
            ...p,
            powerups: p.powerups.map(pu => pu.type === type ? { ...pu, count: pu.count - 1 } : pu)
          };
        }
        return p;
      });

      // Update statistics
      const updatedStats = {
        ...prev.stats,
        powerupsUsed: {
          ...prev.stats.powerupsUsed,
          [prev.currentTurn]: (prev.stats.powerupsUsed[prev.currentTurn] || 0) + 1
        }
      };

      const logMsg = `${currentPlayer.name} activated power-up: ${powerup.name}`;
      const updatedHistory = addLog(prev.history, currentPlayer.id, currentPlayer.name, logMsg, 'powerup');

      return {
        ...prev,
        players: updatedPlayers,
        activePowerUp: type,
        stats: updatedStats,
        history: updatedHistory
      };
    });
  };

  const rollDice = async (): Promise<void> => {
    if (isMovingRef.current || state.status !== 'playing') return;
    isMovingRef.current = true;

    setState(prev => ({ ...prev, status: 'rolling' }));
    audioSynth.playDiceRoll();

    // Delay for dice rotation animation
    await new Promise(resolve => setTimeout(resolve, 800 / state.animationSpeed));

    // Determine the rolled value
    let roll = Math.floor(Math.random() * 6) + 1;
    const currentActivePowerUp = state.activePowerUp;
    let finalRoll = roll;
    let diceType: 'standard' | 'safe' | 'boost' = 'standard';

    if (currentActivePowerUp === 'safe') {
      roll = Math.floor(Math.random() * 3) + 1;
      finalRoll = roll;
      diceType = 'safe';
    } else if (currentActivePowerUp === 'boost') {
      finalRoll = roll + 2;
      diceType = 'boost';
    }

    const activePlayerId = state.currentTurn;
    const activePlayer = state.players.find(p => p.id === activePlayerId)!;
    const currentPos = activePlayer.position;
    let targetPos = currentPos + finalRoll;

    // Log the roll
    let rollMsg = `${activePlayer.name} rolled a ${roll}`;
    if (currentActivePowerUp === 'boost') {
      rollMsg += ` (+2 Boost = ${finalRoll})`;
    } else if (currentActivePowerUp === 'safe') {
      rollMsg += ` (Safe Roll)`;
    }

    let nextHistory = addLog(state.history, activePlayer.id, activePlayer.name, rollMsg, 'dice');

    // Update stats for sixes
    const isSix = roll === 6;
    const updatedSixes = { ...state.stats.sixesRolled };
    if (isSix) {
      updatedSixes[activePlayerId] = (updatedSixes[activePlayerId] || 0) + 1;
    }

    // Check overshoot
    if (targetPos > 100) {
      nextHistory = addLog(nextHistory, activePlayer.id, activePlayer.name, `${activePlayer.name} needs exact roll to win (overshot 100). Stays at ${currentPos}`, 'info');
      
      setState(prev => {
        const nextTurn = getNextTurnPlayerId(prev);
        return {
          ...prev,
          status: 'playing',
          diceValue: finalRoll,
          diceTypeUsed: diceType,
          activePowerUp: null,
          currentTurn: nextTurn,
          history: nextHistory,
          stats: {
            ...prev.stats,
            turns: prev.stats.turns + 1,
            sixesRolled: updatedSixes
          }
        };
      });
      isMovingRef.current = false;
      return;
    }

    // Start movement step-by-step
    const path = getMovePath(currentPos, targetPos);
    setState(prev => ({
      ...prev,
      diceValue: finalRoll,
      diceTypeUsed: diceType,
      status: 'moving'
    }));

    // Step animation loop
    for (let i = 0; i < path.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 250 / state.animationSpeed));
      
      const currentStepPos = path[i];
      // Sound click on each cell landing
      audioSynth.playClick();

      setState(prev => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === activePlayerId) {
            return { ...p, previousPosition: p.position, position: currentStepPos };
          }
          return p;
        });
        return { ...prev, players: updatedPlayers };
      });
    }

    // Now check if player landed on a snake or ladder
    await new Promise(resolve => setTimeout(resolve, 150 / state.animationSpeed));
    const landingCheck = checkSnakeOrLadder(targetPos);

    if (landingCheck.type === 'ladder') {
      // Climbing ladder
      setState(prev => ({ ...prev, status: 'ladder_climb' }));
      audioSynth.playLadderClimb();
      nextHistory = addLog(nextHistory, activePlayerId, activePlayer.name, `🪜 Climbing ladder from ${targetPos} to ${landingCheck.destination}!`, 'ladder');
      
      await new Promise(resolve => setTimeout(resolve, 600 / state.animationSpeed));
      
      setState(prev => {
        const updatedPlayers = prev.players.map(p => {
          if (p.id === activePlayerId) {
            return { ...p, previousPosition: targetPos, position: landingCheck.destination };
          }
          return p;
        });
        const clm = { ...prev.stats.laddersClimbed };
        clm[activePlayerId] = (clm[activePlayerId] || 0) + 1;
        return {
          ...prev,
          players: updatedPlayers,
          stats: { ...prev.stats, laddersClimbed: clm }
        };
      });

      // Unlock ladder master achievement
      const clmCount = (state.stats.laddersClimbed[activePlayerId] || 0) + 1;
      if (clmCount >= 3 && activePlayer.isHuman) {
        unlockAchievement('ladder_master');
      }

      targetPos = landingCheck.destination;
    } else if (landingCheck.type === 'snake') {
      // Landed on snake. Check if they have shield!
      const shield = activePlayer.powerups.find(pu => pu.type === 'shield');
      const hasShield = shield && shield.count > 0;

      if (hasShield) {
        // Shield saves the day! Consume shield
        setState(prev => {
          const updatedPlayers = prev.players.map(p => {
            if (p.id === activePlayerId) {
              return {
                ...p,
                powerups: p.powerups.map(pu => pu.type === 'shield' ? { ...pu, count: pu.count - 1 } : pu)
              };
            }
            return p;
          });
          const logMsg = `🛡️ Snake at ${targetPos} blocked by Shield! ${activePlayer.name} stays safe.`;
          const updatedHistory = addLog(prev.history, activePlayerId, activePlayer.name, logMsg, 'powerup');
          return {
            ...prev,
            players: updatedPlayers,
            history: updatedHistory
          };
        });
        
        // Play click/block sound
        audioSynth.playClick();
        if (activePlayer.isHuman) {
          unlockAchievement('snake_survivor');
        }
      } else {
        // Slide down snake
        setState(prev => ({ ...prev, status: 'snake_slide' }));
        audioSynth.playSnakeSlide();
        nextHistory = addLog(nextHistory, activePlayerId, activePlayer.name, `🐍 Slid down snake from ${targetPos} to ${landingCheck.destination}!`, 'snake');
        
        await new Promise(resolve => setTimeout(resolve, 800 / state.animationSpeed));
        
        setState(prev => {
          const updatedPlayers = prev.players.map(p => {
            if (p.id === activePlayerId) {
              return { ...p, previousPosition: targetPos, position: landingCheck.destination };
            }
            return p;
          });
          const sld = { ...prev.stats.snakesLanded };
          sld[activePlayerId] = (sld[activePlayerId] || 0) + 1;
          return {
            ...prev,
            players: updatedPlayers,
            stats: { ...prev.stats, snakesLanded: sld }
          };
        });
        targetPos = landingCheck.destination;
      }
    }

    // Check Win condition
    if (targetPos === 100) {
      audioSynth.stopMusic();
      audioSynth.playVictory();
      nextHistory = addLog(nextHistory, activePlayerId, activePlayer.name, `🎉 ${activePlayer.name} reached tile 100 and won!`, 'win');

      // Check achievements
      const turnCount = state.stats.turns + 1;
      if (turnCount < 15 && activePlayer.isHuman) {
        unlockAchievement('unstoppable');
      }
      if (activePlayer.isHuman && state.mode === 'PvC' && state.difficulty === 'impossible') {
        unlockAchievement('ai_crusher');
      }

      setState(prev => {
        const historyRecord = {
          winnerName: activePlayer.name,
          mode: prev.mode,
          difficulty: prev.mode === 'PvC' ? prev.difficulty : undefined,
          turns: turnCount,
          date: Date.now()
        };
        return {
          ...prev,
          status: 'finished',
          screen: 'winner',
          winnerId: activePlayerId,
          history: nextHistory,
          matchHistory: [historyRecord, ...prev.matchHistory].slice(0, 10),
          stats: {
            ...prev.stats,
            endTime: Date.now()
          }
        };
      });
      isMovingRef.current = false;
      return;
    }

    // Wrap up turn
    setState(prev => {
      // Award random powerup on rolling a 6!
      let updatedPlayers = prev.players;
      let logs = nextHistory;
      
      if (isSix) {
        const pTypes: PowerUpType[] = ['shield', 'reroll', 'boost', 'safe'];
        const randomPuType = pTypes[Math.floor(Math.random() * pTypes.length)];
        
        updatedPlayers = prev.players.map(p => {
          if (p.id === activePlayerId) {
            return {
              ...p,
              powerups: p.powerups.map(pu => pu.type === randomPuType ? { ...pu, count: pu.count + 1 } : pu)
            };
          }
          return p;
        });

        // Earn lucky roller achievement
        const sixesCount = (prev.stats.sixesRolled[activePlayerId] || 0) + 1;
        if (sixesCount >= 3 && activePlayer.isHuman) {
          // Trigger unlock
          setTimeout(() => unlockAchievement('lucky_roller'), 100);
        }

        logs = addLog(logs, activePlayerId, activePlayer.name, `🎲 Rolled a 6! Earned extra turn and a random Power-up (${randomPuType.toUpperCase()})!`, 'info');
      }

      // Next turn
      const nextTurn = isSix ? activePlayerId : getNextTurnPlayerId(prev);
      
      return {
        ...prev,
        players: updatedPlayers,
        status: 'playing',
        activePowerUp: null,
        currentTurn: nextTurn,
        history: logs,
        stats: {
          ...prev.stats,
          turns: prev.stats.turns + 1,
          sixesRolled: updatedSixes
        }
      };
    });

    isMovingRef.current = false;
  };

  const getNextTurnPlayerId = (currentState: GameState): string => {
    const currentIndex = currentState.players.findIndex(p => p.id === currentState.currentTurn);
    const nextIndex = (currentIndex + 1) % currentState.players.length;
    return currentState.players[nextIndex].id;
  };

  return (
    <GameContext.Provider value={{
      state,
      startGame,
      rollDice,
      activatePowerUp,
      changeTheme,
      changeVolume,
      changeAnimationSpeed,
      resetGameProgress,
      resetActiveGame,
      goToScreen,
      unmuteSynth
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
