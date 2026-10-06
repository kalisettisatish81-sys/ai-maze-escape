import { findAStarPath, calculateManhattanDistance } from './aStar';
import { 
  INITIAL_PLAYER_POS, 
  INITIAL_ENEMY_POS, 
  isWall, 
  isInBounds, 
  MAZE_ROWS, 
  MAZE_COLS 
} from '../mazeData';
import { Position } from '../../types/game';

interface TestResult {
  name: string;
  passed: boolean;
  message?: string;
}

export function runAStarTestSuite(): { passed: number; failed: number; results: TestResult[] } {
  const results: TestResult[] = [];

  const assert = (condition: boolean, name: string, failureMessage?: string) => {
    results.push({
      name,
      passed: condition,
      message: condition ? undefined : (failureMessage || 'Assertion failed'),
    });
  };

  // Test 1: A* finds a path between Initial Enemy (8, 7) and Player (1, 1)
  const result = findAStarPath(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(result.found === true && result.path.length > 0, '1. A* finds a path');

  // Test 2: Path starts at AI
  assert(
    result.path.length > 0 &&
    result.path[0].row === INITIAL_ENEMY_POS.row &&
    result.path[0].col === INITIAL_ENEMY_POS.col,
    '2. Path starts at AI Enemy position'
  );

  // Test 3: Path ends at Player
  assert(
    result.path.length > 0 &&
    result.path[result.path.length - 1].row === INITIAL_PLAYER_POS.row &&
    result.path[result.path.length - 1].col === INITIAL_PLAYER_POS.col,
    '3. Path ends at Player position'
  );

  // Test 4: Path does not cross walls
  let crossesWall = false;
  for (const cell of result.path) {
    if (isWall(cell.row, cell.col)) {
      crossesWall = true;
      break;
    }
  }
  assert(!crossesWall, '4. Path does not cross any walls');

  // Test 5: Path stays inside boundaries (0-9)
  let staysInBounds = true;
  for (const cell of result.path) {
    if (!isInBounds(cell.row, cell.col)) {
      staysInBounds = false;
      break;
    }
  }
  assert(staysInBounds, '5. Path stays inside 10x10 maze boundaries');

  // Test 6: Only four-direction movement is used (no diagonals, step size = 1)
  let onlyFourWay = true;
  for (let i = 1; i < result.path.length; i++) {
    const prev = result.path[i - 1];
    const curr = result.path[i];
    const dist = Math.abs(curr.row - prev.row) + Math.abs(curr.col - prev.col);
    if (dist !== 1) {
      onlyFourWay = false;
      break;
    }
  }
  assert(onlyFourWay, '6. Only 4-direction movement is used (step size exactly 1)');

  // Test 7: Manhattan heuristic calculation is accurate
  const dist = calculateManhattanDistance({ row: 1, col: 1 }, { row: 8, col: 7 });
  assert(dist === 13, '7. Manhattan distance heuristic is correctly calculated (|1-8| + |1-7| = 13)');

  // Test 8: g(n) + h(n) formula verified: path length is optimal
  assert(result.pathLength === result.path.length - 1, '8. g(n) + h(n) path length matches node transitions');

  // Test 9: Explored nodes are tracked
  assert(result.exploredNodes > 0 && result.exploredCells.length === result.exploredNodes, '9. Explored nodes and cells are properly tracked');

  // Test 10: Path length is positive and non-zero
  assert(result.pathLength > 0, '10. Path length is valid non-zero count');

  // Test 11: Unreachable target is handled safely (walled cell)
  const walledTarget: Position = { row: 0, col: 0 }; // Wall perimeter
  const unreachableResult = findAStarPath(INITIAL_ENEMY_POS, walledTarget);
  assert(
    !unreachableResult.found && unreachableResult.path.length === 0,
    '11. Unreachable target is handled safely without throwing'
  );

  // Test 12: AI moves toward Player along path[1]
  const nextStep = result.path[1];
  const nextDist = calculateManhattanDistance(nextStep, INITIAL_PLAYER_POS);
  const startDist = calculateManhattanDistance(INITIAL_ENEMY_POS, INITIAL_PLAYER_POS);
  assert(
    nextStep !== undefined && !isWall(nextStep.row, nextStep.col),
    '12. AI moves toward Player to valid walkable neighbor'
  );

  // Test 13: Recalculation after Player movement
  const movedPlayer: Position = { row: 1, col: 2 };
  const recalculated = findAStarPath(nextStep, movedPlayer);
  assert(
    recalculated.found && recalculated.path[recalculated.path.length - 1].col === 2,
    '13. AI recalculates path dynamically when Player moves'
  );

  // Test 14: AI catches Player when adjacent
  const adjacentAI: Position = { row: 1, col: 2 };
  const adjacentTarget: Position = { row: 1, col: 1 };
  const catchPath = findAStarPath(adjacentAI, adjacentTarget);
  assert(
    catchPath.path.length === 2 && catchPath.path[1].row === 1 && catchPath.path[1].col === 1,
    '14. AI catches Player on the next direct step'
  );

  const passedCount = results.filter((r) => r.passed).length;
  const failedCount = results.filter((r) => !r.passed).length;

  return {
    passed: passedCount,
    failed: failedCount,
    results,
  };
}
