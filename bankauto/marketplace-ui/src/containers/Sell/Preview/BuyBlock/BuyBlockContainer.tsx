import React, { FC } from 'react';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { VehicleC2CSellerBuyBlock } from 'components/VehicleBuyBlock';

export const BuyBlockContainer: FC = () => {
  const { vehicle } = useVehicleItem();

  return vehicle ? (
    <VehicleC2CSellerBuyBlock price={vehicle.price} id={vehicle.id} vehicleStatus={vehicle.status} />
  ) : null;
};
