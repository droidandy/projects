import React, { FC, SVGProps } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { BodyIconRecord } from 'containers/VehicleCreate/constants';
import * as icons from 'icons/bodyTypes';
import { useStyles } from './BodyItem.styles';

type Props = {
  id: number;
  name: string;
  iconProps?: SVGProps<SVGSVGElement>;
};

export const BodyItem: FC<Props> = ({ id, name, iconProps }) => {
  const classes = useStyles();
  const Icon = BodyIconRecord[id] || icons.SedanIcon;

  return (
    <Box className={classes.root}>
      <Icon className={classes.icon} {...iconProps} />
      <Typography variant="body1">{name}</Typography>
    </Box>
  );
};
