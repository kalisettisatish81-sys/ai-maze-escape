import { Position, AlgorithmType } from '@/types/game';
import { INITIAL_PLAYER_POS, INITIAL_ENEMY_POS } from '@/lib/mazeData';
import { findBFSPath } from './bfs';
import { findDFSPath } from './dfs';
import { findHillClimbingPath } from './hillClimbing';
import { findAStarPath } from './aStar';

/**
 * Result row from genuine execution of an algorithm on the maze.
 * Values are strictly computed via authentic algorithm execution.
 */
export interface AlgorithmComparisonResult {
  algorithm: AlgorithmType;
  fullName: string;
  searchType: 'Uninformed Search' | 'Informed Search';
  dataStructure: string;
  heuristic: string;
  found: boolean;
  pathLength: number | null;
  exploredNodes: number;
  statusText: string;
  optimal: string;
}

/**
 * Pure, read-only algorithm comparison utility.
 *
 * Executes BFS, DFS, Hill Climbing, and A* on the EXACT SAME:
 * - Maze topology
 * - AI start position
 * - Player target position
 *
 * This function NEVER modifies any game state (Player position, AI position,
 * score, moves, timer, key state, treasure state, trap state, or game result).
 *
 * @param start - Starting position of the search agent (default: INITIAL_ENEMY_POS)
 * @param target - Goal position of the target (default: INITIAL_PLAYER_POS)
 * @param customWallCheck - Optional custom wall checker function
 * @returns Array of real execution metrics for all four algorithms
 */
export function compareAlgorithms(
  start: Position = INITIAL_ENEMY_POS,
  target: Position = INITIAL_PLAYER_POS,
  customWallCheck?: (r: number, c: number) => boolean
): AlgorithmComparisonResult[] {
  // 1. Genuine Breadth-First Search (FIFO Queue)
  const bfsResult = findBFSPath(start, target, customWallCheck);

  // 2. Genuine Depth-First Search (LIFO Stack)
  const dfsResult = findDFSPath(start, target, customWallCheck);

  // 3. Genuine Hill Climbing (Greedy Local Search via Manhattan Distance)
  const hcResult = findHillClimbingPath(start, target, customWallCheck);

  // 4. Genuine A* Search (Min-Heap Priority Queue with f(n) = g(n) + h(n))
  const astarResult = findAStarPath(start, target, customWallCheck);

  return [
    {
      algorithm: 'BFS',
      fullName: 'Breadth-First Search',
      searchType: 'Uninformed Search',
      dataStructure: 'FIFO Queue',
      heuristic: 'None',
      found: bfsResult.found,
      pathLength: bfsResult.found ? bfsResult.pathLength : null,
      exploredNodes: bfsResult.exploredNodes,
      statusText: bfsResult.found ? `${bfsResult.pathLength} steps (Optimal)` : 'No Path Found',
      optimal: 'Yes (Uniform Cost)',
    },
    {
      algorithm: 'DFS',
      fullName: 'Depth-First Search',
      searchType: 'Uninformed Search',
      dataStructure: 'LIFO Stack',
      heuristic: 'None',
      found: dfsResult.found,
      pathLength: dfsResult.found ? dfsResult.pathLength : null,
      exploredNodes: dfsResult.exploredNodes,
      statusText: dfsResult.found ? `${dfsResult.pathLength} steps` : 'No Path Found',
      optimal: 'No (Suboptimal)',
    },
    {
      algorithm: 'Hill Climbing',
      fullName: 'Greedy Local Search',
      searchType: 'Informed Search',
      dataStructure: 'Greedy Local Pointer',
      heuristic: 'Manhattan',
      found: hcResult.found,
      pathLength: hcResult.found ? hcResult.pathLength : null,
      exploredNodes: hcResult.exploredNodes,
      statusText: hcResult.found ? `${hcResult.pathLength} steps` : 'Stuck / No Path Found',
      optimal: 'No (Local Optimum)',
    },
    {
      algorithm: 'A*',
      fullName: 'A* Search',
      searchType: 'Informed Search',
      dataStructure: 'Min-Heap Priority Queue',
      heuristic: 'Manhattan',
      found: astarResult.found,
      pathLength: astarResult.found ? astarResult.pathLength : null,
      exploredNodes: astarResult.exploredNodes,
      statusText: astarResult.found ? `${astarResult.pathLength} steps (Optimal)` : 'No Path Found',
      optimal: 'Yes (Admissible Heuristic)',
    },
  ];
}
