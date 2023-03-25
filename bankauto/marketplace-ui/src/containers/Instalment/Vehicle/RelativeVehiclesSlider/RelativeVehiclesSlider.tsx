import React, { FC, useEffect, useMemo } from 'react';
import { Box } from '@marketplace/ui-kit';
import { VehicleCard } from 'containers/Instalment/components';
import { useInstalmentOffer } from 'store/instalment/vehicle/item';
import { useInstalmentRelatives } from 'store/instalment/vehicle/relatives';
import { RelativeOffersSlider } from 'components/VehicleDetailComponents';

export const RelativeVehiclesSlider: FC = () => {
  const { vehicle } = useInstalmentOffer();
  const { items, loading, fetchVehicleRelatives } = useInstalmentRelatives();

  useEffect(() => {
    if (vehicle) {
      fetchVehicleRelatives(vehicle.id);
    }
  }, [vehicle, fetchVehicleRelatives]);

  const slides = useMemo(
    () =>
      items?.map((item) => (
        <Box width="100%" key={item.id} position="relative">
          <VehicleCard {...item} />
        </Box>
      )),
    [items],
  );

  return <RelativeOffersSlider title="Похожие предложения" slides={slides} loading={loading} />;
};
