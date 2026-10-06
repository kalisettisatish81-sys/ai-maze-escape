import { CellType, Position } from '@/types/game';

export const MAZE_ROWS = 10;
export const MAZE_COLS = 10;

export const INITIAL_PLAYER_POS: Position = { row: 1, col: 1 };
export const INITIAL_ENEMY_POS: Position = { row: 8, col: 7 };
export const INITIAL_KEY_POS: Position = { row: 1, col: 7 };
export const INITIAL_TREASURE_POS: Position = { row: 4, col: 7 };
export const INITIAL_TRAPS_POS: Position[] = [
  { row: 3, col: 3 },
  { row: 7, col: 7 },
  { row: 8, col: 2 },
];
export const INITIAL_EXIT_POS: Position = { row: 8, col: 8 };

/**
 * Fixed 10x10 maze wall topology:
 * true = Wall, false = Walkable path
 * Row coordinates: 0..9, Column coordinates: 0..9
 *
 * Guarantees a fully connected layout allowing the path:
 * Player (1, 1) -> Key (1, 7) -> Treasure (4, 7) / Traps -> Exit (8, 8)
 */
export const MAZE_WALLS: boolean[][] = [
  // Col: 0      1      2      3      4      5      6      7      8      9
  /* 0 */ [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
  /* 1 */ [true,  false, false, false, false, false, false, false, false, true ],
  /* 2 */ [true,  false, true,  true,  true,  true,  true,  false, true,  true ],
  /* 3 */ [true,  false, false, false, false, false, false, false, false, true ],
  /* 4 */ [true,  true,  true,  false, true,  true,  true,  false, false, true ],
  /* 5 */ [true,  false, false, false, false, false, true,  false, false, true ],
  /* 6 */ [true,  false, true,  true,  true,  false, true,  false, false, true ],
  /* 7 */ [true,  false, false, false, true,  false, false, false, false, true ],
  /* 8 */ [true,  false, false, false, true,  true,  true,  false, false, true ],
  /* 9 */ [true,  true,  true,  true,  true,  true,  true,  true,  true,  true ],
];

export function isInBounds(row: number, col: number): boolean {
  return row >= 0 && row < MAZE_ROWS && col >= 0 && col < MAZE_COLS;
}

export function isWall(row: number, col: number): boolean {
  if (!isInBounds(row, col)) return true;
  return MAZE_WALLS[row][col];
}

/**
 * Builds a dynamic 10x10 CellType grid based on current positions
 */
export function buildMazeGrid(
  playerPos: Position,
  enemyPos: Position,
  keyPos: Position | null,
  treasurePos: Position | null,
  traps: Position[],
  exitPos: Position
): CellType[][] {
  const grid: CellType[][] = Array.from({ length: MAZE_ROWS }, (_, r) =>
    Array.from({ length: MAZE_COLS }, (_, c) => {
      if (MAZE_WALLS[r][c]) {
        return 'wall';
      }
      return 'empty';
    })
  );

  // Place traps
  traps.forEach((trap) => {
    if (isInBounds(trap.row, trap.col)) {
      grid[trap.row][trap.col] = 'trap';
    }
  });

  // Place key (if uncollected)
  if (keyPos && isInBounds(keyPos.row, keyPos.col)) {
    grid[keyPos.row][keyPos.col] = 'key';
  }

  // Place treasure (if uncollected)
  if (treasurePos && isInBounds(treasurePos.row, treasurePos.col)) {
    grid[treasurePos.row][treasurePos.col] = 'treasure';
  }

  // Place exit
  if (isInBounds(exitPos.row, exitPos.col)) {
    grid[exitPos.row][exitPos.col] = 'exit';
  }

  // Place AI enemy
  if (isInBounds(enemyPos.row, enemyPos.col)) {
    grid[enemyPos.row][enemyPos.col] = 'enemy';
  }

  // Place player (rendered on top of current cell)
  if (isInBounds(playerPos.row, playerPos.col)) {
    grid[playerPos.row][playerPos.col] = 'player';
  }

  return grid;
}
