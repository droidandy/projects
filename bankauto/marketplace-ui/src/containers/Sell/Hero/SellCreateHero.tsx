import React, { useMemo } from 'react';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { City } from 'types/City';

export const SellCreateHero = () => {
  const { isMobile } = useBreakpoints();
  const { current, list } = useCity();
  const {
    state: {
      values: { city },
    },
  } = useVehicleCreateValues();

  const currentCity = useMemo(() => {
    const selectedCity = [...list.primary, ...list.secondary].find(({ id }: City) => id === city);

    return selectedCity || current;
  }, [city, list, current]);

  return (
    <>
      <Typography variant={isMobile ? 'h4' : 'h3'} component="h1">
        Продайте свой автомобиль {getFormattedCity(currentCity)}
      </Typography>
      <Box pt={1.25}>
        <Typography variant="subtitle1">Оцените и продайте свой автомобиль на самых выгодных условиях</Typography>
      </Box>
    </>
  );
};
