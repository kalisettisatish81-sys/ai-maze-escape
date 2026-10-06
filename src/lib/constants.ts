import { AlgorithmInfo, CellType } from '@/types/game';

export const ALGORITHMS: AlgorithmInfo[] = [
  {
    id: 'bfs',
    name: 'Breadth-First Search',
    shortName: 'BFS',
    category: 'Uninformed Search',
    type: 'Uninformed Search',
    dataStructure: 'FIFO Queue',
    heuristic: 'None',
    idea: 'Explores the maze level by level.',
    strategy: 'Explores nodes level-by-level in uniform concentric rings using a First-In, First-Out (FIFO) queue.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    optimal: true,
    optimalNote: 'Yes for uniform-cost paths.',
    complete: true,
    accentColor: '#00f0ff', // Cyber cyan
  },
  {
    id: 'dfs',
    name: 'Depth-First Search',
    shortName: 'DFS',
    category: 'Uninformed Search',
    type: 'Uninformed Search',
    dataStructure: 'LIFO Stack',
    heuristic: 'None',
    idea: 'Explores deeply before backtracking.',
    strategy: 'Explores as far as possible down each branch before backtracking using a Last-In, First-Out (LIFO) stack.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(d)',
    optimal: false,
    optimalNote: 'No.',
    complete: true,
    accentColor: '#ff007f', // Cyber magenta
  },
  {
    id: 'hill-climbing',
    name: 'Hill Climbing',
    shortName: 'Hill Climbing',
    category: 'Informed Search',
    type: 'Informed Search',
    dataStructure: 'Greedy Local Pointer',
    strategy: 'Greedy Local Search',
    heuristic: 'Manhattan Distance',
    formula: 'Choose neighbor with lowest h(n)',
    idea: 'Moves toward the neighbor that appears closest to the target.',
    limitation: 'Can get stuck at a local optimum.',
    timeComplexity: 'O(b · m)',
    spaceComplexity: 'O(1)',
    optimal: false,
    optimalNote: 'No.',
    complete: false,
    accentColor: '#ffb700', // Cyber amber
  },
  {
    id: 'astar',
    name: 'A* Search',
    shortName: 'A*',
    category: 'Informed Search',
    type: 'Informed Search',
    dataStructure: 'Min-Heap Priority Queue',
    heuristic: 'Manhattan Distance',
    formula: 'f(n) = g(n) + h(n)',
    idea: 'Combines the cost already travelled with estimated remaining cost.',
    strategy: 'Combines actual path cost g(n) with admissible heuristic estimate h(n) via a min-heap priority queue.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    optimal: true,
    optimalNote: 'Yes under the conditions used in this maze.',
    complete: true,
    accentColor: '#00ff9d', // Cyber emerald
  },
];

import { 
  buildMazeGrid, 
  INITIAL_PLAYER_POS, 
  INITIAL_ENEMY_POS, 
  INITIAL_KEY_POS, 
  INITIAL_TREASURE_POS, 
  INITIAL_TRAPS_POS, 
  INITIAL_EXIT_POS 
} from '@/lib/mazeData';

// Real 10x10 connected maze grid
export const INITIAL_MAZE_GRID: CellType[][] = buildMazeGrid(
  INITIAL_PLAYER_POS,
  INITIAL_ENEMY_POS,
  INITIAL_KEY_POS,
  INITIAL_TREASURE_POS,
  INITIAL_TRAPS_POS,
  INITIAL_EXIT_POS
);

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Start Game', href: '/game' },
  { label: 'Results', href: '/results' },
];
