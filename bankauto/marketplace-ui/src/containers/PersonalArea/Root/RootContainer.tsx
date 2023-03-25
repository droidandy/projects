import React, { FC } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { MobileContent, DesktopContent } from './components';

export const RootContainer: FC = () => {
  const { isMobile } = useBreakpoints();

  return isMobile ? <MobileContent /> : <DesktopContent />;
};
