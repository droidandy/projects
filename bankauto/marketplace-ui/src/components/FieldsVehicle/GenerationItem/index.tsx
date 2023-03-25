import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';

type Props = {
  name: string;
  startYear: number;
  endYear: number;
  [key: string]: any;
};

export const GenerationItem: FC<Props> = ({ name, startYear, endYear, ...rest }) => (
  <Box display="flex" flexDirection="column" alignItems="center" height="100%" {...rest}>
    <Box mb={0.5} mt={0.6} display="flex" alignItems="center" justifyContent="flex-end" flexBasis="100%">
      <Typography variant="body1">
        <b>{name}</b>
      </Typography>
    </Box>
    <Typography variant="body1" className="years">
      {startYear}-{endYear}
    </Typography>
  </Box>
);
