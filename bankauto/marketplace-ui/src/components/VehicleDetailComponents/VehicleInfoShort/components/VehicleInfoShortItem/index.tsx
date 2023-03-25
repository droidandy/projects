import React, { FC } from 'react';
import { Box, Grid, Icon, Typography } from '@marketplace/ui-kit';
import { useStyles } from './VehicleInfoShortItem.styles';

type Color = {
  code: string;
  name: string;
  [key: string]: any;
};

export type Option = {
  name: string;
  value: string | number | Color | null;
  icon?: React.FC<React.SVGProps<SVGSVGElement>>;
};

export const VehicleInfoShortItem: FC<Option> = ({ name, value, icon }) => {
  const s = useStyles();

  return (
    <>
      {value ? (
        <Box className={s.infoItem} key={name} alignItems="center">
          <Grid container wrap="nowrap" alignItems="center">
            <Grid item>
              <Box pr={2.5}>
                {typeof value === 'object' ? (
                  <span className={s.colorCircle} style={{ backgroundColor: value.code }} />
                ) : (
                  <Icon width="40" height="40" viewBox="0 0 40 40" component={icon} className={s.icon} />
                )}
              </Box>
            </Grid>
            <Grid item container direction="column">
              <Typography variant="caption" color="secondary">
                {name}
              </Typography>
              <Typography variant="body1">{typeof value === 'object' ? value.name : value}</Typography>
            </Grid>
          </Grid>
        </Box>
      ) : null}
    </>
  );
};
