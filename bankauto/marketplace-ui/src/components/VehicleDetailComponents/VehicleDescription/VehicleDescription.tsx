import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';

interface Props {
  comment: string;
}

export const VehicleDescription: FC<Props> = ({ comment }) => {
  const { isMobile } = useBreakpoints();
  return (
    <Box>
      <Typography variant={isMobile ? 'h4' : 'h3'} style={{ paddingBottom: isMobile ? '0.75rem' : '1.25rem' }}>
        Описание
      </Typography>
      <Typography variant={isMobile ? 'body2' : 'body1'}>{comment}</Typography>
    </Box>
  );
};
