import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { Chips, Chip } from '../../../../../components';

interface Props {
  vehicleName: string | JSX.Element;
  vin: string;
  vehicleData: string | JSX.Element;
  chips: Chip[];
}

export const DataMobile: FC<Props> = ({ vehicleName, chips, vin, vehicleData }) => {
  return (
    <Box>
      <Box pb={2.5}>
        <Chips items={chips} />
      </Box>
      <Typography variant="subtitle1" style={{ fontWeight: 'bold' }}>
        {vehicleName}
      </Typography>
      <Box pt={1.25}>
        <Typography variant="body2">VIN: {vin}</Typography>
        <Typography variant="body2">{vehicleData}</Typography>
      </Box>
    </Box>
  );
};
