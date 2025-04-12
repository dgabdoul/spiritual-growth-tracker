
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  color = 'bg-spirit-purple'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heightClass = {
    'sm': 'h-1',
    'md': 'h-2',
    'lg': 'h-3',
  }[size];
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showValue && <span className="text-sm font-medium text-gray-500">{value}%</span>}
        </div>
      )}
      <div className={cn("w-full bg-gray-200 rounded-full overflow-hidden", heightClass)}>
        <div 
          className={cn("rounded-full transition-all duration-500", color, heightClass)} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
