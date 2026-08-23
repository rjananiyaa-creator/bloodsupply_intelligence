import React from 'react';
import { BloodGroup } from '../../types';
import { Droplet } from 'lucide-react';

interface BloodGroupBadgeProps {
  bloodGroup: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const BloodGroupBadge: React.FC<BloodGroupBadgeProps> = ({
  bloodGroup,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const isUniversal = bloodGroup === 'O-';
  const isNegative = bloodGroup.includes('-');

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[11px] font-bold',
    md: 'px-2 py-0.5 text-xs font-extrabold',
    lg: 'px-2.5 py-1 text-sm font-black',
  };

  const iconSizes = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-3.5 h-3.5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border tracking-tight font-mono ${sizeClasses[size]} ${
        isUniversal
          ? 'bg-[#FEE2E2] border-[#F87171] text-[#991B1B]'
          : isNegative
          ? 'bg-[#FEF3C7] border-[#FCD34D] text-[#92400E]'
          : 'bg-[#FEE2E2]/60 border-[#FECACA] text-[#B91C1C]'
      } ${className}`}
    >
      {showIcon && (
        <Droplet
          className={`${iconSizes[size]} fill-current ${
            isUniversal ? 'text-[#DC2626]' : 'text-[#B91C1C]'
          }`}
        />
      )}
      <span>{bloodGroup}</span>
      {isUniversal && size !== 'sm' && (
        <span className="text-[9px] font-sans font-bold px-1 bg-[#DC2626] text-white rounded">
          Univ
        </span>
      )}
    </span>
  );
};
