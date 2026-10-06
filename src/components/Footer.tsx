'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Cpu, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const pathname = usePathname();

  // Hide website footer on dedicated mobile game screens
  if (pathname === '/' || pathname === '/about' || pathname === '/game' || pathname === '/results') {
    return null;
  }
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-brand">
            <Cpu size={20} color="#00f0ff" />
            <span>AI Maze Escape</span>
            <span className="footer-badge">Academic Edition</span>
          </div>

          <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
            <Link href="/" style={{ color: 'var(--text-muted)' }}>
              Home
            </Link>
            <Link href="/game" style={{ color: 'var(--text-muted)' }}>
              Game Arena
            </Link>
            <Link href="/results" style={{ color: 'var(--text-muted)' }}>
              Results
            </Link>
          </div>
        </div>

        <div className="footer-bottom">
          <div>
            Demonstration of Artificial Intelligence search algorithms (BFS, DFS, Hill Climbing, A*) in a grid maze environment.
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Terminal size={14} color="#00ff9d" /> Next.js & React
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
              <Cpu size={14} color="var(--neon-cyan)" /> Final AI Demo Edition
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
