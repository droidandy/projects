import React, { memo } from 'react';
import { Meta, SeoNoIndexSetter } from 'components';
import { useRouteGuards } from 'hooks';
import { unauthorizedGuard } from 'guards';
import { MainLayout } from 'layouts';
import { useCity } from 'store/city';
import { getFormattedCity } from 'helpers/getFormattedCity';

const SellListRoot = () => {
  const { current } = useCity();
  const title = `Размесить объявление о продаже авто ${getFormattedCity(current)}`;

  useRouteGuards(unauthorizedGuard);
  return (
    <>
      <Meta title={title} />
      <SeoNoIndexSetter />
      <MainLayout>GarageContainer</MainLayout>
    </>
  );
};

const SellList = memo(SellListRoot);

export default SellList;
