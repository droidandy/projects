import React, { FC, useEffect, useMemo } from 'react';
import { Box } from '@marketplace/ui-kit';
import { VehicleCard } from 'containers/Vehicles/components/Card/VehicleCard';
import { useVehicleRelatives } from 'store/catalog/vehicle/relatives';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { RelativeOffersSlider } from 'components/VehicleDetailComponents';

export const RelativeVehiclesSlider: FC = () => {
  const { vehicle } = useVehicleItem();
  const { items, loading, fetchVehicleRelatives } = useVehicleRelatives();

  useEffect(() => {
    if (vehicle) {
      fetchVehicleRelatives(vehicle.id);
    }
  }, [vehicle, fetchVehicleRelatives]);

  const slides = useMemo(
    () =>
      items?.map((item) => (
        <Box width="100%" key={item.id} position="relative">
          <VehicleCard {...item} isInsideSlider />
        </Box>
      )),
    [items],
  );

  return <RelativeOffersSlider title="Похожие предложения" slides={slides} loading={loading} />;
};
