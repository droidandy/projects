import React, { FC } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { Link } from 'components';
import { deactivatedStatusesForApplications } from 'constants/application';

export const VehicleAvailabilityChecker: FC = ({ children }) => {
  const { vehicle } = useVehicleItem();
  const { isMobile } = useBreakpoints();
  if (!vehicle) {
    return null;
  }
  const { status, type, brand, model } = vehicle;
  const isForSold = vehicle?.cancelReason !== null;
  const checkerTitle =
    status === VEHICLE_STATUS.SOLD
      ? 'Данный автомобиль \n уже нашел своего владельца'
      : 'Данный автомобиль \n был снят с продажи';
  return status && deactivatedStatusesForApplications.includes(status) && !isForSold ? (
    <Box py={5} px={isMobile ? 2.5 : 0}>
      <Box bgcolor="grey.200" pt={2.25} pb={2.75} px={6} textAlign="center" borderRadius="0.5rem">
        <Typography component={isMobile ? 'pre' : 'p'} variant="subtitle1">
          {checkerTitle}
        </Typography>
        <Box pt={isMobile ? 1.25 : 0.25}>
          <Typography component={'p'} variant="caption">
            Но вы можете посмотреть другие предложения {''}
            <Link href={`/car/${type}/${brand.alias}/${model.alias}`}>
              <Typography variant={'caption'} color={'primary'}>
                <b>
                  {brand.name} {model.name}
                </b>
              </Typography>
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <>{children}</>
  );
};
