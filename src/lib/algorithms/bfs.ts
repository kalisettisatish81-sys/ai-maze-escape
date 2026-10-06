import { Position, PathResult } from '@/types/game';
import { isWall, isInBounds } from '@/lib/mazeData';

/**
 * Breadth-First Search (BFS) Pathfinding Algorithm
 *
 * An uninformed search algorithm that expands the shallowest nodes first
 * using a First-In, First-Out (FIFO) queue.
 *
 * Guarantees the optimal shortest path in unweighted uniform-cost grids.
 *
 * @param start - Starting position (AI Enemy)
 * @param target - Goal position (Player)
 * @param customWallCheck - Optional custom wall checker
 * @returns PathResult containing path, found boolean, exploredNodes, pathLength, and exploredCells
 */
export function findBFSPath(
  start: Position,
  target: Position,
  customWallCheck?: (r: number, c: number) => boolean
): PathResult {
  const checkWall = customWallCheck || isWall;

  // Boundary and wall validation
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

  // Real FIFO Queue for level-by-level exploration
  const queue: Position[] = [{ row: start.row, col: start.col }];
  const visited = new Set<string>();
  const parentMap = new Map<string, Position>();
  const exploredCells: Position[] = [];

  const startKey = `${start.row},${start.col}`;
  visited.add(startKey);

  // 4 Cardinal Directions: Up, Down, Left, Right (No diagonals)
  const directions = [
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 1, dCol: 0 },  // Down
    { dRow: 0, dCol: -1 }, // Left
    { dRow: 0, dCol: 1 },  // Right
  ];

  let targetFound = false;
  const targetKey = `${target.row},${target.col}`;

  while (queue.length > 0) {
    const current = queue.shift()!;
    exploredCells.push({ row: current.row, col: current.col });

    // Check if target is reached
    if (current.row === target.row && current.col === target.col) {
      targetFound = true;
      break;
    }

    // Expand neighbors in 4 directions
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
      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, current);
        queue.push({ row: neighborRow, col: neighborCol });

        // Optimization: Early exit if neighbor is the target
        if (neighborRow === target.row && neighborCol === target.col) {
          exploredCells.push({ row: neighborRow, col: neighborCol });
          targetFound = true;
          break;
        }
      }
    }

    if (targetFound) break;
  }

  // If path was found, reconstruct from target to start using parent relationships
  if (targetFound) {
    const path: Position[] = [];
    let curr: Position | undefined = { row: target.row, col: target.col };

    while (curr !== undefined) {
      path.push(curr);
      const key = `${curr.row},${curr.col}`;
      if (curr.row === start.row && curr.col === start.col) {
        break;
      }
      curr = parentMap.get(key);
    }

    path.reverse();

    return {
      path,
      found: true,
      exploredNodes: exploredCells.length,
      pathLength: path.length - 1,
      exploredCells,
    };
  }

  // Target unreachable
  return {
    path: [],
    found: false,
    exploredNodes: exploredCells.length,
    pathLength: 0,
    exploredCells,
  };
}

export const BFS_METADATA = {
  name: 'Breadth-First Search',
  shortName: 'BFS',
  searchType: 'Uninformed Search',
  dataStructure: 'FIFO Queue',
  heuristic: 'None',
  optimal: 'Yes (Uniform Cost)',
  description: 'Explores nodes level-by-level uniformly in all 4 directions. Guarantees the shortest path.',
};
