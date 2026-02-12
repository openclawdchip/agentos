import type { ReactNode } from 'react';

interface PulseRingProps {
  children: ReactNode;
  color?: 'cyan' | 'purple' | 'amber' | 'green';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorConfig = {
  cyan: 'border-cyan-400 shadow-cyan-400/30',
  purple: 'border-purple-500 shadow-purple-500/30',
  amber: 'border-amber-500 shadow-amber-500/30',
  green: 'border-emerald-500 shadow-emerald-500/30',
};

const sizeConfig = {
  sm: 'p-1',
  md: 'p-2',
  lg: 'p-3',
};

export function PulseRing({ 
  children, 
  color = 'cyan',
  size = 'md',
  className = ''
}: PulseRingProps) {
  return (
    <div className={`relative inline-flex ${className}`}>
      {/* Outer pulse ring */}
      <span 
        className={`absolute inset-0 rounded-full border-2 ${colorConfig[color]} animate-pulse-ring`}
        style={{ animationDuration: '2s' }}
      />
      {/* Inner glow */}
      <span 
        className={`absolute inset-0 rounded-full ${colorConfig[color]} opacity-20`}
        style={{ boxShadow: 'inset 0 0 20px currentColor' }}
      />
      {/* Content */}
      <div className={`relative ${sizeConfig[size]}`}>
        {children}
      </div>
    </div>
  );
}
