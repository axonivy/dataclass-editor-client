import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axonivy/ui-components';
import type { ReactNode } from 'react';
import './Badge.css';

type BadgeProps = {
  value: string;
  tooltip: ReactNode;
};

export const Badge = ({ value, tooltip }: BadgeProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='badge'>{value}</div>
        </TooltipTrigger>
        <TooltipContent>{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
