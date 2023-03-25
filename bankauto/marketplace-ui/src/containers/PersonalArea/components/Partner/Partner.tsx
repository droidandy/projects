import React, { FC } from 'react';
import { Box, Img, Typography } from '@marketplace/ui-kit';
import {
  APPLICATION_CREDIT_STATUS,
  APPLICATION_VEHICLE_STATUS,
  CompanyNew,
  Office,
  VEHICLE_TYPE,
} from '@marketplace/ui-kit/types';
import { approvalStatuses } from 'constants/application';
import { City } from 'types/City';

interface Props {
  salesOffice?: Office;
  company?: CompanyNew | null;
  brand: string;
  type: VEHICLE_TYPE;
  status: APPLICATION_VEHICLE_STATUS | APPLICATION_CREDIT_STATUS;
  city: City;
}

export const Partner: FC<Props> = ({ brand, salesOffice, company, type, status, city }) => {
  if (!company && !salesOffice?.company) return null;
  const isDetailsVisible = approvalStatuses.includes(status);
  const logo = salesOffice?.company?.logo || company?.logo || null;
  const name = salesOffice?.company.name || company?.name;
  const address = salesOffice?.address || company?.officeAddress;

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      {isDetailsVisible && (
        <Box height="1.25rem" position="relative" mb={2.5}>
          {logo ? (
            <Img src={logo} alt={name} />
          ) : (
            <Typography variant="subtitle1" align="center" style={{ hyphens: 'auto', wordBreak: 'break-all' }}>
              {name}
            </Typography>
          )}
        </Box>
      )}
      <Typography component="pre" variant="body1" align="center">
        {`Официальный дилер ${type === VEHICLE_TYPE.NEW ? brand : ''} ${city?.name ? `\n г. ${city?.name}` : ''}`}
      </Typography>
      {isDetailsVisible && (
        <Typography variant="body2" color="secondary" align="center" style={{ fontSize: '0.75rem' }}>
          {address}
        </Typography>
      )}
    </Box>
  );
};
