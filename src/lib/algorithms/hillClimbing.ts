import { Position, PathResult } from '@/types/game';
import { isWall, isInBounds } from '@/lib/mazeData';

/**
 * Calculates Manhattan distance between two cells:
 * h(n) = |current.row - target.row| + |current.col - target.col|
 */
export function calculateManhattanHeuristic(current: Position, target: Position): number {
  return Math.abs(current.row - target.row) + Math.abs(current.col - target.col);
}

/**
 * Hill Climbing (Greedy Local Search) Pathfinding Algorithm
 *
 * An informed local search algorithm that only looks at immediate neighbors
 * and chooses the step with the minimum Manhattan distance to the goal.
 *
 * Crucial Demonstration:
 * Hill Climbing does NOT look ahead, does NOT backtrack, and does NOT
 * account for past cost g(n). If it enters a corridor where all neighbors
 * have equal or higher heuristic cost (such as a dead end or wall detour),
 * it stops at the local optimum.
 *
 * @param start - Starting position (AI Enemy)
 * @param target - Goal position (Player)
 * @param customWallCheck - Optional custom wall checker
 * @returns PathResult containing path, found boolean, exploredNodes, pathLength, and exploredCells
 */
export function findHillClimbingPath(
  start: Position,
  target: Position,
  customWallCheck?: (r: number, c: number) => boolean
): PathResult {
  const checkWall = customWallCheck || isWall;

  // Boundary and wall checks
  if (
    !isInBounds(start.row, start.col) ||
    !isInBounds(target.row, target.col) ||
    checkWall(start.row, start.col) ||
    checkWall(target.row, target.col)
  ) {
    return {
      path: [],
      found: false,
      exploredNodes: 0,
      pathLength: 0,
      exploredCells: [],
    };
  }

  // Edge case: start is already at target
  if (start.row === target.row && start.col === target.col) {
    return {
      path: [{ row: start.row, col: start.col }],
      found: true,
      exploredNodes: 1,
      pathLength: 0,
      exploredCells: [{ row: start.row, col: start.col }],
    };
  }

  const path: Position[] = [{ row: start.row, col: start.col }];
  const exploredCells: Position[] = [{ row: start.row, col: start.col }];
  const visited = new Set<string>();
  visited.add(`${start.row},${start.col}`);

  // 4 Cardinal Directions: Up, Down, Left, Right (No diagonals)
  const directions = [
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 1, dCol: 0 },  // Down
    { dRow: 0, dCol: -1 }, // Left
    { dRow: 0, dCol: 1 },  // Right
  ];

  let current = { row: start.row, col: start.col };
  let currentHeuristic = calculateManhattanHeuristic(current, target);
  let reachedTarget = false;

  // Maximum step safety limit (equal to grid area) to prevent cycles
  const maxSteps = 100;
  let stepsTaken = 0;

  while (stepsTaken < maxSteps) {
    stepsTaken++;

    // Target reached
    if (current.row === target.row && current.col === target.col) {
      reachedTarget = true;
      break;
    }

    // Evaluate valid neighbors and find the one that strictly minimizes h(n)
    let bestNeighbor: Position | null = null;
    let bestHeuristic = currentHeuristic; // Greedy Hill Climbing requires strict improvement

    for (const { dRow, dCol } of directions) {
      const neighborRow = current.row + dRow;
      const neighborCol = current.col + dCol;

      // 1. Boundary check
      if (!isInBounds(neighborRow, neighborCol)) {
        continue;
      }

      // 2. Wall check
      if (checkWall(neighborRow, neighborCol)) {
        continue;
      }

      const neighborKey = `${neighborRow},${neighborCol}`;
      if (visited.has(neighborKey)) {
        continue;
      }

      const h = calculateManhattanHeuristic({ row: neighborRow, col: neighborCol }, target);

      // Track neighbor with lowest heuristic value
      if (h < bestHeuristic) {
        bestHeuristic = h;
        bestNeighbor = { row: neighborRow, col: neighborCol };
      }
    }

    // If no neighbor strictly improves the heuristic, Hill Climbing is stuck at local optimum!
    if (!bestNeighbor) {
      break;
    }

    // Advance to best neighbor
    current = bestNeighbor;
    currentHeuristic = bestHeuristic;
    visited.add(`${current.row},${current.col}`);
    path.push(current);
    exploredCells.push(current);

    if (current.row === target.row && current.col === target.col) {
      reachedTarget = true;
      break;
    }
  }

  return {
    path,
    found: reachedTarget,
    exploredNodes: exploredCells.length,
    pathLength: reachedTarget ? path.length - 1 : path.length - 1,
    exploredCells,
  };
}

export const HILL_CLIMBING_METADATA = {
  name: 'Hill Climbing',
  shortName: 'Hill Climbing',
  searchType: 'Informed Search',
  strategy: 'Local Search (Steepest Ascent/Descent)',
  dataStructure: 'None (Greedy Pointer)',
  heuristic: 'Manhattan Distance',
  optimal: 'No (Stuck in Local Maxima/Minima)',
  complete: 'No (Fails in Dead Ends)',
  description: 'Purely greedy local search. Steps toward lower Manhattan distance; easily trapped in maze dead ends.',
};
