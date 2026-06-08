export interface BoardConfig {
  snakes: { [from: number]: number };
  ladders: { [from: number]: number };
}

export const BOARD_CONFIG: BoardConfig = {
  ladders: {
    3: 22,
    11: 49,
    20: 38,
    27: 56,
    51: 72,
    71: 92,
  },
  snakes: {
    17: 4,
    34: 12,
    54: 29,
    62: 18,
    87: 36,
    98: 64,
  },
};
