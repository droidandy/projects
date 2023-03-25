import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';

type Props = {
  name: string;
  startYear: number;
  endYear: number;
  [key: string]: any;
};

export const GenerationItem: FC<Props> = ({ name, startYear, endYear, ...rest }) => (
  <Box display="flex" flexDirection="column" alignItems="center" height="100%" justifyContent="flex-end" {...rest}>
    <Typography variant="subtitle1">{name}</Typography>
    <Typography variant="body1" className="years">
      {startYear}-{endYear}
    </Typography>
  </Box>
);
