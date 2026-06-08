export type ScreenType = 'home' | 'rules' | 'game' | 'settings' | 'winner';
export type GameMode = 'PvC' | 'PvP';
export type Difficulty = 'easy' | 'medium' | 'hard' | 'impossible';
export type ThemeType = 'classic' | 'neon' | 'space' | 'jungle';
export type PowerUpType = 'shield' | 'reroll' | 'boost' | 'safe';

export interface PowerUp {
  type: PowerUpType;
  count: number;
  name: string;
  description: string;
  iconName: string;
}

export interface Player {
  id: string;
  name: string;
  color: 'red' | 'blue' | 'green';
  position: number; // 1 to 100
  previousPosition: number;
  powerups: PowerUp[];
  isHuman: boolean;
  isCpu: boolean;
  colorHex: string;
}

export interface GameStats {
  turns: number;
  snakesLanded: { [playerId: string]: number };
  laddersClimbed: { [playerId: string]: number };
  sixesRolled: { [playerId: string]: number };
  powerupsUsed: { [playerId: string]: number };
  startTime: number;
  endTime: number | null;
}

export interface GameHistoryEntry {
  id: string;
  timestamp: number;
  playerId: string;
  playerName: string;
  message: string;
  type: 'move' | 'snake' | 'ladder' | 'powerup' | 'dice' | 'win' | 'info';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameState {
  screen: ScreenType;
  mode: GameMode;
  players: Player[];
  currentTurn: string; // playerId
  status: 'setup' | 'playing' | 'rolling' | 'moving' | 'snake_slide' | 'ladder_climb' | 'finished';
  diceValue: number;
  diceTypeUsed: 'standard' | 'safe' | 'boost';
  activePowerUp: PowerUpType | null;
  difficulty: Difficulty;
  theme: ThemeType;
  musicVolume: number; // 0 to 1
  sfxVolume: number;   // 0 to 1
  animationSpeed: number; // 0.5 to 2 (multiplier)
  history: GameHistoryEntry[];
  winnerId: string | null;
  stats: GameStats;
  achievements: Achievement[];
  matchHistory: {
    winnerName: string;
    mode: GameMode;
    difficulty?: Difficulty;
    turns: number;
    date: number;
  }[];
}
