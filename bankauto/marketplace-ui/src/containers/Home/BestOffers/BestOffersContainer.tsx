import React, { memo, PropsWithChildren, HTMLProps, useCallback, useEffect, useMemo, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useBreakpoints } from '@marketplace/ui-kit';
import { VehicleShort, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { useCity } from 'store/city';
import { useVehiclesBestOffers } from 'store/catalog/bestOffers';
import { VehicleCard } from 'containers/Vehicles/components/Card/VehicleCard';
import { AdsCardCustom } from 'containers/Vehicles/components/AdsCard';
import { BEST_OFFERS_PRISE_RANGES } from 'constants/bestOffersPriceRanges';
import { SliderWrapper, PriceRanges } from './components';

const useSlideStyles = makeStyles(
  () => ({
    root: {
      display: 'block',
      width: '100%',
      position: 'relative',
    },
  }),
  { name: 'BestOffersSlide' },
);
const SlideContainer = memo(({ children, ...props }: PropsWithChildren<HTMLProps<HTMLDivElement>>) => {
  const { root } = useSlideStyles();
  return (
    <div className={root} {...props}>
      {children}
    </div>
  );
});

export const BestOffersContainer = () => {
  const { isMobile } = useBreakpoints();
  const { items, fetchBestOffers, loading } = useVehiclesBestOffers();
  const { extraCoverageRadius } = useCity();
  const [activeTab, setActiveTab] = useState<VEHICLE_TYPE>(VEHICLE_TYPE.NEW);
  const [currentPriceRangeIndex, setCurrentPriceRangeIndex] = useState<number>(0);
  console.log('Лучшие предложения');

  const handleChangeTab = useCallback((event: React.ChangeEvent<any>, tabIndex: 0 | 1) => {
    const newTab = !tabIndex ? VEHICLE_TYPE.NEW : VEHICLE_TYPE.USED;
    setActiveTab(newTab);
  }, []);

  const changeRacePrice = useCallback((priceMin: number, priceMax: number, index: number) => {
    setCurrentPriceRangeIndex(index);
  }, []);

  useEffect(() => {
    const { priceMin, priceMax } = BEST_OFFERS_PRISE_RANGES[currentPriceRangeIndex];
    fetchBestOffers(activeTab, priceMin, priceMax);
  }, [extraCoverageRadius, activeTab, currentPriceRangeIndex, fetchBestOffers]);

  const slides = useMemo<JSX.Element[] | null>(() => {
    if (!items || !items.length) {
      return null;
    }
    const temp = items.reduce((result, item: VehicleShort) => {
      const cardWithAnAd = [
        <SlideContainer>
          <AdsCardCustom />
        </SlideContainer>,
        <SlideContainer>
          <VehicleCard height="37.375rem" {...item} isBestOffersCard />
        </SlideContainer>,
      ];

      const card = [
        <SlideContainer>
          <VehicleCard height="37.375rem" {...item} isBestOffersCard />
        </SlideContainer>,
      ];

      const push = !isMobile && (result.length + 1) % 4 === 0 ? cardWithAnAd : card;
      return [...result, ...push];
    }, [] as JSX.Element[]);
    return [
      ...temp,
      <SlideContainer>
        <AdsCardCustom />
      </SlideContainer>,
    ];
  }, [items, isMobile]);

  return (
    <SliderWrapper
      slides={slides}
      title="Лучшие предложения"
      activeTab={activeTab}
      loading={loading}
      changeTab={handleChangeTab}
    >
      <PriceRanges onChange={changeRacePrice} currentIndex={currentPriceRangeIndex} />
    </SliderWrapper>
  );
};
