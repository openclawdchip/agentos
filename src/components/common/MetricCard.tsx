import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AnimatedNumber } from './AnimatedNumber';
import type { StatusType } from '@/types';

interface MetricCardProps {
  title: string;
  value: number;
  max?: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: StatusType;
  decimals?: number;
  className?: string;
}

const statusColors = {
  healthy: 'border-emerald-500/30 hover:border-emerald-500/60',
  warning: 'border-amber-500/30 hover:border-amber-500/60',
  danger: 'border-red-500/30 hover:border-red-500/60',
  processing: 'border-cyan-400/30 hover:border-cyan-400/60',
};

const trendIcons = {
  up: <TrendingUp className="w-3 h-3 text-emerald-400" />,
  down: <TrendingDown className="w-3 h-3 text-red-400" />,
  stable: <Minus className="w-3 h-3 text-zinc-400" />,
};

export function MetricCard({
  title,
  value,
  max,
  unit,
  trend,
  status,
  decimals = 0,
  className = '',
}: MetricCardProps) {
  const percentage = max ? (value / max) * 100 : null;

  return (
    <div 
      className={`p-4 rounded-xl border bg-[#1a1a24] transition-all duration-300 ${statusColors[status]} ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-400">{title}</span>
        {trendIcons[trend]}
      </div>
      
      <div className="flex items-baseline gap-1">
        <AnimatedNumber 
          value={value} 
          decimals={decimals}
          className="text-2xl font-bold text-white"
        />
        {max && (
          <span className="text-sm text-zinc-500">
            / <AnimatedNumber value={max} decimals={decimals} className="text-sm" />
          </span>
        )}
        <span className="text-sm text-zinc-500">{unit}</span>
      </div>
      
      {percentage !== null && (
        <div className="mt-3 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              status === 'healthy' ? 'bg-emerald-500' :
              status === 'warning' ? 'bg-amber-500' :
              status === 'danger' ? 'bg-red-500' : 'bg-cyan-400'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}
    </div>
  );
}
