import { useBreakpoints } from '@marketplace/ui-kit';
import React from 'react';
import { SellFilter } from '../SellFilter/Filter';
import { useStyles } from './SellTabContent.styles';
import { SellFlowDesktop } from '../SellFlow/SellFlow.Desktop';

export const SellTabContent = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  return (
    <div className={s.root}>
      <SellFilter />
      {!isMobile && (
        <div className={s.flowWrapper}>
          <SellFlowDesktop />
        </div>
      )}
    </div>
  );
};
