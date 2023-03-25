import React, { FC } from 'react';
import cx from 'classnames';
import { SwiperRefNode } from 'react-id-swiper';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { Box, Grid, Typography } from '@marketplace/ui-kit';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { Link } from 'components';
import { AdsCard } from './AdsCard/AdsCard';
import { SlideProgress } from './SlideProgress';
import { useStyles } from './Slider.styles';

export type SliderProps = {
  slides?: JSX.Element[] | null;
  title: string;
  goPrev: () => void;
  goNext: () => void;
  sliderRef: React.RefObject<SwiperRefNode>;
  sliderParamas: ReactIdSwiperCustomProps;
  loading: boolean;
  catalogLink: string;
};

const Slider: FC<Omit<SliderProps, 'title' | 'catalogLink'>> = ({
  slides,
  goPrev,
  goNext,
  sliderRef,
  sliderParamas,
  loading,
}) => {
  const classes = useStyles();
  return (
    <Box position="relative">
      {slides && !loading ? (
        <>
          <ReactIdSwiper {...sliderParamas} ref={sliderRef}>
            {slides}
          </ReactIdSwiper>
          <NavButton direction="prev" onClick={goPrev} className={cx(classes.navButton, classes.buttonPrev)} />
          <NavButton direction="next" onClick={goNext} className={cx(classes.navButton, classes.buttonNext)} />
        </>
      ) : (
        <Grid container alignItems="center">
          <Grid item xs={12} sm={9}>
            <SlideProgress />
          </Grid>
          <Grid item xs={12} sm={3}>
            <AdsCard />
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export const DesktopSlider: FC<SliderProps> = ({ title, slides, loading, children, catalogLink, ...rest }) => {
  return (
    <Box pb={5}>
      <Box pb={2.5} position="relative">
        <Typography component="h2" variant="h2" align="center">
          {title}
        </Typography>
        <Box position="absolute" right="0.625rem" bottom="2rem">
          <Link href={catalogLink}>
            <Typography component="h5" variant="h5" align="center">
              Посмотреть все автомобили
            </Typography>
          </Link>
        </Box>
      </Box>
      {children}
      <Box pt={5}>{slides || loading ? <Slider slides={slides} loading={loading} {...rest} /> : null}</Box>
    </Box>
  );
};
