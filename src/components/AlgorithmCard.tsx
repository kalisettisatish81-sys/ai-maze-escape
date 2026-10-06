import React from 'react';
import { AlgorithmInfo } from '@/types/game';
import { Compass, GitMerge, TrendingUp, Sparkles, CheckCircle2, XCircle, AlertTriangle, Layers, Binary, Lightbulb, Calculator } from 'lucide-react';

interface AlgorithmCardProps {
  algorithm: AlgorithmInfo;
}

export const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ algorithm }) => {
  const getAlgoIcon = (type: string) => {
    switch (type) {
      case 'BFS':
        return <Compass size={24} color={algorithm.accentColor} />;
      case 'DFS':
        return <GitMerge size={24} color={algorithm.accentColor} />;
      case 'Hill Climbing':
        return <TrendingUp size={24} color={algorithm.accentColor} />;
      case 'A*':
        return <Sparkles size={24} color={algorithm.accentColor} />;
      default:
        return <Compass size={24} color={algorithm.accentColor} />;
    }
  };

  return (
    <div 
      className="cyber-card algo-card"
      style={{
        borderTop: `3px solid ${algorithm.accentColor}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      <div>
        {/* Card Header */}
        <div className="algo-card-header">
          <div 
            className="algo-icon-box"
            style={{
              background: `${algorithm.accentColor}18`,
              border: `1px solid ${algorithm.accentColor}40`,
            }}
          >
            {getAlgoIcon(algorithm.shortName)}
          </div>
          <span 
            className="algo-badge"
            style={{
              borderColor: `${algorithm.accentColor}50`,
              color: algorithm.accentColor,
              background: `${algorithm.accentColor}10`,
            }}
          >
            {algorithm.type}
          </span>
        </div>

        {/* Algorithm Name & Short Label */}
        <div style={{ marginBottom: '1rem' }}>
          <h3 className="algo-name" style={{ marginBottom: '0.2rem' }}>{algorithm.name}</h3>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontFamily: 'var(--font-mono)' }}>
            Keyword: {algorithm.shortName}
          </span>
        </div>

        {/* Core Specs: Type, Data Structure, Heuristic */}
        <div 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.45rem', 
            background: 'rgba(0, 0, 0, 0.25)', 
            padding: '0.75rem', 
            borderRadius: '8px', 
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            marginBottom: '0.9rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Layers size={13} />
              <span>Data Structure:</span>
            </span>
            <span style={{ color: '#fff', fontWeight: '600', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
              {algorithm.dataStructure}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
              <Binary size={13} />
              <span>Heuristic:</span>
            </span>
            <span 
              style={{ 
                color: algorithm.heuristic === 'None' ? 'var(--text-dim)' : 'var(--neon-amber)', 
                fontWeight: '600' 
              }}
            >
              {algorithm.heuristic}
            </span>
          </div>

          {algorithm.formula && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.25rem', borderTop: '1px dashed var(--border-subtle)' }}>
              <span style={{ color: 'var(--text-dim)', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <Calculator size={13} />
                <span>Formula:</span>
              </span>
              <span style={{ color: 'var(--neon-cyan)', fontWeight: '700', fontFamily: 'var(--font-mono)', fontSize: '0.82rem' }}>
                {algorithm.formula}
              </span>
            </div>
          )}
        </div>

        {/* Core Idea */}
        <div style={{ marginBottom: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Lightbulb size={13} color="var(--neon-amber)" />
            <span>Idea:</span>
          </div>
          <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: '1.5' }}>
            {algorithm.idea}
          </p>
        </div>

        {/* Limitation Box (for Hill Climbing) */}
        {algorithm.limitation && (
          <div 
            style={{ 
              background: 'rgba(255, 183, 0, 0.08)', 
              border: '1px solid rgba(255, 183, 0, 0.35)', 
              borderRadius: '8px', 
              padding: '0.6rem 0.75rem',
              marginBottom: '0.9rem',
              fontSize: '0.82rem',
              color: 'var(--neon-amber)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.45rem'
            }}
          >
            <AlertTriangle size={15} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <strong>Limitation:</strong> {algorithm.limitation}
            </div>
          </div>
        )}
      </div>

      {/* Footer: Optimality Badge */}
      <div 
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.75rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
        }}
      >
        <span style={{ color: 'var(--text-dim)', fontWeight: '600' }}>Optimal:</span>
        <span 
          style={{ 
            color: algorithm.optimal ? 'var(--neon-green)' : 'var(--neon-red)', 
            fontWeight: '700',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.3rem'
          }}
        >
          {algorithm.optimal ? (
            <CheckCircle2 size={14} color="var(--neon-green)" />
          ) : (
            <XCircle size={14} color="var(--neon-red)" />
          )}
          {algorithm.optimalNote || (algorithm.optimal ? 'Yes' : 'No')}
        </span>
      </div>
    </div>
  );
};

export default AlgorithmCard;
