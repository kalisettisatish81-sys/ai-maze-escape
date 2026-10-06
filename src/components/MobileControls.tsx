'use client';

import React, { useState, useRef } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

interface MobileControlsProps {
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  disabled?: boolean;
}

type Direction = 'up' | 'down' | 'left' | 'right';

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  disabled = false,
}) => {
  const [activeDir, setActiveDir] = useState<Direction | null>(null);
  const lastTouchTimeRef = useRef(0);

  const triggerMove = (dir: Direction) => {
    if (!disabled && onMove) {
      if (typeof window !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate(10);
        } catch {
          // Ignore vibration errors on unsupported environments
        }
      }
      onMove(dir);
    }
  };

  const handleTouchStart = (dir: Direction, e: React.TouchEvent) => {
    if (e.cancelable) {
      e.preventDefault();
    }
    lastTouchTimeRef.current = Date.now();
    setActiveDir(dir);
    triggerMove(dir);
  };

  const handleTouchEnd = () => {
    setActiveDir(null);
  };

  const handleClick = (dir: Direction, e: React.MouseEvent) => {
    // Prevent synthetic click event if touch already handled this interaction within 400ms
    if (Date.now() - lastTouchTimeRef.current < 400) {
      e.preventDefault();
      return;
    }
    triggerMove(dir);
  };

  return (
    <div className="mobile-dpad-wrapper" aria-label="Mobile D-Pad Controls">
      <div className="mobile-dpad-layout" role="group" aria-label="Directional Pad">
        {/* TOP: UP */}
        <div className="dpad-row-top">
          <button
            type="button"
            className={`mobile-dpad-btn btn-up ${activeDir === 'up' ? 'dpad-btn-pressed' : ''}`}
            aria-label="Move Up"
            disabled={disabled}
            onClick={(e) => handleClick('up', e)}
            onTouchStart={(e) => handleTouchStart('up', e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            id="dpad-up"
          >
            <ArrowUp size={26} strokeWidth={2.8} />
          </button>
        </div>

        {/* BOTTOM ROW: LEFT, DOWN, RIGHT */}
        <div className="dpad-row-bottom">
          <button
            type="button"
            className={`mobile-dpad-btn btn-left ${activeDir === 'left' ? 'dpad-btn-pressed' : ''}`}
            aria-label="Move Left"
            disabled={disabled}
            onClick={(e) => handleClick('left', e)}
            onTouchStart={(e) => handleTouchStart('left', e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            id="dpad-left"
          >
            <ArrowLeft size={26} strokeWidth={2.8} />
          </button>

          <button
            type="button"
            className={`mobile-dpad-btn btn-down ${activeDir === 'down' ? 'dpad-btn-pressed' : ''}`}
            aria-label="Move Down"
            disabled={disabled}
            onClick={(e) => handleClick('down', e)}
            onTouchStart={(e) => handleTouchStart('down', e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            id="dpad-down"
          >
            <ArrowDown size={26} strokeWidth={2.8} />
          </button>

          <button
            type="button"
            className={`mobile-dpad-btn btn-right ${activeDir === 'right' ? 'dpad-btn-pressed' : ''}`}
            aria-label="Move Right"
            disabled={disabled}
            onClick={(e) => handleClick('right', e)}
            onTouchStart={(e) => handleTouchStart('right', e)}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleTouchEnd}
            id="dpad-right"
          >
            <ArrowRight size={26} strokeWidth={2.8} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileControls;
