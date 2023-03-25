import React, { memo, useEffect, useMemo } from 'react';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleInstalmentListItem } from 'types/Vehicle';
import { useInstalmentBestOffers } from 'store/instalment/bestOffers';
import { VehicleCard } from 'containers/Instalment/components/VehicleCard';
import { AdsCard } from 'containers/Instalment/components/AdsCard';
import { BestOffersSlider } from 'components/HomeComponents';

export const BestOffersContainer = memo(() => {
  const { isMobile } = useBreakpoints();
  const { items, fetchBestOffers } = useInstalmentBestOffers();

  useEffect(() => {
    fetchBestOffers();
  }, [fetchBestOffers]);

  const slides = useMemo<JSX.Element[] | null>(() => {
    if (!items || !items.length) {
      return null;
    }
    return items.reduce((result, item: VehicleInstalmentListItem) => {
      const push =
        !isMobile && (result.length + 1) % 4 === 0
          ? [
              <Box width="100%" position="relative">
                <AdsCard />
              </Box>,
              <Box width="100%" position="relative">
                <VehicleCard height="37.375rem" {...item} />
              </Box>,
            ]
          : [
              <Box width="100%" position="relative">
                <VehicleCard height="37.375rem" {...item} />
              </Box>,
            ];
      return [...result, ...push];
    }, [] as JSX.Element[]);
  }, [items, isMobile]);

  return <BestOffersSlider slides={slides} title="Лучшие предложения" />;
});
