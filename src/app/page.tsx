import React from 'react';
import Link from 'next/link';
import { Play, Info, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="mobile-game-container">
      <div className="mobile-game-card">
        {/* Game Icon / Visual Emblem */}
        <div className="game-icon-visual" aria-hidden="true">
          <span style={{ fontSize: '2.5rem', lineHeight: 1, filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.6))' }}>
            🧩
          </span>
        </div>

        {/* Game Title */}
        <h1 className="game-title-text" id="game-title">
          AI Maze Escape
        </h1>

        {/* Subtitle */}
        <p className="game-subtitle-text">
          Escape the maze. Outsmart the AI.
        </p>

        {/* Action Buttons */}
        <div className="game-actions-group" role="navigation" aria-label="Game Start Navigation">
          <Link
            href="/game"
            className="game-btn-play"
            id="btn-play"
            aria-label="Start Game and Enter Maze"
          >
            <Play size={22} fill="currentColor" />
            <span>PLAY</span>
          </Link>

          <Link
            href="/about"
            className="game-btn-about"
            id="btn-about"
            aria-label="About AI Maze Escape"
          >
            <Info size={19} />
            <span>ABOUT</span>
          </Link>
        </div>

        {/* Small Game Information */}
        <div className="game-footer-info">
          <Sparkles size={13} color="var(--neon-cyan)" />
          <span>AI Powered Maze Adventure</span>
        </div>
      </div>
    </div>
  );
}
