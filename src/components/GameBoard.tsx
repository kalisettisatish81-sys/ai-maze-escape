'use client';

import React from 'react';
import Link from 'next/link';
import { CellType, Position } from '@/types/game';
import { INITIAL_MAZE_GRID } from '@/lib/constants';
import { 
  User, 
  Bot, 
  Key, 
  Gem, 
  Flame, 
  DoorClosed, 
  Trophy,
  RotateCcw,
  Award,
  Skull
} from 'lucide-react';

interface GameBoardProps {
  grid?: CellType[][];
  status?: 'ready' | 'playing' | 'won' | 'lost';
  isCompleted?: boolean;
  score?: number;
  moves?: number;
  time?: string;
  onRestart?: () => void;
  pathOverlay?: Position[];
  showAiPath?: boolean;
  exploredOverlay?: Position[];
  showExploredNodes?: boolean;
  algorithmName?: string;
}

export const GameBoard: React.FC<GameBoardProps> = ({
  grid = INITIAL_MAZE_GRID,
  status = 'playing',
  isCompleted = false,
  score = 1000,
  moves = 0,
  time = '00:00',
  onRestart,
  pathOverlay = [],
  showAiPath = false,
  exploredOverlay = [],
  showExploredNodes = false,
  algorithmName = 'AI',
}) => {
  // Sets for quick lookup
  const pathSet = React.useMemo(() => {
    if (!showAiPath || !pathOverlay) return new Set<string>();
    return new Set(pathOverlay.map((p) => `${p.row},${p.col}`));
  }, [pathOverlay, showAiPath]);

  const exploredSet = React.useMemo(() => {
    if (!showExploredNodes || !exploredOverlay) return new Set<string>();
    return new Set(exploredOverlay.map((p) => `${p.row},${p.col}`));
  }, [exploredOverlay, showExploredNodes]);

  const renderCellContent = (type: CellType) => {
    switch (type) {
      case 'player':
        return <User size={18} color="#00ff9d" fill="rgba(0, 255, 157, 0.3)" strokeWidth={2.8} className="sprite-player" />;
      case 'enemy':
        return <Bot size={18} color="#ff007f" fill="rgba(255, 0, 127, 0.25)" strokeWidth={2.8} className="sprite-enemy" />;
      case 'key':
        return <Key size={16} color="#ffb700" fill="rgba(255, 183, 0, 0.35)" strokeWidth={2.5} className="sprite-key" />;
      case 'treasure':
        return <Gem size={16} color="#00f0ff" fill="rgba(0, 240, 255, 0.3)" strokeWidth={2.5} className="sprite-treasure" />;
      case 'trap':
        return <Flame size={16} color="#ff3366" fill="rgba(255, 51, 102, 0.35)" strokeWidth={2.5} className="sprite-trap" />;
      case 'exit':
        return <DoorClosed size={18} color="#a855f7" fill="rgba(168, 85, 247, 0.3)" strokeWidth={2.5} className="sprite-exit" />;
      default:
        return null;
    }
  };

  const isLost = status === 'lost';
  const isWon = status === 'won' || isCompleted;

  return (
    <div className="mobile-board-card">
      {/* 10x10 Maze Viewport */}
      <div className="maze-canvas-container">
        {/* Victory Overlay Modal */}
        {isWon && (
          <div className="victory-overlay" role="dialog" aria-label="Game Victory Modal">
            <div className="victory-icon-wrap">
              <Trophy size={36} color="var(--neon-green)" />
            </div>
            <h3 className="victory-title">MAZE ESCAPED!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '280px', lineHeight: 1.4 }}>
              You found the key, outsmarted <strong style={{ color: 'var(--neon-cyan)' }}>{algorithmName}</strong>, and reached the exit!
            </p>

            <div className="victory-stats">
              <div className="victory-stat-item">
                <span className="victory-stat-label">Score</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-cyan)' }}>{score}</span>
              </div>
              <div className="victory-stat-item">
                <span className="victory-stat-label">Moves</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-amber)' }}>{moves}</span>
              </div>
              <div className="victory-stat-item">
                <span className="victory-stat-label">Time</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-green)' }}>{time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {onRestart && (
                <button 
                  onClick={onRestart}
                  className="game-modal-btn btn-restart"
                  id="btn-play-again"
                >
                  <RotateCcw size={16} />
                  <span>PLAY AGAIN</span>
                </button>
              )}
              <Link 
                href="/results" 
                className="game-modal-btn btn-view-results"
                id="btn-view-results-modal"
              >
                <Award size={16} />
                <span>RESULTS</span>
              </Link>
            </div>
          </div>
        )}

        {/* Defeat Modal (AI CAUGHT YOU) */}
        {isLost && (
          <div className="victory-overlay defeat-overlay" role="dialog" aria-label="Game Defeat Modal">
            <div className="victory-icon-wrap defeat-icon-wrap">
              <Skull size={36} color="var(--neon-red)" />
            </div>
            <h3 className="victory-title" style={{ color: 'var(--neon-red)' }}>AI CAUGHT YOU!</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', maxWidth: '280px', lineHeight: 1.4 }}>
              The <strong style={{ color: 'var(--neon-pink)' }}>{algorithmName}</strong> adversary calculated your trajectory and intercepted you!
            </p>

            <div className="victory-stats">
              <div className="victory-stat-item">
                <span className="victory-stat-label">Score</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-red)' }}>{score}</span>
              </div>
              <div className="victory-stat-item">
                <span className="victory-stat-label">Moves</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-amber)' }}>{moves}</span>
              </div>
              <div className="victory-stat-item">
                <span className="victory-stat-label">Time</span>
                <span className="victory-stat-val" style={{ color: 'var(--neon-green)' }}>{time}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
              {onRestart && (
                <button 
                  onClick={onRestart}
                  className="game-modal-btn btn-try-again"
                  id="btn-try-again"
                >
                  <RotateCcw size={16} />
                  <span>TRY AGAIN</span>
                </button>
              )}
              <Link 
                href="/results" 
                className="game-modal-btn btn-view-results"
                id="btn-view-defeat-results"
              >
                <Award size={16} />
                <span>RESULTS</span>
              </Link>
            </div>
          </div>
        )}

        {/* 10x10 Grid */}
        <div className="maze-grid" role="grid" aria-label="10 by 10 Maze Grid">
          {grid.map((row, rIdx) =>
            row.map((cellType, cIdx) => {
              const key = `${rIdx},${cIdx}`;
              const isPath = pathSet.has(key) && cellType !== 'player' && cellType !== 'enemy';
              const isExplored = exploredSet.has(key) && cellType !== 'player' && cellType !== 'enemy' && !isPath;

              return (
                <div
                  key={`cell-${rIdx}-${cIdx}`}
                  className={`maze-cell cell-${cellType} ${isPath ? 'cell-ai-path' : ''} ${isExplored ? 'cell-ai-explored' : ''}`}
                  data-testid={`cell-${rIdx}-${cIdx}`}
                  aria-label={`Cell at Row ${rIdx}, Col ${cIdx}: ${cellType}${isPath ? ` (${algorithmName} Path)` : ''}`}
                >
                  {/* AI Path trail dot */}
                  {isPath && cellType === 'empty' && (
                    <span className="ai-path-dot" />
                  )}

                  {/* Render standard cell icon */}
                  {renderCellContent(cellType)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Compact Mobile Game Legend */}
      <div className="mobile-maze-legend" aria-label="Game Objects Legend">
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#00ff9d' }} /> Player</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#ff007f' }} /> AI</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#ffb700' }} /> Key</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#00f0ff' }} /> Gem</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#ff3366' }} /> Trap</span>
        <span className="legend-chip"><span className="legend-dot" style={{ background: '#9d4edd' }} /> Exit</span>
      </div>
    </div>
  );
};

export default GameBoard;
