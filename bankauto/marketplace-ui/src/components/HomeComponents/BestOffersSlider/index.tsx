import React, { memo, FC, useRef } from 'react';
import cx from 'classnames';
import { Box, CircularProgress, Grid, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { Swiper } from 'swiper';
import { SwiperRefNode } from 'react-id-swiper';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { AdsCard } from 'containers/Instalment/components/AdsCard';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { useStyles } from './BestOffersSlider.styles';

const SlideProgress = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
    <CircularProgress />
  </Box>
);

type Props = {
  slides?: JSX.Element[] | null;
  title: string;
};

export const BestOffersSlider: FC<Props> = memo(({ slides, title }) => {
  const classes = useStyles();
  const { isMobile } = useBreakpoints();

  const gallerySwiperRef = useRef<SwiperRefNode>(null);

  const goPrev = () => {
    gallerySwiperRef?.current?.swiper?.slidePrev();
  };
  const goNext = () => {
    gallerySwiperRef?.current?.swiper?.slideNext();
  };

  const gallerySwiperParams: ReactIdSwiperCustomProps = {
    Swiper,
    spaceBetween: 10,
    slidesPerView: isMobile ? 1 : 4,
  };

  return (
    <>
      {isMobile ? (
        <>
          <Box display="flex" alignItems="flex-end" justifyContent="space-between" flexWrap="nowrap" pb={1.25}>
            <Typography component="h2" variant="h4" align="left" className={classes.sliderTitle}>
              {title}
            </Typography>
            <Box display="flex" flexWrap="nowrap">
              <NavButton direction="prev" onClick={goPrev} />
              <NavButton direction="next" onClick={goNext} style={{ marginLeft: '1.125rem' }} />
            </Box>
          </Box>
          <Box position="relative" ml={-1.25} mr={-1.25}>
            {slides ? (
              <ReactIdSwiper {...gallerySwiperParams} ref={gallerySwiperRef}>
                {slides}
              </ReactIdSwiper>
            ) : (
              <SlideProgress />
            )}
            <Box pt={5}>
              <AdsCard />
            </Box>
          </Box>
        </>
      ) : (
        <>
          <Box pb={5}>
            <Typography component="h2" variant="h2" align="center">
              {title}
            </Typography>
          </Box>
          <Box position="relative">
            {slides ? (
              <>
                <ReactIdSwiper {...gallerySwiperParams} ref={gallerySwiperRef}>
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
        </>
      )}
    </>
  );
});
