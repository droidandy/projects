import React, { ReactNode } from 'react';
import { Box, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';

export type OptionsList = {
  name: string;
  value: string | number;
  children?: React.FC<React.SVGProps<SVGSVGElement>> | ReactNode;
};

export const VehicleInfoItem = (props: OptionsList) => {
  const { name, value, children } = props;
  const { isMobile } = useBreakpoints();

  return (
    <Box pb={isMobile ? 2.5 : 3.75} pr={isMobile ? 0 : 9.125}>
      <Grid container wrap="nowrap" alignItems="center">
        <Grid item>
          <Box pr={2.5}>{children}</Box>
        </Grid>
        <Grid item direction="column">
          <Typography variant="caption" color="secondary">
            {name}
          </Typography>
          <Typography variant="body1">{value}</Typography>
        </Grid>
      </Grid>
    </Box>
  );
};
