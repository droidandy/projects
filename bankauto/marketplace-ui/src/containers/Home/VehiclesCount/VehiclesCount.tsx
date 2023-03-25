import React, { memo } from 'react';
import { Typography, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { pluralizeCar } from 'constants/pluralizeConstants';

const VehiclesCountRoot = () => {
  const { isMobile } = useBreakpoints();
  const {
    meta: { count: carsCount, minPrice },
  } = useVehiclesMeta();

  return (
    <>
      {carsCount !== 0 && (
        <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
          {carsCount} {pluralizeCar(carsCount!)} {minPrice && isMobile ? '\n' : ''} от <PriceFormat value={minPrice!} />
        </Typography>
      )}
    </>
  );
};

const VehiclesCount = memo(VehiclesCountRoot);

export { VehiclesCount };
