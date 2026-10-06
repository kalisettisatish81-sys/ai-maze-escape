export type CellType = 
  | 'empty'
  | 'wall'
  | 'player'
  | 'enemy'
  | 'key'
  | 'treasure'
  | 'trap'
  | 'exit';

export interface Position {
  row: number;
  col: number;
  x?: number;
  y?: number;
}

export type GridPosition = Position;

export interface GameState {
  playerPos: Position;
  enemyPos: Position;
  keyPos: Position | null;
  treasurePos: Position | null;
  traps: Position[];
  exitPos: Position;
  hasKey: boolean;
  score: number;
  moves: number;
  timeSeconds: number;
  formattedTime: string;
  isCompleted: boolean;
  isGameOver: boolean;
  status: 'ready' | 'playing' | 'won' | 'lost';
  notification: string | null;
}

export interface PathResult {
  path: Position[];
  found: boolean;
  exploredNodes: number;
  pathLength: number;
  exploredCells: Position[];
}

export type DifficultyLevel = 'easy' | 'normal' | 'hard';

export interface AITelemetry {
  algorithm: string;
  searchType: string;
  heuristic: string;
  dataStructure?: string;
  optimality?: string;
  exploredNodes: number;
  pathLength: number;
  status: 'Searching' | 'Chasing' | 'Caught' | 'Idle' | 'Stuck';
  path: Position[];
  exploredCells: Position[];
}

export interface GameResultData {
  score: number;
  moves: number;
  time: string;
  trapsTriggered?: number;
  result?: 'Won' | 'Lost';
  algorithm: string;
  pathLength: number;
  exploredNodes: number;
  status: string;
  algorithmPerformance: string;
  completedAt?: string;
}

export type AlgorithmType = 'BFS' | 'DFS' | 'Hill Climbing' | 'A*';

export interface AlgorithmInfo {
  id: string;
  name: string;
  shortName: AlgorithmType;
  category: 'Uninformed Search' | 'Informed Search' | 'Informed / Heuristic Search';
  type: 'Uninformed Search' | 'Informed Search';
  dataStructure: string;
  heuristic: string;
  idea: string;
  strategy?: string;
  limitation?: string;
  formula?: string;
  timeComplexity: string;
  spaceComplexity: string;
  optimal: boolean;
  optimalNote?: string;
  complete: boolean;
  accentColor: string;
}

export interface GameHUDProps {
  score: number;
  moves: number;
  time: string;
  hasKey?: boolean;
}

export interface ResultMetric {
  title: string;
  value: string | number;
  subtitle?: string;
  iconName?: string;
  status?: 'default' | 'pending' | 'success' | 'warning';
}
