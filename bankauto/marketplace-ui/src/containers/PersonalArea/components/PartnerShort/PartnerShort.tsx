import React, { FC } from 'react';
import { Box, Typography } from '@marketplace/ui-kit';
import { APPLICATION_CREDIT_STATUS, APPLICATION_VEHICLE_STATUS, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { approvalStatuses } from 'constants/application';

interface Props {
  companyName: string;
  companyAddress: string;
  brand: string;
  type: VEHICLE_TYPE;
  status: APPLICATION_VEHICLE_STATUS | APPLICATION_CREDIT_STATUS;
}

export const PartnerShort: FC<Props> = ({ brand, companyName, companyAddress, type, status }) => {
  const isDetailsVisible = approvalStatuses.includes(status);

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {isDetailsVisible && (
        <Box height="1.25rem" position="relative" mb={2.5}>
          <Typography variant="subtitle1" align="center" style={{ hyphens: 'auto', wordBreak: 'break-all' }}>
            {companyName}
          </Typography>
        </Box>
      )}
      <Typography variant="body1" align="center">
        Официальный дилер {type === VEHICLE_TYPE.NEW && brand}
      </Typography>
      {isDetailsVisible && (
        <Typography variant="body2" color="secondary" align="center" style={{ fontSize: '0.75rem' }}>
          {companyAddress}
        </Typography>
      )}
    </Box>
  );
};
