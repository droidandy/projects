import React, { memo, useMemo } from 'react';
import Breadcrumbs from 'components/Breadcrumbs';
import { Box, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useInstalmentMeta } from 'store/instalment/vehicles/meta';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { useRouter } from 'next/router';
import { useInstallmentVehiclesBreadCrumbs } from './hooks/useInstallmentVehiclesBreadCrumbs';

export const VehiclesHero = memo(() => {
  const { isMobile } = useBreakpoints();
  const {
    meta: { count: vehiclesCount },
  } = useInstalmentMeta();
  const { values, data } = useInstalmentFilter();
  const { current } = useCity();
  const router = useRouter();

  const type = useMemo(() => {
    if (!router.query.slug) {
      return null;
    }

    return (router.query.slug.includes('used') && 'used') || (router.query.slug.includes('new') && 'new') || null;
  }, [router.query.slug]);

  const currentBrand = values.brands && data.brands.find((item) => item.id === values!.brands![0]!.value);
  const currentModel = values.models && data.models.find((item) => item.id === values!.models![0]!.value);
  const breadcrumbs = useInstallmentVehiclesBreadCrumbs(data, values, type, currentBrand, currentModel);

  const { id: cityId } = current;
  const isMoscow = cityId === 1 || cityId === 17849;
  const mainType = type;
  let title =
    (values.type !== null && mainType === 'new' && `Новые автомобили в рассрочку ${getFormattedCity(current)}`) ||
    (mainType === 'used' && `Автомобили в рассрочку с пробегом ${getFormattedCity(current)}`) ||
    `Автомобили в рассрочку ${getFormattedCity(current)}`;

  const addBrandToTitle = Number(values?.brands?.length) < 2;
  const addModelToTitle = addBrandToTitle && Number(values?.models?.length) < 2;

  if (addBrandToTitle) {
    const tempTitle = `${values.type !== null && mainType === 'new' ? 'Новый' : ''}
  ${currentBrand?.name} ${addModelToTitle ? currentModel?.name : ''} ${
      values.type !== null && mainType === 'used' ? ' с пробегом' : ''
    } в рассрочку ${getFormattedCity(current)}`;
    title = tempTitle.replace(/\s+/g, ' ');
  }
  return (
    <Box>
      <Breadcrumbs breadcrumbs={breadcrumbs} />
      <div>
        <Typography component="h1" variant={isMobile ? 'h5' : 'h3'} style={{ display: 'inline' }}>
          {title}
        </Typography>
        {vehiclesCount && isMoscow ? (
          <Typography component="span" variant={isMobile ? 'h5' : 'h3'} color="textSecondary" noWrap>
            {` ${vehiclesCount} авто`}
          </Typography>
        ) : null}
      </div>
    </Box>
  );
});
