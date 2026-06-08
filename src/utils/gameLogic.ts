import { BOARD_CONFIG } from '../data/board';

/**
 * Calculates the grid row and column for a given cell number (1 to 100)
 * row: 0 is the bottom row, 9 is the top row.
 * col: 0 is the leftmost column, 9 is the rightmost column.
 */
export function getCellGridPos(cell: number): { row: number; col: number } {
  if (cell < 1) cell = 1;
  if (cell > 100) cell = 100;
  
  const row = Math.floor((cell - 1) / 10);
  const isRowOdd = row % 2 !== 0; // Odd rows (1, 3, 5, 7, 9) go right-to-left
  
  const indexInRow = (cell - 1) % 10;
  const col = isRowOdd ? 9 - indexInRow : indexInRow;
  
  return { row, col };
}

/**
 * Returns percentage-based (x, y) coordinates for the center of a cell
 * relative to a 100x100 viewBox grid.
 * (0,0) is top-left, (100,100) is bottom-right.
 */
export function getCellCenterCoords(cell: number): { x: number; y: number } {
  const { row, col } = getCellGridPos(cell);
  
  // Center coordinates of cell in percentage
  const x = (col + 0.5) * 10;
  const y = (9 - row + 0.5) * 10; // y=0 is top, so row 9 is near y=5%, row 0 is near y=95%
  
  return { x, y };
}

/**
 * Computes the step-by-step path between two cell numbers.
 * Example: getMovePath(10, 13) -> [11, 12, 13]
 */
export function getMovePath(from: number, to: number): number[] {
  const path: number[] = [];
  if (from === to) return path;
  
  const step = from < to ? 1 : -1;
  let current = from;
  
  while (current !== to) {
    current += step;
    path.push(current);
  }
  
  return path;
}

/**
 * Checks if a cell contains a snake head or ladder base.
 * Returns the target cell if it does, otherwise null.
 */
export function checkSnakeOrLadder(cell: number): {
  type: 'snake' | 'ladder' | null;
  destination: number;
} {
  if (BOARD_CONFIG.ladders[cell] !== undefined) {
    return { type: 'ladder', destination: BOARD_CONFIG.ladders[cell] };
  }
  if (BOARD_CONFIG.snakes[cell] !== undefined) {
    return { type: 'snake', destination: BOARD_CONFIG.snakes[cell] };
  }
  return { type: null, destination: cell };
}
