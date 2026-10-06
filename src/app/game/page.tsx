'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Settings, RotateCcw, X, Sparkles, AlertTriangle, Info, Bot } from 'lucide-react';
import GameHUD from '@/components/GameHUD';
import GameBoard from '@/components/GameBoard';
import MobileControls from '@/components/MobileControls';
import { useMazeGame } from '@/hooks/useMazeGame';
import { AlgorithmType, DifficultyLevel } from '@/types/game';

const ALGORITHM_TABS: { id: AlgorithmType; label: string }[] = [
  { id: 'BFS', label: 'BFS' },
  { id: 'DFS', label: 'DFS' },
  { id: 'Hill Climbing', label: 'Hill Climb' },
  { id: 'A*', label: 'A* Search' },
];

export default function GamePage() {
  const {
    gameState,
    telemetry,
    selectedAlgorithm,
    setSelectedAlgorithm,
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
  } = useMazeGame();

  const [settingsOpen, setSettingsOpen] = useState(false);
  const isGameOver = gameState.status === 'won' || gameState.status === 'lost';

  return (
    <div className="mobile-game-wrapper">
      <div className="mobile-game-screen">
        {/* 1. TOP GAME BAR */}
        <header className="mobile-top-bar" aria-label="Game Bar">
          <Link 
            href="/" 
            className="top-bar-btn" 
            aria-label="Back to Home Screen"
            id="btn-back-home"
          >
            <ArrowLeft size={20} />
          </Link>

          <h1 className="top-bar-title" id="game-arena-title">
            AI MAZE ESCAPE
          </h1>

          <div className="top-bar-actions">
            <button
              type="button"
              onClick={restartGame}
              className="top-bar-btn"
              aria-label="Restart Maze Match"
              title="Restart Game"
              id="btn-quick-restart"
            >
              <RotateCcw size={17} />
            </button>
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="top-bar-btn"
              aria-label="Open Game Settings"
              title="Game Settings"
              id="btn-settings"
            >
              <Settings size={18} />
            </button>
          </div>
        </header>

        {/* 2. GAME HUD BAR */}
        <GameHUD
          score={gameState.score}
          moves={gameState.moves}
          time={formattedTime}
          hasKey={gameState.hasKey}
        />

        {/* COMPACT NOTIFICATION TOAST (IF PRESENT) */}
        {gameState.notification && (
          <div className={`compact-notification notification-${gameState.notification.type}`} role="status">
            {gameState.notification.type === 'hazard' && <AlertTriangle size={14} />}
            {gameState.notification.type === 'success' && <Sparkles size={14} />}
            {gameState.notification.type === 'warning' && <AlertTriangle size={14} />}
            {gameState.notification.type === 'info' && <Info size={14} />}
            <span>{gameState.notification.text}</span>
          </div>
        )}

        {/* 3. MAZE BOARD */}
        <main className="mobile-maze-main">
          <GameBoard
            grid={currentGrid}
            status={gameState.status}
            isCompleted={gameState.status === 'won'}
            score={gameState.score}
            moves={gameState.moves}
            time={formattedTime}
            onRestart={restartGame}
            pathOverlay={telemetry.path}
            showAiPath={showAiPath}
            exploredOverlay={telemetry.exploredCells}
            showExploredNodes={showExploredNodes}
            algorithmName={selectedAlgorithm}
          />
        </main>

        {/* 5. AI ALGORITHM SELECTOR & STATUS PANEL */}
        <section className="mobile-algo-bar" aria-label="AI Search Algorithm Selection">
          <div className="algo-bar-label">
            <Bot size={14} color="var(--neon-cyan)" />
            <span>AI: <strong style={{ color: 'var(--neon-cyan)' }}>{selectedAlgorithm}</strong></span>
          </div>
          
          <div className="algo-pill-group" role="radiogroup" aria-label="Select AI Algorithm">
            {ALGORITHM_TABS.map((algo) => {
              const isSelected = selectedAlgorithm === algo.id;
              return (
                <button
                  key={algo.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => setSelectedAlgorithm(algo.id)}
                  className={`algo-pill-btn ${isSelected ? 'active' : ''}`}
                  id={`algo-tab-${algo.id.toLowerCase().replace(/[\s*]+/g, '-')}`}
                  aria-label={`Select ${algo.label} Algorithm`}
                >
                  {algo.label}
                </button>
              );
            })}
          </div>
        </section>

        {/* 6. MOBILE CONTROLS (D-PAD) */}
        <MobileControls onMove={movePlayer} disabled={isGameOver || settingsOpen} />

        {/* FUNCTIONAL SETTINGS MODAL */}
        {settingsOpen && (
          <div className="settings-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="settings-heading">
            <div className="settings-modal-card">
              <div className="settings-modal-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Settings size={18} color="var(--neon-cyan)" />
                  <h2 id="settings-heading" style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff' }}>
                    GAME SETTINGS
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="top-bar-btn"
                  aria-label="Close Settings"
                >
                  <X size={18} />
                </button>
              </div>

              {/* AI Pursuit Speed */}
              <div className="settings-option-group">
                <label className="settings-option-label">AI PURSUIT SPEED</label>
                <div className="settings-diff-buttons">
                  {(['easy', 'normal', 'hard'] as DifficultyLevel[]).map((level) => {
                    const isSelected = difficulty === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setDifficulty(level)}
                        className={`settings-pill-btn ${isSelected ? 'active' : ''}`}
                      >
                        {level.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visualization Toggles */}
              <div className="settings-option-group">
                <label className="settings-option-label">VISUALIZATIONS</label>
                <label className="settings-toggle-row">
                  <span>Show AI Path Trail</span>
                  <input
                    type="checkbox"
                    checked={showAiPath}
                    onChange={(e) => setShowAiPath(e.target.checked)}
                    aria-label="Toggle AI Path Visualization"
                    className="settings-checkbox"
                  />
                </label>
                <label className="settings-toggle-row">
                  <span>Show Explored Nodes</span>
                  <input
                    type="checkbox"
                    checked={showExploredNodes}
                    onChange={(e) => setShowExploredNodes(e.target.checked)}
                    aria-label="Toggle Explored Nodes Visualization"
                    className="settings-checkbox"
                  />
                </label>
              </div>

              {/* Actions: Restart & Close */}
              <div className="settings-modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    restartGame();
                    setSettingsOpen(false);
                  }}
                  className="game-modal-btn btn-restart"
                  style={{ width: '100%', marginBottom: '0.5rem' }}
                >
                  <RotateCcw size={16} />
                  <span>RESET MAZE MATCH</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="game-btn-back"
                  style={{ minHeight: '44px', fontSize: '0.92rem' }}
                >
                  DONE
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
