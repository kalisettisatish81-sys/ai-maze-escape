import { Position, PathResult } from '@/types/game';
import { isWall, isInBounds, MAZE_ROWS, MAZE_COLS } from '@/lib/mazeData';

/**
 * Node structure for A* Search Algorithm
 */
interface AStarNode {
  row: number;
  col: number;
  g: number; // Cost from start to current node
  h: number; // Heuristic estimate from current node to target
  f: number; // f(n) = g(n) + h(n)
  parent: AStarNode | null;
}

/**
 * Min-Heap Priority Queue for optimal node extraction based on f(n)
 */
class PriorityQueue {
  private heap: AStarNode[] = [];

  push(node: AStarNode): void {
    this.heap.push(node);
    this.bubbleUp(this.heap.length - 1);
  }

  pop(): AStarNode | undefined {
    if (this.heap.length === 0) return undefined;
    const min = this.heap[0];
    const end = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = end;
      this.sinkDown(0);
    }
    return min;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  private bubbleUp(idx: number): void {
    const element = this.heap[idx];
    while (idx > 0) {
      const parentIdx = Math.floor((idx - 1) / 2);
      const parent = this.heap[parentIdx];
      // Compare f(n); tie-break with lower h(n)
      if (element.f < parent.f || (element.f === parent.f && element.h < parent.h)) {
        this.heap[parentIdx] = element;
        this.heap[idx] = parent;
        idx = parentIdx;
      } else {
        break;
      }
    }
  }

  private sinkDown(idx: number): void {
    const length = this.heap.length;
    const element = this.heap[idx];

    while (true) {
      let leftChildIdx = 2 * idx + 1;
      let rightChildIdx = 2 * idx + 2;
      let swapIdx: number | null = null;

      if (leftChildIdx < length) {
        const leftChild = this.heap[leftChildIdx];
        if (leftChild.f < element.f || (leftChild.f === element.f && leftChild.h < element.h)) {
          swapIdx = leftChildIdx;
        }
      }

      if (rightChildIdx < length) {
        const rightChild = this.heap[rightChildIdx];
        const compareTarget = swapIdx === null ? element : this.heap[swapIdx];
        if (rightChild.f < compareTarget.f || (rightChild.f === compareTarget.f && rightChild.h < compareTarget.h)) {
          swapIdx = rightChildIdx;
        }
      }

      if (swapIdx === null) break;
      this.heap[idx] = this.heap[swapIdx];
      this.heap[swapIdx] = element;
      idx = swapIdx;
    }
  }
}

/**
 * Calculates Manhattan distance between two points:
 * h(n) = |current.row - target.row| + |current.col - target.col|
 */
export function calculateManhattanDistance(current: Position, target: Position): number {
  return Math.abs(current.row - target.row) + Math.abs(current.col - target.col);
}

/**
 * A* Pathfinding Algorithm
 *
 * Evaluates f(n) = g(n) + h(n)
 *
 * @param start - Starting position (AI Enemy)
 * @param target - Goal position (Player)
 * @param customWallCheck - Optional custom wall checker
 * @returns PathResult containing path, found boolean, exploredNodes count, pathLength, and exploredCells
 */
export function findAStarPath(
  start: Position,
  target: Position,
  customWallCheck?: (r: number, c: number) => boolean
): PathResult {
  const checkWall = customWallCheck || isWall;

  // Edge case: start or target is out of bounds or in a wall
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

  // Edge case: already at target
  if (start.row === target.row && start.col === target.col) {
    return {
      path: [{ row: start.row, col: start.col }],
      found: true,
      exploredNodes: 1,
      pathLength: 0,
      exploredCells: [{ row: start.row, col: start.col }],
    };
  }

  const openQueue = new PriorityQueue();
  const openSetMap = new Map<string, number>(); // key -> lowest g score in open set
  const closedSet = new Set<string>();
  const exploredCells: Position[] = [];

  const startH = calculateManhattanDistance(start, target);
  const startNode: AStarNode = {
    row: start.row,
    col: start.col,
    g: 0,
    h: startH,
    f: startH,
    parent: null,
  };

  const startKey = `${start.row},${start.col}`;
  openQueue.push(startNode);
  openSetMap.set(startKey, 0);

  // 4 Cardinal Directions: Up, Down, Left, Right (No diagonals)
  const directions = [
    { dRow: -1, dCol: 0 }, // Up
    { dRow: 1, dCol: 0 },  // Down
    { dRow: 0, dCol: -1 }, // Left
    { dRow: 0, dCol: 1 },  // Right
  ];

  while (!openQueue.isEmpty()) {
    const current = openQueue.pop()!;
    const currentKey = `${current.row},${current.col}`;

    // Skip if already evaluated with lower/equal cost
    if (closedSet.has(currentKey)) {
      continue;
    }

    closedSet.add(currentKey);
    exploredCells.push({ row: current.row, col: current.col });

    // Goal Check: Reached Player
    if (current.row === target.row && current.col === target.col) {
      // Reconstruct path from AI Enemy to Player
      const path: Position[] = [];
      let currNode: AStarNode | null = current;

      while (currNode !== null) {
        path.push({ row: currNode.row, col: currNode.col });
        currNode = currNode.parent;
      }

      path.reverse();

      return {
        path,
        found: true,
        exploredNodes: exploredCells.length,
        pathLength: path.length - 1, // Number of steps
        exploredCells,
      };
    }

    // Expand neighbors in 4 directions
    for (const { dRow, dCol } of directions) {
      const neighborRow = current.row + dRow;
      const neighborCol = current.col + dCol;

      // 1. Boundary check (0-9)
      if (!isInBounds(neighborRow, neighborCol)) {
        continue;
      }

      // 2. Wall check
      if (checkWall(neighborRow, neighborCol)) {
        continue;
      }

      const neighborKey = `${neighborRow},${neighborCol}`;
      if (closedSet.has(neighborKey)) {
        continue;
      }

      const tentativeG = current.g + 1; // Movement cost per step is 1

      // If already in open set with better or equal g, skip
      const existingG = openSetMap.get(neighborKey);
      if (existingG !== undefined && tentativeG >= existingG) {
        continue;
      }

      const h = calculateManhattanDistance({ row: neighborRow, col: neighborCol }, target);
      const neighborNode: AStarNode = {
        row: neighborRow,
        col: neighborCol,
        g: tentativeG,
        h,
        f: tentativeG + h, // f(n) = g(n) + h(n)
        parent: current,
      };

      openSetMap.set(neighborKey, tentativeG);
      openQueue.push(neighborNode);
    }
  }

  // No path found
  return {
    path: [],
    found: false,
    exploredNodes: exploredCells.length,
    pathLength: 0,
    exploredCells,
  };
}
