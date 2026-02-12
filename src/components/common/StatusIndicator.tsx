import type { StatusType } from '@/types';

interface StatusIndicatorProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
}

const statusConfig = {
  healthy: { className: 'status-healthy', label: '健康' },
  warning: { className: 'status-warning', label: '警告' },
  danger: { className: 'status-danger', label: '危险' },
  processing: { className: 'status-processing', label: '处理中' },
};

const sizeConfig = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-3 h-3',
};

export function StatusIndicator({ status, size = 'md', showLabel = false, label }: StatusIndicatorProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];
  
  return (
    <div className="flex items-center gap-2">
      <span className={`${sizeClass} rounded-full ${config.className}`} />
      {showLabel && (
        <span className="text-xs text-zinc-400">{label || config.label}</span>
      )}
    </div>
  );
}
