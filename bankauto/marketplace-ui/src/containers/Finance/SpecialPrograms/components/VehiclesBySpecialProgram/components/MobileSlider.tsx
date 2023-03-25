import React, { FC } from 'react';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { Box, Typography } from '@marketplace/ui-kit';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { Link } from 'components';
import { AdsCard } from './AdsCard/AdsCard';
import { SliderProps } from './DesktopSlider';
import { SlideProgress } from './SlideProgress';

const Slider: FC<Pick<SliderProps, 'slides' | 'sliderRef' | 'sliderParamas' | 'loading'>> = ({
  slides,
  sliderRef,
  sliderParamas,
  loading,
}) => {
  return (
    <Box position="relative" ml={-1.25} mr={-1.25}>
      {slides && !loading ? (
        <ReactIdSwiper {...sliderParamas} ref={sliderRef}>
          {slides}
        </ReactIdSwiper>
      ) : (
        <SlideProgress />
      )}
      <AdsCard />
    </Box>
  );
};

export const MobileSlider: FC<SliderProps> = ({
  title,
  goPrev,
  goNext,
  slides,
  catalogLink,
  loading,
  children,
  ...rest
}) => {
  return (
    <>
      <Box display="flex" alignItems="flex-end" justifyContent="space-between" flexWrap="nowrap" pb={1.25}>
        <Typography component="h2" variant="h4" align="left">
          {title}
        </Typography>
        <Box display="flex" flexWrap="nowrap">
          <NavButton direction="prev" onClick={goPrev} />
          <NavButton direction="next" onClick={goNext} style={{ marginLeft: '1.125rem' }} />
        </Box>
      </Box>
      <Box width="max-content">
        <Link href={catalogLink}>
          <Typography component="h5" variant="h5" align="left" color="primary">
            Посмотреть все автомобили
          </Typography>
        </Link>
      </Box>
      {children}
      <Box pt={1.25}>{slides || loading ? <Slider slides={slides} loading={loading} {...rest} /> : null}</Box>
    </>
  );
};
