import React, { FC, memo, useCallback, useEffect, useState } from 'react';
import { Box, Typography, PriceFormat, TabsContent, useBreakpoints } from '@marketplace/ui-kit';
import { Divider } from '@material-ui/core';
import { CatalogBrandsShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { useVehiclesBrands } from 'store/catalog/brands';
import { useVehiclesMeta } from 'store/catalog/vehicles/meta';
import { useCity } from 'store/city';
import { TabsWrapper } from 'components';
import { BrandsList } from 'components/HomeComponents';
import { SeoTitleTemp } from 'components/SeoTitleTemp';
import { pluralizeCar } from 'constants/pluralizeConstants';
import { IS_STOCK, IS_CASHBACK_PROMO } from 'constants/specialConstants';
import { Tab, TabIdxMapper, TypeIdMapper, TypeMapper } from './helpers';
import { useStyles } from './BrandsContainer.styles';

export const BrandsContainer: FC = memo(() => {
  const { root, divider, blocksItem } = useStyles();
  const { isMobile } = useBreakpoints();
  const { extraCoverageRadius } = useCity();
  const { brands, fetchBrandsAction, initial, setInitial } = useVehiclesBrands();
  const {
    meta: { count: carsCount, minPrice },
    fetchVehiclesMeta,
  } = useVehiclesMeta();
  const [activeTab, setActiveTab] = useState<Tab>(Tab.ALL);

  const handleChange = useCallback(
    (_, tabIndex: 0 | 1 | 2) => {
      if (initial) setInitial(false);
      // eslint-disable-next-line no-nested-ternary
      const newActiveTab = tabIndex === 0 ? Tab.ALL : tabIndex === 1 ? Tab.NEW : Tab.USED;
      setActiveTab(newActiveTab);
    },
    [setActiveTab, initial, setInitial],
  );

  useEffect(() => {
    if (initial) return;
    fetchBrandsAction(TypeMapper[activeTab]);
    fetchVehiclesMeta({ type: TypeIdMapper[activeTab] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  useEffect(() => {
    if (initial) return;
    fetchBrandsAction(TypeMapper[activeTab]);
    fetchVehiclesMeta({ type: TypeIdMapper[activeTab] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extraCoverageRadius]);

  return (
    <>
      {IS_STOCK || IS_CASHBACK_PROMO ? (
        <div>
          <SeoTitleTemp title=" #банкавто: автомобильный маркетплейс" />
        </div>
      ) : null}
      {carsCount !== 0 && (
        <Box pb={isMobile ? 1.25 : 2.5}>
          <Typography component="h2" variant={isMobile ? 'h4' : 'h3'} align="center">
            {carsCount.toLocaleString('fr')} {pluralizeCar(carsCount!)} {minPrice && isMobile ? '\n' : ''} от{' '}
            <PriceFormat value={minPrice!} />
          </Typography>
        </Box>
      )}
      <TabsWrapper
        colorScheme="blackRed"
        centered={!isMobile}
        tabs={isMobile ? ['Все', 'Новые', 'C пробегом'] : ['Все', 'Новые автомобили', 'Автомобили с пробегом']}
        value={TabIdxMapper[activeTab]}
        className={root}
        handleChange={handleChange}
      />
      {isMobile ? <Divider className={divider} /> : null}
      <Box pt={!isMobile ? 5 : 2.5}>
        <TabsContent value={TabIdxMapper[activeTab]}>
          <BrandsList
            key={Tab.ALL}
            pathGeneration={(brand: CatalogBrandsShort) => `/car/${brand.alias}/`}
            brands={brands.all}
            className={blocksItem}
          />
          <BrandsList
            key={Tab.NEW}
            pathGeneration={(brand: CatalogBrandsShort) => `/car/${VEHICLE_TYPE.NEW}/${brand.alias}/`}
            brands={brands.new}
            className={blocksItem}
          />
          <BrandsList
            key={Tab.USED}
            pathGeneration={(brand: CatalogBrandsShort) => `/car/${VEHICLE_TYPE.USED}/${brand.alias}/`}
            brands={brands.used}
            className={blocksItem}
          />
        </TabsContent>
      </Box>
    </>
  );
});
