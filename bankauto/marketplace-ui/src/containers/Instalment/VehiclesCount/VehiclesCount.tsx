import React, { memo } from 'react';
import { PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useInstalmentMeta } from 'store/instalment/vehicles/meta';
import { pluralizeCar } from 'constants/pluralizeConstants';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';

const VehiclesCountRoot = () => {
  const { isMobile } = useBreakpoints();
  const {
    meta: { count: carsCount, minPrice: installmentPayment },
    fetchInstalmentMeta,
  } = useInstalmentMeta();
  React.useEffect(() => {
    fetchInstalmentMeta({ type: VEHICLE_TYPE_ID.USED });
  }, [fetchInstalmentMeta]);

  return (
    <>
      <Typography component="h2" variant={isMobile ? 'h4' : 'h2'} align="center">
        {carsCount} {pluralizeCar(carsCount!)} {installmentPayment && isMobile ? '\n' : ''} от{' '}
        <PriceFormat value={installmentPayment!} /> /месяц
      </Typography>
    </>
  );
};

const VehiclesCount = memo(VehiclesCountRoot);

export { VehiclesCount };
