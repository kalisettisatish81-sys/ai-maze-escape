'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bot, Menu, X, Play, Home as HomeIcon, Award } from 'lucide-react';
import { NAV_LINKS } from '@/lib/constants';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hide website navbar on dedicated mobile game screens
  if (pathname === '/' || pathname === '/about' || pathname === '/game' || pathname === '/results') {
    return null;
  }

  const getLinkIcon = (href: string) => {
    switch (href) {
      case '/':
        return <HomeIcon size={16} />;
      case '/game':
        return <Play size={16} />;
      case '/results':
        return <Award size={16} />;
      default:
        return null;
    }
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">
          <div className="brand-icon-box">
            <Bot size={22} color="#00f0ff" />
          </div>
          <span className="brand-title">AI Maze Escape</span>
        </Link>

        {/* Desktop / Tablet Links */}
        <div className="navbar-links">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const isGame = link.href === '/game';
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''} ${isGame ? 'nav-cta-btn' : ''}`}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  {getLinkIcon(link.href)}
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div className="mobile-nav-panel open">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`nav-link ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  padding: '0.75rem 1rem',
                }}
              >
                {getLinkIcon(link.href)}
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
