import React, { memo } from 'react';
import { useInstalmentOffer } from 'store/instalment/vehicle/item';
import Breadcrumbs from 'components/Breadcrumbs';
import { Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { parseVehicleToLinks } from './helpers/parseVehicleToLinks';
import { Label } from '../../components/Label';

export const VehicleHero = memo(() => {
  const { vehicle } = useInstalmentOffer();
  const { isMobile } = useBreakpoints();
  if (!vehicle) {
    return null;
  }
  const breadcrumbs = [{ to: '/', label: 'Главная' }, ...parseVehicleToLinks(vehicle)];
  const chipText = vehicle.specialOffer ? vehicle.text : '0% первый взнос';

  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container spacing={1} justify="space-between" alignItems="flex-end">
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Typography component="h1" variant="h3" color="textPrimary">
              {`${vehicle.brand?.name} ${vehicle.model?.name} ${vehicle.generation?.name} (${vehicle.enginePower} л.с.), ${vehicle.year} год`}
            </Typography>
          </Grid>
          {!isMobile && (
            <Grid item>
              <Label title={chipText} />
            </Grid>
          )}
        </Grid>
      </Grid>
    </>
  );
});
