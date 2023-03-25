import React, { FC } from 'react';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { deactivatedStatusesForApplications } from 'constants/application';
import { VehicleAvailabilityCheckerInfo } from 'components/VehicleDetailComponents';

export const VehicleAvailabilityChecker: FC = ({ children }) => {
  const { vehicle } = useVehicleItem();
  const isForSold = vehicle?.cancelReason !== null;
  return deactivatedStatusesForApplications.includes(vehicle?.status!) && !isForSold ? (
    <VehicleAvailabilityCheckerInfo status={vehicle?.status!} />
  ) : (
    <>{children}</>
  );
};
