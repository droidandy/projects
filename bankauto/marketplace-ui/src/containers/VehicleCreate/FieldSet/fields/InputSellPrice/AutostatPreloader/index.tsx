import React, { FC } from 'react';
import { Box } from '@marketplace/ui-kit';
import { useStyles } from './AutostatPreloader.styles';

export const AutostatPreloader: FC = () => {
  const { circle } = useStyles();

  return (
    <Box display="flex" alignItems="center">
      <Box mr={1.25} className={circle} />
      <Box mr={1.25} className={circle} style={{ animationDelay: '0.20s' }} />
      <Box className={circle} style={{ animationDelay: '0.40s' }} />
    </Box>
  );
};
