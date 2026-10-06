'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Position, PathResult, AITelemetry, DifficultyLevel, AlgorithmType } from '@/types/game';
import { 
  isInBounds, 
  isWall, 
  buildMazeGrid 
} from '@/lib/mazeData';
import { 
  createInitialGameState, 
  computeAITelemetry, 
  saveMatchResult, 
  InternalGameState 
} from '@/lib/gameEngine';

export const DIFFICULTY_SPEEDS: Record<DifficultyLevel, number> = {
  easy: 700,
  normal: 450,
  hard: 250,
};

export function useMazeGame() {
  const [gameState, setGameState] = useState<InternalGameState>(createInitialGameState);
  const [selectedAlgorithm, setSelectedAlgorithmState] = useState<AlgorithmType>('A*');
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('normal');
  const [showAiPath, setShowAiPath] = useState<boolean>(true);
  const [showExploredNodes, setShowExploredNodes] = useState<boolean>(false);

  // Real telemetry tracking for selected algorithm
  const [telemetry, setTelemetry] = useState<AITelemetry>(() => {
    const { telemetry } = computeAITelemetry(
      gameState.enemyPos,
      gameState.playerPos,
      gameState.status,
      'A*'
    );
    return telemetry;
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const aiIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const selectedAlgorithmRef = useRef<AlgorithmType>(selectedAlgorithm);
  selectedAlgorithmRef.current = selectedAlgorithm;

  // Format seconds to MM:SS
  const formatTime = (totalSeconds: number): string => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formattedTime = formatTime(gameState.timeSeconds);

  // Recompute path and telemetry using current or specified algorithm
  const refreshTelemetry = useCallback((
    enemy: Position,
    player: Position,
    status: 'ready' | 'playing' | 'won' | 'lost',
    algo: AlgorithmType = selectedAlgorithmRef.current
  ) => {
    const { telemetry: nextTelemetry, pathResult } = computeAITelemetry(enemy, player, status, algo);
    setTelemetry(nextTelemetry);
    return pathResult;
  }, []);

  // Switch Algorithm dynamically without resetting game progress
  const changeAlgorithm = useCallback((newAlgo: AlgorithmType) => {
    setSelectedAlgorithmState(newAlgo);
    selectedAlgorithmRef.current = newAlgo;

    // Immediately re-run the newly selected algorithm from current positions
    const { telemetry: nextTelemetry } = computeAITelemetry(
      gameState.enemyPos,
      gameState.playerPos,
      gameState.status,
      newAlgo
    );
    setTelemetry(nextTelemetry);

    // Update notification
    setGameState((prev) => ({
      ...prev,
      notification: {
        text: `Switched AI Algorithm to ${newAlgo}. Recalculating search path...`,
        type: 'info',
      },
    }));
  }, [gameState.enemyPos, gameState.playerPos, gameState.status]);

  // Timer Effect
  useEffect(() => {
    if (gameState.status === 'playing') {
      timerRef.current = setInterval(() => {
        setGameState((prev) => ({
          ...prev,
          timeSeconds: prev.timeSeconds + 1,
        }));
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState.status]);

  // AI Chasing Loop Effect using the Selected Algorithm
  useEffect(() => {
    if (gameState.status === 'playing') {
      const speed = DIFFICULTY_SPEEDS[difficulty];

      aiIntervalRef.current = setInterval(() => {
        setGameState((prevState) => {
          if (prevState.status !== 'playing') return prevState;

          const currentAlgo = selectedAlgorithmRef.current;

          // 1. Calculate fresh path using the currently selected algorithm
          const { pathResult, telemetry: nextTelemetry } = computeAITelemetry(
            prevState.enemyPos,
            prevState.playerPos,
            prevState.status,
            currentAlgo
          );

          // Update telemetry state
          setTelemetry(nextTelemetry);

          // If algorithm could not find path (e.g. Hill Climbing dead end)
          if (!pathResult.found || pathResult.path.length <= 1) {
            if (currentAlgo === 'Hill Climbing') {
              return {
                ...prevState,
                notification: {
                  text: '⚠️ Hill Climbing Trapped! Local search reached a local optimum (dead end).',
                  type: 'warning',
                },
              };
            }
            return prevState;
          }

          // 2. Advance AI one cell along the calculated path
          const nextStep = pathResult.path[1];

          // 3. Collision check: Did AI catch the player?
          if (nextStep.row === prevState.playerPos.row && nextStep.col === prevState.playerPos.col) {
            const finalTime = formatTime(prevState.timeSeconds);
            saveMatchResult(
              prevState.score,
              prevState.moves,
              finalTime,
              'Lost',
              prevState.trapsTriggered,
              pathResult.pathLength,
              pathResult.exploredNodes,
              currentAlgo
            );

            setTelemetry((prev) => ({ ...prev, status: 'Caught' }));

            return {
              ...prevState,
              enemyPos: nextStep,
              status: 'lost',
              notification: {
                text: `💀 AI Caught You! The ${currentAlgo} adversary intercepted your position.`,
                type: 'hazard',
              },
            };
          }

          // Step forward
          return {
            ...prevState,
            enemyPos: nextStep,
          };
        });
      }, speed);
    }

    return () => {
      if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);
    };
  }, [gameState.status, difficulty]);

  // Player Movement Handler
  const movePlayer = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    setGameState((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') {
        return prev;
      }

      let dRow = 0;
      let dCol = 0;

      switch (direction) {
        case 'up':
          dRow = -1;
          break;
        case 'down':
          dRow = 1;
          break;
        case 'left':
          dCol = -1;
          break;
        case 'right':
          dCol = 1;
          break;
      }

      const targetRow = prev.playerPos.row + dRow;
      const targetCol = prev.playerPos.col + dCol;

      // 1. Boundary & Wall collision
      if (!isInBounds(targetRow, targetCol) || isWall(targetRow, targetCol)) {
        return prev;
      }

      const currentAlgo = selectedAlgorithmRef.current;

      // 2. Collision: Did player walk directly into the AI Enemy?
      if (targetRow === prev.enemyPos.row && targetCol === prev.enemyPos.col) {
        const finalTime = formatTime(prev.timeSeconds);
        const { pathResult } = computeAITelemetry(prev.enemyPos, { row: targetRow, col: targetCol }, 'lost', currentAlgo);
        saveMatchResult(
          prev.score,
          prev.moves + 1,
          finalTime,
          'Lost',
          prev.trapsTriggered,
          pathResult.pathLength,
          pathResult.exploredNodes,
          currentAlgo
        );

        setTelemetry((t) => ({ ...t, status: 'Caught' }));

        return {
          ...prev,
          moves: prev.moves + 1,
          status: 'lost',
          notification: {
            text: `💀 AI Caught You! You stepped directly into the ${currentAlgo} adversary.`,
            type: 'hazard',
          },
        };
      }

      // Valid move
      const newPos: Position = { row: targetRow, col: targetCol };
      const nextMoves = prev.moves + 1;
      let nextScore = Math.max(0, prev.score - 5); // 5 pts deduction per step
      let nextHasKey = prev.hasKey;
      let nextKeyPos = prev.keyPos;
      let nextTreasurePos = prev.treasurePos;
      let nextTraps = prev.traps;
      let nextTrapsTriggered = prev.trapsTriggered;
      let nextNotification = prev.notification;

      // 3. Key acquisition
      if (prev.keyPos && targetRow === prev.keyPos.row && targetCol === prev.keyPos.col) {
        nextHasKey = true;
        nextKeyPos = null;
        nextScore += 100;
        nextNotification = {
          text: '🔑 Key Acquired! The Exit Gate at (8,8) is unlocked!',
          type: 'success',
        };
      }

      // 4. Treasure collection
      if (prev.treasurePos && targetRow === prev.treasurePos.row && targetCol === prev.treasurePos.col) {
        nextTreasurePos = null;
        nextScore += 500;
        nextNotification = {
          text: '💎 Treasure Found! +500 Bonus Points added to your score!',
          type: 'success',
        };
      }

      // 5. Trap collision
      const hitTrapIndex = prev.traps.findIndex((t) => t.row === targetRow && t.col === targetCol);
      if (hitTrapIndex !== -1) {
        nextScore = Math.max(0, nextScore - 200);
        nextTraps = prev.traps.filter((_, idx) => idx !== hitTrapIndex);
        nextTrapsTriggered += 1;
        nextNotification = {
          text: '⚠️ Trap Triggered! You stepped on a hazard (-200 Points)!',
          type: 'hazard',
        };
      }

      // 6. Exit Gate check
      if (targetRow === prev.exitPos.row && targetCol === prev.exitPos.col) {
        if (!nextHasKey) {
          return {
            ...prev,
            notification: {
              text: '🔒 The Exit Gate is locked! You must retrieve the Key at (1,7) first.',
              type: 'warning',
            },
          };
        } else {
          // Escaped!
          const finalScore = nextScore + 300; // Exit completion bonus
          const finalTime = formatTime(prev.timeSeconds);
          const { pathResult } = computeAITelemetry(prev.enemyPos, newPos, 'won', currentAlgo);
          saveMatchResult(
            finalScore,
            nextMoves,
            finalTime,
            'Won',
            nextTrapsTriggered,
            pathResult.pathLength,
            pathResult.exploredNodes,
            currentAlgo
          );

          setTelemetry((t) => ({ ...t, status: 'Idle' }));

          return {
            ...prev,
            playerPos: newPos,
            moves: nextMoves,
            score: finalScore,
            status: 'won',
            notification: {
              text: `🎉 Victory! You successfully evaded the ${currentAlgo} AI adversary and escaped!`,
              type: 'success',
            },
          };
        }
      }

      // Active play: Recalculate search path as player moves
      const nextStatus = prev.status === 'ready' ? 'playing' : prev.status;
      refreshTelemetry(prev.enemyPos, newPos, nextStatus, currentAlgo);

      return {
        ...prev,
        playerPos: newPos,
        moves: nextMoves,
        score: nextScore,
        hasKey: nextHasKey,
        keyPos: nextKeyPos,
        treasurePos: nextTreasurePos,
        traps: nextTraps,
        trapsTriggered: nextTrapsTriggered,
        status: nextStatus,
        notification: nextNotification,
      };
    });
  }, [refreshTelemetry]);

  // Restart / Reset game
  const restartGame = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (aiIntervalRef.current) clearInterval(aiIntervalRef.current);

    const freshState = createInitialGameState();
    setGameState(freshState);
    refreshTelemetry(freshState.enemyPos, freshState.playerPos, 'ready', selectedAlgorithmRef.current);
  }, [refreshTelemetry]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
        e.preventDefault();
      }

      if (e.repeat) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          movePlayer('up');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          movePlayer('down');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          movePlayer('left');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          movePlayer('right');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [movePlayer]);

  // Dynamic 10x10 grid with overlays
  const currentGrid = buildMazeGrid(
    gameState.playerPos,
    gameState.enemyPos,
    gameState.keyPos,
    gameState.treasurePos,
    gameState.traps,
    gameState.exitPos
  );

  return {
    gameState,
    telemetry,
    selectedAlgorithm,
    setSelectedAlgorithm: changeAlgorithm,
    difficulty,
    setDifficulty,
    showAiPath,
    setShowAiPath,
    showExploredNodes,
    setShowExploredNodes,
    movePlayer,
    restartGame,
    formattedTime,
    currentGrid,
  };
}
