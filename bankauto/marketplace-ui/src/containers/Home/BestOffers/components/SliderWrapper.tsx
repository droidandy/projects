import React, { memo, FC, useRef } from 'react';
import { useBreakpoints } from '@marketplace/ui-kit';
import { Swiper } from 'swiper';
import { SwiperRefNode } from 'react-id-swiper';
import { ReactIdSwiperCustomProps } from 'react-id-swiper/lib/types';
import { MobileSlider, DesktopSlider, SliderProps } from './index';

export const SliderWrapper: FC<Pick<SliderProps, 'slides' | 'title' | 'activeTab' | 'changeTab' | 'loading'>> = memo(
  ({ children, ...rest }) => {
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

    const sliderProps = {
      ...rest,
      sliderRef: gallerySwiperRef,
      sliderParamas: gallerySwiperParams,
      goPrev,
      goNext,
    };

    return isMobile ? (
      <MobileSlider {...sliderProps}>{children}</MobileSlider>
    ) : (
      <DesktopSlider {...sliderProps}>{children}</DesktopSlider>
    );
  },
);
