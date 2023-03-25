import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { Chips, Chip } from '../../../../../components';

interface Props {
  title: string;
  subTitle: string;
  vehicleName: string | JSX.Element;
  vin: string;
  vehicleData: string | JSX.Element;
  chips: Chip[];
}

export const Data: FC<Props> = ({ title, chips, vin, vehicleData, subTitle, vehicleName }) => (
  <Box>
    <Box display="flex" alignItems="flex-start" flexWrap="wrap">
      <Box pr={1.25}>
        <Typography variant="h3">{title}</Typography>
        <Typography variant="subtitle1" style={{ fontWeight: 'bold' }} color="secondary">
          {subTitle}
        </Typography>
      </Box>
      <Box pt={1.25}>
        <Chips items={chips} />
      </Box>
    </Box>
    <Box pt={2.5}>
      <Typography variant="subtitle1" component="h5" style={{ fontWeight: 'bold' }}>
        {vehicleName}
      </Typography>
    </Box>
    <Box pt={1.25}>
      <Typography variant="subtitle1">VIN: {vin}</Typography>
      <Typography variant="subtitle1">{vehicleData}</Typography>
    </Box>
  </Box>
);
