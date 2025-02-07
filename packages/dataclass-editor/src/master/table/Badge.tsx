import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import './Badge.css';

type BadgeProps = {
  value: string;
  tooltip: ReactNode;
  className: string;
};

export const Badge = ({ value, tooltip, className }: BadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='badge-container'>
            <div className={`badge ${className}`}>{value}</div>
          </div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
