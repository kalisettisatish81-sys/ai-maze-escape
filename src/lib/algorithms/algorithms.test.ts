import { 
  findAStarPath, 
  findBFSPath, 
  findDFSPath, 
  findHillClimbingPath, 
  executeSearchAlgorithm, 
  getAlgorithmMetadata,
  ALGORITHM_REGISTRY,
  compareAlgorithms
} from './index';
import { 
  INITIAL_PLAYER_POS, 
  INITIAL_ENEMY_POS, 
  isWall, 
  isInBounds 
} from '../mazeData';
import { Position, PathResult, AlgorithmType } from '../../types/game';

interface TestAssertion {
  name: string;
  passed: boolean;
  message?: string;
}

export function runFullAlgorithmTestSuite(): { passed: number; failed: number; results: TestAssertion[] } {
  const results: TestAssertion[] = [];

  const assert = (condition: boolean, name: string, failureMessage?: string) => {
    results.push({
      name,
      passed: condition,
      message: condition ? undefined : (failureMessage || 'Assertion failed'),
    });
  };

  // Helper to verify path validity (continuous 4-way walk, no walls, in bounds)
  const verifyPathValidity = (path: Position[], expectedStart: Position, expectedTarget: Position) => {
    if (path.length === 0) return false;
    if (path[0].row !== expectedStart.row || path[0].col !== expectedStart.col) return false;
    if (path[path.length - 1].row !== expectedTarget.row || path[path.length - 1].col !== expectedTarget.col) return false;

    for (let i = 0; i < path.length; i++) {
      const cell = path[i];
      if (!isInBounds(cell.row, cell.col) || isWall(cell.row, cell.col)) {
        return false;
      }
      if (i > 0) {
        const prev = path[i - 1];
        const stepDist = Math.abs(cell.row - prev.row) + Math.abs(cell.col - prev.col);
        if (stepDist !== 1) return false; // Exactly 1 step cardinal
      }
    }
    return true;
  };

  // ==========================================
  // 1. A* TESTS
  // ==========================================
  const astarResult = findAStarPath(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(astarResult.found, 'A* 1. Finds path between AI (8,7) and Player (1,1)');
  assert(verifyPathValidity(astarResult.path, INITIAL_ENEMY_POS, INITIAL_PLAYER_POS), 'A* 2. Path is valid, continuous, and within boundaries');
  assert(astarResult.exploredNodes > 0, 'A* 3. Explored nodes tracked');

  // ==========================================
  // 2. BFS TESTS
  // ==========================================
  const bfsResult = findBFSPath(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(bfsResult.found, 'BFS 1. Finds path between AI (8,7) and Player (1,1)');
  assert(verifyPathValidity(bfsResult.path, INITIAL_ENEMY_POS, INITIAL_PLAYER_POS), 'BFS 2. Path is valid, continuous, and within boundaries');
  assert(bfsResult.pathLength === astarResult.pathLength, 'BFS 3. Finds identical optimal shortest path length as A* in uniform grid');
  assert(bfsResult.exploredNodes > 0, 'BFS 4. Tracks explored nodes via FIFO queue');
  const walledBFS = findBFSPath(INITIAL_ENEMY_POS, { row: 0, col: 0 });
  assert(!walledBFS.found && walledBFS.path.length === 0, 'BFS 5. Safely handles unreachable walled cell');

  // ==========================================
  // 3. DFS TESTS
  // ==========================================
  const dfsResult = findDFSPath(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(dfsResult.found, 'DFS 1. Finds path between AI (8,7) and Player (1,1)');
  assert(verifyPathValidity(dfsResult.path, INITIAL_ENEMY_POS, INITIAL_PLAYER_POS), 'DFS 2. Path is valid, continuous, and within boundaries');
  assert(dfsResult.exploredNodes > 0, 'DFS 3. Tracks explored nodes via LIFO stack');
  const walledDFS = findDFSPath(INITIAL_ENEMY_POS, { row: 0, col: 0 });
  assert(!walledDFS.found && walledDFS.path.length === 0, 'DFS 4. Safely handles unreachable walled cell');

  // ==========================================
  // 4. HILL CLIMBING TESTS
  // ==========================================
  // In an open straight corridor, Hill Climbing should reach the goal
  const openStart: Position = { row: 1, col: 2 };
  const openTarget: Position = { row: 1, col: 6 };
  const hcStraight = findHillClimbingPath(openStart, openTarget);
  assert(hcStraight.found, 'Hill Climbing 1. Reaches target when heuristic strictly decreases monotonically');
  assert(hcStraight.path.length === 5, 'Hill Climbing 2. Path directly follows minimum Manhattan distance');

  // When facing complex maze with walls/dead ends, Hill Climbing halts at local optimum
  const hcComplex = findHillClimbingPath(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(
    hcComplex.path.length > 0 && hcComplex.exploredNodes > 0,
    'Hill Climbing 3. Evaluates greedy local steps and halts when no neighbor improves heuristic'
  );

  // ==========================================
  // 5. CENTRAL DISPATCHER & REGISTRY TESTS
  // ==========================================
  const algos: AlgorithmType[] = ['BFS', 'DFS', 'Hill Climbing', 'A*'];
  algos.forEach((algo) => {
    const meta = getAlgorithmMetadata(algo);
    assert(meta !== undefined && meta.id === algo, `Dispatcher 1. Correct metadata registered for ${algo}`);

    const res = executeSearchAlgorithm(algo, { row: 1, col: 2 }, { row: 1, col: 4 });
    assert(res.found && res.path.length > 0, `Dispatcher 2. executeSearchAlgorithm cleanly executes ${algo}`);
  });

  // ==========================================
  // 6. ALGORITHM COMPARISON UTILITY TESTS (Step 5)
  // ==========================================
  const comparisons = compareAlgorithms(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(comparisons.length === 4, 'Comparison 1. Returns genuine metrics for all 4 algorithms');

  const bfsRow = comparisons.find((c) => c.algorithm === 'BFS');
  const dfsRow = comparisons.find((c) => c.algorithm === 'DFS');
  const hcRow = comparisons.find((c) => c.algorithm === 'Hill Climbing');
  const astarRow = comparisons.find((c) => c.algorithm === 'A*');

  assert(bfsRow !== undefined && bfsRow.found && bfsRow.pathLength !== null, 'Comparison 2. BFS has genuine path length');
  assert(dfsRow !== undefined && dfsRow.found && dfsRow.pathLength !== null, 'Comparison 3. DFS has genuine path length');
  assert(hcRow !== undefined && hcRow.exploredNodes > 0, 'Comparison 4. Hill Climbing explored nodes tracked even when stuck');
  assert(astarRow !== undefined && astarRow.found && astarRow.pathLength === bfsRow?.pathLength, 'Comparison 5. A* and BFS find optimal path length');
  assert(astarRow !== undefined && astarRow.pathLength !== null && astarRow.pathLength <= (dfsRow?.pathLength ?? 999), 'Comparison 6. A* path length is optimal (<= DFS)');

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return {
    passed: passedCount,
    failed: failedCount,
    results,
  };
}
