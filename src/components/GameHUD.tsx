import React from 'react';
import { GameHUDProps } from '@/types/game';
import { Key } from 'lucide-react';

export const GameHUD: React.FC<GameHUDProps> = ({
  score = 1000,
  moves = 0,
  time = '00:00',
  hasKey = false,
}) => {
  return (
    <div className="mobile-hud-bar" role="region" aria-label="Game Stats Bar">
      {/* TIME */}
      <div className="mobile-hud-item">
        <span className="mobile-hud-label">TIME</span>
        <span className="mobile-hud-value mobile-hud-time">{time}</span>
      </div>

      {/* MOVES */}
      <div className="mobile-hud-item">
        <span className="mobile-hud-label">MOVES</span>
        <span className="mobile-hud-value mobile-hud-moves">{moves}</span>
      </div>

      {/* SCORE */}
      <div className="mobile-hud-item">
        <span className="mobile-hud-label">SCORE</span>
        <span className="mobile-hud-value mobile-hud-score">{score}</span>
      </div>

      {/* KEY STATUS (SUBTLE COMPACT CHIP) */}
      <div 
        className={`mobile-hud-key-badge ${hasKey ? 'has-key' : 'needs-key'}`}
        title={hasKey ? 'Key collected! Exit gate is unlocked.' : 'Find the key to unlock the exit gate.'}
        aria-label={hasKey ? 'Key collected' : 'Key required'}
      >
        <Key size={14} />
        <span>{hasKey ? 'KEY ✓' : 'KEY 🔒'}</span>
      </div>
    </div>
  );
};

export default GameHUD;
