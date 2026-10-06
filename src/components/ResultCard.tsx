import React from 'react';

interface ResultCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  accentColor?: string;
  isStatusPending?: boolean;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  accentColor = 'var(--neon-cyan)',
  isStatusPending = false,
}) => {
  return (
    <div 
      className="result-card"
      style={{
        borderTop: `2px solid ${accentColor}`,
      }}
    >
      <div className="result-card-header">
        <span className="result-label">{title}</span>
        {icon && (
          <div 
            style={{
              padding: '0.4rem',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div 
        className="result-value"
        style={{
          color: isStatusPending ? 'var(--text-muted)' : accentColor,
          fontSize: typeof value === 'string' && value.length > 8 ? '1.5rem' : '2.4rem',
          fontStyle: isStatusPending ? 'italic' : 'normal',
        }}
      >
        {value}
      </div>

      {subtitle && <div className="result-subtitle">{subtitle}</div>}
    </div>
  );
};

export default ResultCard;
