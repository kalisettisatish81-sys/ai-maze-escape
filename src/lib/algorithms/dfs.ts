import { Position, PathResult } from '@/types/game';
import { isWall, isInBounds } from '@/lib/mazeData';

/**
 * Depth-First Search (DFS) Pathfinding Algorithm
 *
 * An uninformed search algorithm that explores as far as possible along
 * each branch before backtracking using a Last-In, First-Out (LIFO) stack.
 *
 * It is memory-efficient along deep corridors but is NOT optimal and can
 * produce lengthy, winding exploration paths.
 *
 * @param start - Starting position (AI Enemy)
 * @param target - Goal position (Player)
 * @param customWallCheck - Optional custom wall checker
 * @returns PathResult containing path, found boolean, exploredNodes, pathLength, and exploredCells
 */
export function findDFSPath(
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

  // Edge case: start is at target
  if (start.row === target.row && start.col === target.col) {
    return {
      path: [{ row: start.row, col: start.col }],
      found: true,
      exploredNodes: 1,
      pathLength: 0,
      exploredCells: [{ row: start.row, col: start.col }],
    };
  }

  // Real LIFO Stack for deep branch exploration
  const stack: Position[] = [{ row: start.row, col: start.col }];
  const visited = new Set<string>();
  const parentMap = new Map<string, Position>();
  const exploredCells: Position[] = [];

  // Order of directional branch exploration: Up, Right, Down, Left
  const directions = [
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 0, dCol: 1 },  // Right
    { dRow: 1, dCol: 0 },  // Down
    { dRow: 0, dCol: -1 }, // Left
  ];

  let targetFound = false;

  while (stack.length > 0) {
    const current = stack.pop()!;
    const currentKey = `${current.row},${current.col}`;

    if (visited.has(currentKey)) {
      continue;
    }

    visited.add(currentKey);
    exploredCells.push({ row: current.row, col: current.col });

    // Target reached
    if (current.row === target.row && current.col === target.col) {
      targetFound = true;
      break;
    }

    // Push valid unvisited neighbors to stack
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
        parentMap.set(neighborKey, current);
        stack.push({ row: neighborRow, col: neighborCol });
      }
    }
  }

  // Reconstruct discovered path from parent relationships
  if (targetFound) {
    const path: Position[] = [];
    let curr: Position | undefined = { row: target.row, col: target.col };

    while (curr !== undefined) {
      path.push(curr);
      if (curr.row === start.row && curr.col === start.col) {
        break;
      }
      const key = `${curr.row},${curr.col}`;
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

  // Unreachable target
  return {
    path: [],
    found: false,
    exploredNodes: exploredCells.length,
    pathLength: 0,
    exploredCells,
  };
}

export const DFS_METADATA = {
  name: 'Depth-First Search',
  shortName: 'DFS',
  searchType: 'Uninformed Search',
  dataStructure: 'LIFO Stack',
  heuristic: 'None',
  optimal: 'No (Suboptimal Path)',
  description: 'Dives deep down corridor branches before backtracking. Often produces winding paths.',
};
