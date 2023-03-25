import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { LoaderProgress } from 'components/LoaderProgress';
import { VehicleCard, EmptyVehicleCard } from './VehicleCard';
import { InspectionPage } from './InspectionPage';
import { useCheckPresetnExpocarInCity } from './useCheckPresetnExpocarInCity';

export const SellInspectionsContainer: FC = () => {
  const { query } = useRouter();
  const { vehicle, fetchVehicleItem } = useVehicleItem();
  const isPresentExpocarInCity = useCheckPresetnExpocarInCity(vehicle?.city.id);

  useEffect(() => {
    const offerId = query.offerId as string;
    if (!vehicle || vehicle.id !== Number(offerId)) {
      fetchVehicleItem(query.brandAlias as string, query.modelAlias as string, offerId);
    }
  }, [fetchVehicleItem, vehicle]);

  if (!vehicle) {
    return <LoaderProgress />;
  }

  return (
    <InspectionPage>{isPresentExpocarInCity ? <VehicleCard vehicle={vehicle} /> : <EmptyVehicleCard />}</InspectionPage>
  );
};
