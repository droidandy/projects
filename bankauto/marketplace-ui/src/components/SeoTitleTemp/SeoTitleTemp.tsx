import React, { FC } from 'react';
import { Typography, useBreakpoints } from '@marketplace/ui-kit';

interface SeoTitleTempProps {
  title: string;
  className?: string;
}

const SeoTitleTemp: FC<SeoTitleTempProps> = ({ title, className }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Typography component="h1" variant={isMobile ? 'h6' : 'h4'} align="center" className={className}>
      {title}
    </Typography>
  );
};
export { SeoTitleTemp };
