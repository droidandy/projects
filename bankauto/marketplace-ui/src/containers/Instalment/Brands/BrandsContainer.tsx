import React, { FC, memo, useEffect } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { CatalogBrandsShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { useInstalmentBrands } from 'store/instalment/brands';
import { BrandsList } from 'components/HomeComponents';
import { useStyles } from './BrandsContainer.styles';

export const BrandsContainer: FC = memo(() => {
  const { brands, loading, error, fetchBrandsAction, initial } = useInstalmentBrands();
  const { isMobile } = useBreakpoints();
  const { blocksItem } = useStyles();

  useEffect(() => {
    if (!(loading || error || brands?.length !== 0 || initial !== null)) {
      fetchBrandsAction();
    }
  }, [loading, fetchBrandsAction, brands, error, initial]);

  return (
    <Box pt={!isMobile ? 5 : 2.5}>
      <BrandsList
        key={VEHICLE_TYPE.USED}
        pathGeneration={(brand: CatalogBrandsShort) => `/installment/vehicles/?brand=${brand.id}`}
        brands={brands}
        className={blocksItem}
      />
    </Box>
  );
});
