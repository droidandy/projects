import React, { memo, useEffect, useRef } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import { VEHICLE_TYPE_ID } from '@marketplace/ui-kit/types';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useVehiclesFilter } from 'store/catalog/vehicles/filter';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';
import { useVehiclesBreadCrumbsData } from 'store/breadcrumbs';
import { useCheckAlias } from 'store/catalog/aliasCheck';
import { useVehiclesBreadcrumbs } from '../hooks/useVehiclesBreadcrumbs';

export const VehiclesHero = memo(() => {
  const { values: filterValues } = useVehiclesFilter();
  const { data: resolvedAlias } = useCheckAlias();
  const { brand, model, generation } = resolvedAlias || {};

  const { items, setBreadCrumbsData } = useVehiclesBreadCrumbsData();
  const { isMobile } = useBreakpoints();

  const {
    meta: { count: vehiclesCount },
  } = useVehiclesMeta();
  const initial = useRef(false);
  const { current } = useCity();

  useEffect(() => {
    initial.current = true;
  }, []);
  const isNew = Number(filterValues.type) === VEHICLE_TYPE_ID.NEW;
  const isUsed = Number(filterValues.type) === VEHICLE_TYPE_ID.USED;
  const type = (filterValues.type !== null && isNew && 'new') || (isUsed && 'used') || null;

  let title =
    (filterValues.type !== null && isNew && `Продажа новых автомобилей ${getFormattedCity(current)}`) ||
    (isUsed && `Продажа автомобилей с пробегом ${getFormattedCity(current)}`) ||
    `Продажа автомобилей ${getFormattedCity(current)}`;

  const addBrandToTitle = Number(filterValues?.brands?.length) < 2 && brand;
  const addModelToTitle = addBrandToTitle && Number(filterValues?.models?.length) < 2 && model;
  const addGenerationToTile = addModelToTitle && Number(filterValues?.generations?.length) < 2 && generation;

  if (addBrandToTitle) {
    const tempTitle = `Продажа ${filterValues.type !== null && isNew ? 'новых' : ''} ${
      brand?.name || `${isNew ? 'автомобиль' : ''}`
    } ${addModelToTitle ? model?.name : ''} ${addGenerationToTile ? generation?.name : ''}${
      isUsed ? ' с пробегом' : ''
    } ${getFormattedCity(current)}`;
    title = tempTitle.replace(/\s+/g, ' ');
  }

  const breadcrumbs = useVehiclesBreadcrumbs({
    type,
    filterValues,
    alias: resolvedAlias,
  });

  useEffect(() => {
    if (initial.current) {
      setBreadCrumbsData(breadcrumbs);
    }
  }, [breadcrumbs, initial.current]);

  return (
    <Box>
      <Breadcrumbs breadcrumbs={items!} />
      <div>
        <Typography component="h1" variant={isMobile ? 'h5' : 'h3'} style={{ display: 'inline' }}>
          {title}
        </Typography>
        {vehiclesCount ? (
          <Typography noWrap component="span" color="textSecondary" variant={isMobile ? 'h5' : 'h3'}>
            {` ${vehiclesCount} авто`}
          </Typography>
        ) : null}
      </div>
    </Box>
  );
});
