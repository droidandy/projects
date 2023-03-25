import React, { memo, useMemo, useEffect, useState } from 'react';
import cx from 'classnames';
import {
  Box,
  Grid,
  useBreakpoints,
  CircularProgress,
  Typography,
  ContainerWrapper,
  OmniLink,
} from '@marketplace/ui-kit';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { useSpecialPrograms } from 'store/finance/specialPrograms';
import { Swiper } from 'components/Swiper';
import { useStyles } from './SpecialProgramsSlider.styles';
import { SpecialProgramsSlide } from './SpecialProgramsSlide/SpecialProgramsSlide';

const SlideProgress = () => (
  <Box display="flex" justifyContent="center" alignItems="center" height="100%" width="100%">
    <CircularProgress />
  </Box>
);

export const SpecialProgramsSlider = memo(() => {
  const s = useStyles();

  const { isMobile } = useBreakpoints();
  const { items, initial, fetchSpecialPrograms } = useSpecialPrograms();

  useEffect(() => {
    if (!initial) {
      fetchSpecialPrograms();
    }
  }, [fetchSpecialPrograms, initial]);

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

  const slides = useMemo(
    () =>
      items?.length &&
      items?.map((item) => (
        <Box width="90%" key={item.slug} position="relative">
          <OmniLink href={`/finance/special-program/${item.slug}/`}>
            <SpecialProgramsSlide item={item} />
          </OmniLink>
        </Box>
      )),
    [items],
  );

  if (!items?.length) {
    return null;
  }

  return (
    <ContainerWrapper className={s.specialProgramsContainer}>
      <Typography align="center" variant={isMobile ? 'h4' : 'h2'} className={s.header}>
        Спецпрограммы
      </Typography>
      {isMobile ? (
        <Box position="relative">
          {slides ? (
            <Swiper loop={false} setRef={setSwiperRef} slidesPerView="auto" key="mobile">
              {slides}
            </Swiper>
          ) : (
            <SlideProgress />
          )}
        </Box>
      ) : (
        <Box position="relative" className={cx({ [s.swiperWrapper]: slides && slides.length < 4 })}>
          {slides ? (
            <>
              <Swiper
                loop={false}
                setRef={setSwiperRef}
                spaceBetween={40}
                withPagination={slides.length > 4}
                slidesPerView={(slides.length === 3 && 3) || slides.length > 2 ? 4 : 2}
                key="desktop"
              >
                {slides}
              </Swiper>
              {slides.length > 4 && (
                <>
                  <NavButton direction="prev" onClick={goPrev} className={cx(s.navButton, s.buttonPrev)} />
                  <NavButton direction="next" onClick={goNext} className={cx(s.navButton, s.buttonNext)} />
                </>
              )}
            </>
          ) : (
            <Grid container alignItems="center">
              <SlideProgress />
            </Grid>
          )}
        </Box>
      )}
    </ContainerWrapper>
  );
});
