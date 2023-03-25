import React from 'react';
import { VehicleNew, VEHICLE_SCENARIO } from '@marketplace/ui-kit/types';
import { VehicleBuyBlock } from 'containers/Vehicle';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { VehicleC2CCustomerBuyBlock } from './VehicleC2CBuyBlock/VehicleC2CBuyBlock/VehicleC2CCustomerBuyBlock';

export const VehicleBuyBlockContainer = () => {
  const { vehicle } = useVehicleItem() as { vehicle: VehicleNew };

  switch (vehicle.scenario.toString()) {
    case VEHICLE_SCENARIO.USED_FROM_CLIENT:
    case VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT:
      return <VehicleC2CCustomerBuyBlock />;
    default:
      return <VehicleBuyBlock />;
  }
};
