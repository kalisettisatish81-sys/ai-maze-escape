import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Cpu } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About | AI Maze Escape',
  description: 'Learn about AI Maze Escape and the artificial intelligence algorithms used in the game.',
};

const ALGORITHMS_LIST = [
  { name: 'BFS', desc: 'Breadth First Search', color: 'var(--neon-cyan)' },
  { name: 'DFS', desc: 'Depth First Search', color: 'var(--neon-pink)' },
  { name: 'Hill Climbing', desc: 'Heuristic Local Search', color: 'var(--neon-amber)' },
  { name: 'A* Search', desc: 'Optimal Heuristic Search', color: 'var(--neon-green)' },
];

export default function AboutPage() {
  return (
    <div className="mobile-game-container">
      <div className="mobile-game-card">
        {/* About Screen Icon */}
        <div className="game-icon-visual" aria-hidden="true" style={{ width: 72, height: 72, marginBottom: '1.25rem' }}>
          <Cpu size={36} color="var(--neon-cyan)" />
        </div>

        {/* Title */}
        <h1 className="game-title-text" style={{ fontSize: 'clamp(1.75rem, 5.5vw, 2.1rem)', marginBottom: '0.75rem' }}>
          AI Maze Escape
        </h1>

        {/* Short Description */}
        <p className="game-subtitle-text" style={{ marginBottom: '1.75rem', maxWidth: '360px' }}>
          AI Maze Escape is an AI-powered maze game where you navigate through a dangerous maze while an intelligent enemy searches for you.
        </p>

        {/* AI Algorithms Section */}
        <div style={{ width: '100%', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ height: 1, width: 24, background: 'var(--border-neon-cyan)' }} />
            <h2 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--neon-cyan)' }}>
              AI Algorithms
            </h2>
            <span style={{ height: 1, width: 24, background: 'var(--border-neon-cyan)' }} />
          </div>

          <div className="about-algorithms-list">
            {ALGORITHMS_LIST.map((algo) => (
              <div key={algo.name} className="about-algo-item">
                <span
                  className="about-algo-dot"
                  style={{ background: algo.color, boxShadow: `0 0 8px ${algo.color}` }}
                />
                <div className="about-algo-text">
                  <span className="about-algo-name">{algo.name}</span>
                  {algo.desc ? ` — ${algo.desc}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <div style={{ width: '100%' }}>
          <Link
            href="/"
            className="game-btn-back"
            id="btn-back"
            aria-label="Return to Home screen"
          >
            <ArrowLeft size={18} />
            <span>← Back</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
