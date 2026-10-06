import { Position, PathResult, AlgorithmType } from '@/types/game';
import { findAStarPath } from './aStar';
import { findBFSPath, BFS_METADATA } from './bfs';
import { findDFSPath, DFS_METADATA } from './dfs';
import { findHillClimbingPath, HILL_CLIMBING_METADATA } from './hillClimbing';

export { findAStarPath } from './aStar';
export { findBFSPath } from './bfs';
export { findDFSPath } from './dfs';
export { findHillClimbingPath } from './hillClimbing';
export { compareAlgorithms, type AlgorithmComparisonResult } from './compareAlgorithms';

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  searchType: string;
  heuristic: string;
  dataStructure: string;
  optimal: string;
  description: string;
  formula?: string;
  educationalNote: string;
}

export const ALGORITHM_REGISTRY: Record<AlgorithmType, AlgorithmMetadata> = {
  'BFS': {
    id: 'BFS',
    name: 'Breadth-First Search',
    searchType: 'Uninformed Search',
    heuristic: 'None',
    dataStructure: 'FIFO Queue',
    optimal: 'Yes for uniform-cost paths',
    description: 'Explores the maze level by level.',
    educationalNote: 'BFS explores the maze level-by-level using a FIFO queue and searched for the shortest path.',
  },
  'DFS': {
    id: 'DFS',
    name: 'Depth-First Search',
    searchType: 'Uninformed Search',
    heuristic: 'None',
    dataStructure: 'LIFO Stack',
    optimal: 'No',
    description: 'Explores deeply before backtracking.',
    educationalNote: 'DFS explored deeply along branches using a stack. Its discovered path is not guaranteed to be the shortest.',
  },
  'Hill Climbing': {
    id: 'Hill Climbing',
    name: 'Hill Climbing',
    searchType: 'Informed Search',
    heuristic: 'Manhattan Distance',
    dataStructure: 'Greedy Local Search',
    optimal: 'No (Can get stuck at a local optimum)',
    formula: 'Choose neighbor with lowest h(n)',
    description: 'Moves toward the neighbor that appears closest to the target.',
    educationalNote: 'Hill Climbing selected locally better states using Manhattan distance. It can become stuck when no neighboring state improves the heuristic.',
  },
  'A*': {
    id: 'A*',
    name: 'A* Search',
    searchType: 'Informed Search',
    heuristic: 'Manhattan Distance',
    dataStructure: 'Min-Heap Priority Queue',
    optimal: 'Yes under the conditions used in this maze',
    formula: 'f(n) = g(n) + h(n)',
    description: 'Combines the cost already travelled with estimated remaining cost.',
    educationalNote: 'A* combined the travelled cost g(n) with the estimated remaining cost h(n) using f(n) = g(n) + h(n).',
  },
};

/**
 * Central Dispatcher: Executes the selected search algorithm
 *
 * @param algorithm - Selected algorithm ('BFS' | 'DFS' | 'Hill Climbing' | 'A*')
 * @param start - Starting position (AI Enemy)
 * @param target - Goal position (Player)
 * @param customWallCheck - Optional custom wall checker
 * @returns Standardized PathResult
 */
export function executeSearchAlgorithm(
  algorithm: AlgorithmType,
  start: Position,
  target: Position,
  customWallCheck?: (r: number, c: number) => boolean
): PathResult {
  switch (algorithm) {
    case 'BFS':
      return findBFSPath(start, target, customWallCheck);
    case 'DFS':
      return findDFSPath(start, target, customWallCheck);
    case 'Hill Climbing':
      return findHillClimbingPath(start, target, customWallCheck);
    case 'A*':
    default:
      return findAStarPath(start, target, customWallCheck);
  }
}

export function getAlgorithmMetadata(algorithm: AlgorithmType): AlgorithmMetadata {
  return ALGORITHM_REGISTRY[algorithm] || ALGORITHM_REGISTRY['A*'];
}
