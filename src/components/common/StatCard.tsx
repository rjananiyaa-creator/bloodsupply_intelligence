import React, { ReactNode } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: {
    value: string;
    isPositive?: boolean;
    isNeutral?: boolean;
    label?: string;
  };
  variant?: 'default' | 'danger' | 'warning' | 'success' | 'blood';
  onClick?: () => void;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  variant = 'default',
  onClick,
  className = '',
}) => {
  const variantStyles = {
    default: {
      card: 'bg-white border-[#E5E7EB]',
      valueColor: 'text-[#B91C1C]',
      iconBox: 'bg-[#F3F4F6] text-[#6B7280]',
    },
    danger: {
      card: 'bg-white border-[#E5E7EB]',
      valueColor: 'text-[#DC2626]',
      iconBox: 'bg-[#FEE2E2] text-[#991B1B]',
    },
    warning: {
      card: 'bg-white border-[#E5E7EB]',
      valueColor: 'text-[#D97706]',
      iconBox: 'bg-[#FEF3C7] text-[#92400E]',
    },
    success: {
      card: 'bg-white border-[#E5E7EB]',
      valueColor: 'text-[#059669]',
      iconBox: 'bg-[#D1FAE5] text-[#065F46]',
    },
    blood: {
      card: 'bg-white border-[#E5E7EB]',
      valueColor: 'text-[#B91C1C]',
      iconBox: 'bg-[#B91C1C] text-white',
    },
  };

  const current = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-[#E5E7EB] rounded-lg p-4 shadow-[0_1px_3px_rgba(0,0,0,0.05)] transition-all ${
        onClick ? 'cursor-pointer hover:border-[#B91C1C]/40' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <div className="text-[11px] uppercase font-semibold text-[#6B7280] tracking-wider mb-1">
            {title}
          </div>
          <div className={`text-2xl font-bold tracking-tight ${current.valueColor}`}>
            {value}
          </div>
          {subtitle && (
            <div className="text-xs text-[#6B7280] mt-1">{subtitle}</div>
          )}
        </div>
        {icon && (
          <div className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${current.iconBox}`}>
            {icon}
          </div>
        )}
      </div>

      {trend && (
        <div className="mt-2.5 pt-2 border-t border-[#F3F4F6] flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center gap-0.5 font-semibold text-xs ${
              trend.isNeutral
                ? 'text-[#6B7280]'
                : trend.isPositive
                ? 'text-[#059669]'
                : 'text-[#DC2626]'
            }`}
          >
            {trend.isNeutral ? (
              <Minus className="w-3 h-3" />
            ) : trend.isPositive ? (
              <ArrowUpRight className="w-3 h-3" />
            ) : (
              <ArrowDownRight className="w-3 h-3" />
            )}
            {trend.value}
          </span>
          {trend.label && <span className="text-[#6B7280] text-[11px]">{trend.label}</span>}
        </div>
      )}
    </div>
  );
};
