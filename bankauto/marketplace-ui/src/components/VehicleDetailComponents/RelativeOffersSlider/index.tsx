import React, { FC, useState } from 'react';
import cx from 'classnames';
import { Box, Typography, CircularProgress, useBreakpoints } from '@marketplace/ui-kit';
import { Swiper } from 'components/Swiper';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { useStyles } from './RelativeOffersSlider.styles';

const SlideProgress = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
    <CircularProgress />
  </Box>
);

type Props = {
  slides?: JSX.Element[];
  loading: boolean;
  title: string;
};

export const RelativeOffersSlider: FC<Props> = ({ slides, loading, title }) => {
  const classes = useStyles();
  const { isMobile } = useBreakpoints();
  const [swiperRef, setSwiperRef] = useState<any>(null);

  const goPrev = () => {
    if (swiperRef) {
      swiperRef.slidePrev();
    }
  };
  const goNext = () => {
    if (swiperRef) {
      swiperRef.slideNext();
    }
  };

  if (loading) return <SlideProgress />;

  return slides?.length ? (
    <>
      {isMobile ? (
        <>
          <Box display="flex" flexWrap="nowrap" alignItems="flex-end" justifyContent="space-between" pb={2.5}>
            <Typography component="h2" variant="h4" align="left">
              {title}
            </Typography>
            <Box display="flex" flexWrap="nowrap">
              <NavButton direction="prev" onClick={goPrev} />
              <NavButton direction="next" onClick={goNext} style={{ marginLeft: '1.125rem' }} />
            </Box>
          </Box>
          <Box position="relative" ml={-1.25} mr={-1.25}>
            {slides ? (
              <Swiper loop setRef={setSwiperRef} slidesPerView={isMobile ? 1 : 4}>
                {slides}
              </Swiper>
            ) : (
              <SlideProgress />
            )}
          </Box>
        </>
      ) : (
        <>
          <Typography component="h2" variant="h3" align="left" style={{ marginBottom: '0.625rem' }}>
            {title}
          </Typography>
          <Box position="relative" ml={-1.25} mr={-1.25}>
            {slides ? (
              <>
                <Swiper loop={false} setRef={setSwiperRef} slidesPerView={isMobile ? 1 : 4}>
                  {slides}
                </Swiper>
                {!isMobile ? (
                  <NavButton direction="prev" onClick={goPrev} className={cx(classes.navButton, classes.buttonPrev)} />
                ) : null}
                {!isMobile ? (
                  <NavButton direction="next" onClick={goNext} className={cx(classes.navButton, classes.buttonNext)} />
                ) : null}
              </>
            ) : (
              <SlideProgress />
            )}
          </Box>
        </>
      )}
    </>
  ) : null;
};
