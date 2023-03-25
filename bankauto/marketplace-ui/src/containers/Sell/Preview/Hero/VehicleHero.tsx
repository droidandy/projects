import React, { memo } from 'react';
import { Grid, Typography } from '@marketplace/ui-kit';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import Breadcrumbs from 'components/Breadcrumbs';
import { CarInfoAdditional } from 'components/CarInfoAdditional';

export const VehicleHero = memo(() => {
  const { vehicle } = useVehicleItem();
  if (!vehicle) {
    return null;
  }

  const breadcrumbs = [
    { to: '/', label: 'Главная' },
    { to: '/profile/offers', label: 'Объявления' },
    { label: `Объявление № ${vehicle.id}` },
  ];
  const { totalViews, date } = vehicle;
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container spacing={1} direction="column">
        <Grid item>
          <Typography component="h1" variant="h3" color="textPrimary">
            {`${vehicle.brand.name} ${vehicle.model.name} ${vehicle.generation.name} (${vehicle.engine.enginePower} л.с.), ${vehicle.year} год`}
          </Typography>
        </Grid>
        <Grid item>
          <CarInfoAdditional totalViews={totalViews} date={date} />
        </Grid>
      </Grid>
    </>
  );
});
