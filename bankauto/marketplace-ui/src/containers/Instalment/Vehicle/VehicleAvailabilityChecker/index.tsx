import React, { FC } from 'react';

import { useInstalmentOffer } from 'store/instalment/vehicle/item';
import { VehicleAvailabilityCheckerInfo } from 'components/VehicleDetailComponents';
import { deactivatedStatusesForApplications } from 'constants/application';

export const VehicleAvailabilityChecker: FC = ({ children }) => {
  const { vehicle } = useInstalmentOffer();

  return deactivatedStatusesForApplications.includes(vehicle?.status!) ? (
    <VehicleAvailabilityCheckerInfo status={vehicle?.status!} />
  ) : (
    <>{children}</>
  );
};
