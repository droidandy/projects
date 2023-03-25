import React, { FC, memo } from 'react';
import { Grid, Typography, Divider, useBreakpoints } from '@marketplace/ui-kit';
import { parseVehicleToLinks } from 'containers/Vehicle/helpers/parseVehicleToLinks';
import { FavoritesButton } from 'containers/Favorites/FavoritesButton';
import { ComparisonButton } from 'containers/Comparison/ComparisonButton';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import Breadcrumbs from 'components/Breadcrumbs';
import { CarInfoAdditional } from 'components/CarInfoAdditional';

interface Props {
  withControls?: boolean;
  withAdditionalInfo?: boolean;
}

export const VehicleHero: FC<Props> = memo(({ withControls, withAdditionalInfo }) => {
  const { vehicle } = useVehicleItem();
  const { isMobile } = useBreakpoints();

  if (!vehicle) {
    return null;
  }

  const {
    brand: { name: brandName },
    model: { name: modelName },
    generation: { name: generationName },
    engine: { enginePower },
    year,
    totalViews,
    date,
    type,
    id,
  } = vehicle;

  const breadcrumbs = [{ to: '/', label: 'Главная' }, ...parseVehicleToLinks(vehicle)];
  return (
    <>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <Grid container justify="center" direction="column" spacing={isMobile ? 1 : 0}>
        <Grid item xs>
          <Typography component="h1" variant="h3" color="textPrimary">
            {`${brandName} ${modelName} ${generationName} (${enginePower} л.с.), ${year} год`}
          </Typography>
        </Grid>
        {!!withAdditionalInfo && (
          <Grid container item xs justify="space-between" alignItems="center">
            <Grid item>
              <CarInfoAdditional date={date} totalViews={totalViews} />
            </Grid>
            <Grid item>
              <span style={{ paddingRight: '1.875rem' }}>
                {withControls ? (
                  <ComparisonButton withText usageType="buyBlock" offerId={id} vehicleType={type} />
                ) : null}
              </span>
              <span>{withControls ? <FavoritesButton vehicleId={vehicle.id || 0} withText /> : null}</span>
            </Grid>
          </Grid>
        )}
      </Grid>
      {!!withAdditionalInfo && <Divider style={{ margin: '1.25rem 0', display: isMobile ? 'none' : 'block' }} />}
    </>
  );
});
