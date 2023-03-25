import React, { FC, useRef } from 'react';
import cx from 'classnames';
import { Swiper } from 'swiper';
import { SwiperRefNode } from 'react-id-swiper';
import ReactIdSwiper from 'react-id-swiper/lib/ReactIdSwiper.custom';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { NavButton } from 'components/Swiper/SwiperNavButton';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './ServiceSlider.styles';
import { Props } from './types';

export const ServiceSlider: FC<Props> = (props) => {
  const { slides, children } = props;
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const sliderRef = useRef<SwiperRefNode>(null);

  const sliderParams: ReactIdSwiperCustomProps = {
    Swiper,
    spaceBetween: 40,
    slidesPerView: isMobile ? 1 : 3,
  };

  const goPrev = () => {
    sliderRef?.current?.swiper?.slidePrev();
  };

  const goNext = () => {
    sliderRef?.current?.swiper?.slideNext();
  };

  return (
    <div className={s.root}>
      {slides && (
        <ReactIdSwiper {...sliderParams} ref={sliderRef}>
          {slides}
        </ReactIdSwiper>
      )}

      <NavButton direction="prev" onClick={goPrev} className={cx(s.navButton, s.buttonPrev)} />
      <NavButton direction="next" onClick={goNext} className={cx(s.navButton, s.buttonNext)} />
    </div>
  );
};
