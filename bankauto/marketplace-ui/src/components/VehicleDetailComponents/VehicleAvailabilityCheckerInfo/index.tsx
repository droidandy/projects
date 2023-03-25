import React from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { deactivatedStatusesForApplications } from '../../../constants/application';

interface VehicleAvailabilityCheckerInfoProps {
  status: VEHICLE_STATUS;
}
export const VehicleAvailabilityCheckerInfo: (props: VehicleAvailabilityCheckerInfoProps) => JSX.Element = ({
  status,
}) => {
  const { isMobile } = useBreakpoints();
  const checkerTitle =
    status === VEHICLE_STATUS.SOLD
      ? 'Данный автомобиль \n уже нашел своего владельца'
      : 'Данный автомобиль \n был снят с продажи';
  return status && deactivatedStatusesForApplications.includes(status) ? (
    <Box py={5} px={isMobile ? 2.5 : 0}>
      <Box bgcolor="grey.200" pt={2.25} pb={2.75} px={6} textAlign="center" borderRadius="0.5rem">
        <Typography component={isMobile ? 'pre' : 'p'} variant="subtitle1">
          {checkerTitle}
        </Typography>
        <Box pt={isMobile ? 1.25 : 0.25}>
          <Typography component={isMobile ? 'pre' : 'p'} variant="caption">
            {'Мы подобрали похожие предложения,\n которые могут вас заинтересовать'}
          </Typography>
        </Box>
      </Box>
    </Box>
  ) : (
    <></>
  );
};
