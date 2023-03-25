import React, { FC, memo, PropsWithChildren, HTMLProps, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleShort } from '@marketplace/ui-kit/types';
import { VehicleCard } from 'containers/Vehicles/components/Card/VehicleCard';
import { AdsCard } from './components/AdsCard/AdsCard';
import { SliderWrapper } from './components';

const useSlideStyles = makeStyles(
  () => ({
    root: {
      display: 'block',
      width: '100%',
      position: 'relative',
    },
    vehicleCardWrapper: {
      '&>a>div:hover': {
        borderColor: 'transparent',
      },
      '&>a>div>div:after': {
        display: 'block',
      },
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

interface Props {
  items: VehicleShort[];
  catalogLink: string;
  loading: boolean;
}

export const VehiclesBySpecialProgram: FC<Props> = ({ items, loading, catalogLink }) => {
  const { isMobile } = useBreakpoints();
  const { vehicleCardWrapper } = useSlideStyles();

  const slides = useMemo<JSX.Element[] | null>(() => {
    if (!items || !items.length) {
      return null;
    }
    const temp = items.reduce((result, item: VehicleShort) => {
      const cardWithAnAd = [
        <SlideContainer>
          <AdsCard />
        </SlideContainer>,
        <SlideContainer>
          <VehicleCard height="37.375rem" {...item} />
        </SlideContainer>,
      ];

      const card = [
        <SlideContainer>
          <Box className={vehicleCardWrapper}>
            <VehicleCard height="37.375rem" {...item} />
          </Box>
        </SlideContainer>,
      ];

      const push = !isMobile && (result.length + 1) % 4 === 0 ? cardWithAnAd : card;
      return [...result, ...push];
    }, [] as JSX.Element[]);
    return [
      ...temp,
      <SlideContainer>
        <AdsCard />
      </SlideContainer>,
    ];
  }, [items, isMobile, vehicleCardWrapper]);

  return <SliderWrapper slides={slides} title="Авто по спецпрограмме" loading={loading} catalogLink={catalogLink} />;
};
