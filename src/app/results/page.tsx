'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { GameResultData, AlgorithmType } from '@/types/game';
import { compareAlgorithms, AlgorithmComparisonResult } from '@/lib/algorithms';
import { 
  Trophy, 
  Skull, 
  Play, 
  Home, 
  Clock, 
  Footprints, 
  Cpu, 
  Compass, 
  GitMerge, 
  TrendingUp, 
  Sparkles,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function ResultsPage() {
  const [result, setResult] = useState<GameResultData | null>(null);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
        const stored = window.localStorage.getItem('ai_maze_last_result');
        if (stored) {
          setResult(JSON.parse(stored));
        }
      }
    } catch {
      // Graceful fallback for non-storage environments
    }
  }, []);

  // Execute genuine algorithm benchmark comparison on the maze
  const comparisonResults: AlgorithmComparisonResult[] = useMemo(() => {
    return compareAlgorithms();
  }, []);

  const isWon = result?.result === 'Won';
  const isLost = result?.result === 'Lost';
  const currentAlgorithm: AlgorithmType = (result?.algorithm as AlgorithmType) || 'A*';

  const scoreDisplay = result ? result.score : 1000;
  const movesDisplay = result ? result.moves : 0;
  const timeDisplay = result ? (result.time.includes(':') ? result.time : `00:${result.time}`) : '00:00';

  const getAlgoFullName = (algo: string): string => {
    switch (algo) {
      case 'A*':
        return 'A* SEARCH';
      case 'BFS':
        return 'BFS (BREADTH FIRST)';
      case 'DFS':
        return 'DFS (DEPTH FIRST)';
      case 'Hill Climbing':
        return 'HILL CLIMBING';
      default:
        return `${algo.toUpperCase()} SEARCH`;
    }
  };

  return (
    <div className="result-game-wrapper">
      <div className={`result-game-card ${isWon ? 'result-won' : isLost ? 'result-lost' : ''}`}>
        {/* APP BRAND HEADER */}
        <div className="result-app-title">
          AI MAZE ESCAPE
        </div>

        {/* 1. RESULT STATUS EMBLEM & TITLE */}
        <div 
          className={`result-status-emblem ${isWon ? 'emblem-won' : 'emblem-lost'}`}
          aria-hidden="true"
        >
          {isWon ? (
            <Trophy size={40} color="var(--neon-green)" />
          ) : (
            <Skull size={40} color="var(--neon-red)" />
          )}
        </div>

        <h1 
          className={`result-status-title ${isWon ? 'title-won' : 'title-lost'}`}
          id="result-heading"
        >
          {isWon ? 'YOU ESCAPED!' : isLost ? 'GAME OVER' : 'MATCH COMPLETE'}
        </h1>

        <p className="result-status-subtitle">
          {isWon 
            ? 'Maze completed successfully' 
            : isLost 
              ? 'Caught by the AI enemy' 
              : 'Match analysis'}
        </p>

        {/* 2. FINAL SCORE */}
        <div className="result-score-box">
          <span className="result-score-label">FINAL SCORE</span>
          <span className="result-score-val" id="final-score-val">
            {scoreDisplay}
          </span>
        </div>

        {/* 3. GAME STATISTICS & 4. AI ALGORITHM */}
        <div className="result-stats-panel" aria-label="Match Statistics">
          <div className="result-stats-row">
            <div className="result-stat-chip">
              <span className="result-stat-label">
                <Clock size={12} style={{ display: 'inline', marginRight: 4 }} />
                TIME
              </span>
              <span className="result-stat-val" style={{ color: 'var(--neon-green)' }}>
                {timeDisplay}
              </span>
            </div>

            <div className="result-stat-chip">
              <span className="result-stat-label">
                <Footprints size={12} style={{ display: 'inline', marginRight: 4 }} />
                MOVES
              </span>
              <span className="result-stat-val" style={{ color: 'var(--neon-amber)' }}>
                {movesDisplay}
              </span>
            </div>
          </div>

          <div className="result-algo-banner">
            <div>
              <div className="result-algo-title">AI ALGORITHM</div>
              <div className="result-algo-name">
                {getAlgoFullName(currentAlgorithm)}
              </div>
            </div>
            <div style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(0, 240, 255, 0.12)', border: '1px solid var(--border-neon-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} color="var(--neon-cyan)" />
            </div>
          </div>
        </div>

        {/* 5. PLAY AGAIN & 6. HOME BUTTONS */}
        <div className="result-actions-group" role="navigation" aria-label="Post-Match Navigation">
          <Link
            href="/game"
            className="game-btn-play"
            id="btn-play-again"
            aria-label="Play Again and Enter Maze"
          >
            <Play size={20} fill="currentColor" />
            <span>PLAY AGAIN</span>
          </Link>

          <Link
            href="/"
            className="game-btn-about"
            id="btn-home"
            aria-label="Return to Home Screen"
          >
            <Home size={18} />
            <span>HOME</span>
          </Link>
        </div>

        {/* 7. COMPACT ALGORITHM COMPARISON / BENCHMARK */}
        <div className="result-comparison-panel">
          <button
            type="button"
            onClick={() => setShowComparison(!showComparison)}
            style={{ 
              width: '100%', 
              background: 'transparent', 
              border: 'none', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              color: 'inherit',
              padding: 0
            }}
            aria-expanded={showComparison}
            aria-controls="algo-performance-list"
          >
            <span className="result-comparison-title">
              ALGORITHM PERFORMANCE
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.72rem', color: 'var(--neon-cyan)', fontWeight: 700 }}>
              {showComparison ? 'HIDE' : 'VIEW'}
              {showComparison ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </span>
          </button>

          {showComparison && (
            <div id="algo-performance-list" style={{ marginTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {comparisonResults.map((item) => {
                const isSelected = item.algorithm === currentAlgorithm;
                const isStuck = !item.found;

                return (
                  <div 
                    key={item.algorithm} 
                    className={`result-comparison-item ${isSelected ? 'active-item' : ''}`}
                  >
                    <div className="result-item-name">
                      {item.algorithm === 'BFS' && <Compass size={14} color="var(--neon-cyan)" />}
                      {item.algorithm === 'DFS' && <GitMerge size={14} color="var(--neon-pink)" />}
                      {item.algorithm === 'Hill Climbing' && <TrendingUp size={14} color="var(--neon-amber)" />}
                      {item.algorithm === 'A*' && <Sparkles size={14} color="var(--neon-green)" />}
                      <span>{item.algorithm}</span>
                      {isSelected && (
                        <span style={{ fontSize: '0.62rem', background: 'var(--neon-cyan)', color: '#000', fontWeight: 800, padding: '0.1rem 0.35rem', borderRadius: '4px' }}>
                          MATCH
                        </span>
                      )}
                    </div>

                    <div className="result-item-stats">
                      {isStuck ? (
                        <span style={{ color: 'var(--neon-amber)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                          <AlertTriangle size={12} /> Stuck
                        </span>
                      ) : (
                        <span>{item.pathLength} steps</span>
                      )}
                      <span>•</span>
                      <span>{item.exploredNodes} nodes</span>
                    </div>
                  </div>
                );
              })}

              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.4rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', lineHeight: 1.4 }}>
                Calculated in real-time across all 4 algorithms on this 10×10 maze layout.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
