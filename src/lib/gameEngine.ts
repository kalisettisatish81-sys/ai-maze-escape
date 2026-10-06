import { Position, PathResult, AITelemetry, GameResultData, AlgorithmType } from '@/types/game';
import { 
  INITIAL_PLAYER_POS, 
  INITIAL_ENEMY_POS, 
  INITIAL_KEY_POS, 
  INITIAL_TREASURE_POS, 
  INITIAL_TRAPS_POS, 
  INITIAL_EXIT_POS 
} from '@/lib/mazeData';
import { executeSearchAlgorithm, getAlgorithmMetadata } from '@/lib/algorithms';

export interface InternalGameState {
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
  status: 'ready' | 'playing' | 'won' | 'lost';
  notification: { text: string; type: 'info' | 'warning' | 'hazard' | 'success' } | null;
  trapsTriggered: number;
}

export function createInitialGameState(): InternalGameState {
  return {
    playerPos: { ...INITIAL_PLAYER_POS },
    enemyPos: { ...INITIAL_ENEMY_POS },
    keyPos: { ...INITIAL_KEY_POS },
    treasurePos: { ...INITIAL_TREASURE_POS },
    traps: INITIAL_TRAPS_POS.map((t) => ({ ...t })),
    exitPos: { ...INITIAL_EXIT_POS },
    hasKey: false,
    score: 1000,
    moves: 0,
    timeSeconds: 0,
    status: 'ready',
    notification: {
      text: 'Navigate to retrieve the Key and reach the Exit. Choose your AI adversary algorithm!',
      type: 'info',
    },
    trapsTriggered: 0,
  };
}

/**
 * Computes fresh path and telemetry from AI Enemy to Player using the selected algorithm
 */
export function computeAITelemetry(
  enemyPos: Position,
  playerPos: Position,
  currentStatus: 'ready' | 'playing' | 'won' | 'lost',
  algorithm: AlgorithmType = 'A*'
): { telemetry: AITelemetry; pathResult: PathResult } {
  const pathResult = executeSearchAlgorithm(algorithm, enemyPos, playerPos);
  const metadata = getAlgorithmMetadata(algorithm);

  let aiStatus: 'Searching' | 'Chasing' | 'Caught' | 'Idle' | 'Stuck' = 'Searching';
  if (currentStatus === 'lost') {
    aiStatus = 'Caught';
  } else if (currentStatus === 'won') {
    aiStatus = 'Idle';
  } else if (!pathResult.found) {
    aiStatus = 'Stuck'; // Hill Climbing or disconnected route
  } else if (pathResult.found && pathResult.path.length > 0) {
    aiStatus = 'Chasing';
  }

  const telemetry: AITelemetry = {
    algorithm: metadata.id,
    searchType: metadata.searchType,
    heuristic: metadata.heuristic,
    dataStructure: metadata.dataStructure,
    optimality: metadata.optimal,
    exploredNodes: pathResult.exploredNodes,
    pathLength: pathResult.pathLength,
    status: aiStatus,
    path: pathResult.path,
    exploredCells: pathResult.exploredCells,
  };

  return { telemetry, pathResult };
}

/**
 * Persist game result to localStorage matching Step 2, 3, and 4 requirements
 */
export function saveMatchResult(
  score: number,
  moves: number,
  formattedTime: string,
  result: 'Won' | 'Lost',
  trapsTriggered: number,
  pathLength: number,
  exploredNodes: number,
  algorithm: AlgorithmType = 'A*'
): void {
  try {
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const resultData: GameResultData = {
        score,
        moves,
        time: formattedTime,
        trapsTriggered,
        result,
        algorithm,
        pathLength,
        exploredNodes,
        status: result === 'Won' ? 'Completed' : 'Defeated',
        algorithmPerformance: `${algorithm} Search (Path: ${pathLength} steps, Nodes Explored: ${exploredNodes})`,
        completedAt: new Date().toISOString(),
      };
      window.localStorage.setItem('ai_maze_last_result', JSON.stringify(resultData));
    }
  } catch {
    // Graceful fallback for non-storage environments
  }
}
