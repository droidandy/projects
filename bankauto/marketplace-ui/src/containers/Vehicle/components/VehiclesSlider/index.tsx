import React, { FC, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import Swiper, { ReactIdSwiperProps, SelectableElement } from 'react-id-swiper';
import { ReactIdSwiperCustomProps, SwiperModules } from 'react-id-swiper/lib/types';
import classNames from 'classnames';
import { Button } from '@marketplace/ui-kit';
import { VehiclesSliderPagination } from './components';
import { useStyles } from './VehiclesSlider.styles';

export interface Props {
  customSwiperParams?: ReactIdSwiperProps | ReactIdSwiperCustomProps;
  modules?: SwiperModules;
  className?: string;
  classItem?: string;
  children: ReactNode;
  [key: string]: any;
  withPagination?: boolean;
}

const swiperParams = {
  loop: true,
  spaceBetween: 10,
  module,
  slidesPerView: 1,
  centeredSlides: false,
} as ReactIdSwiperProps;

export const VehiclesSlider: FC<Props> = ({
  children,
  customSwiperParams = {},
  className,
  classItem,
  withPagination = false,
  ...rest
}: Props) => {
  const { root, carouselContainer, carouselItem, navButton, buttonPrev, buttonNext, shevron } = useStyles();

  const [swiperInstance, setSwiper] = useState<any>(null);
  const swiperRef = useRef<SelectableElement>(null);
  const swiperConfig = useMemo(() => ({ ...swiperParams, ...customSwiperParams }), [customSwiperParams]);

  const count = useMemo(() => React.Children.count(children), [children]);

  const sliderItems = useMemo(() => {
    return React.Children.map(children, (child) => (
      <div className={classItem}>{React.cloneElement(child as ReactElement, { className: carouselItem, ...rest })}</div>
    )) as ReactElement[];
  }, [count, children]);

  useEffect(() => {
    if (swiperRef.current !== null) {
      const {
        current: { swiper },
      } = swiperRef;
      setSwiper(swiper);
    }
  }, [swiperRef]);

  const [isBeginning, isEnd] = swiperInstance ? [swiperInstance.isBeginning, swiperInstance.isEnd] : [true, true];

  const [prevBtnDisabled, nextBtnDisabled] = useMemo(
    () => (!swiperConfig.loop ? [isBeginning, isEnd] : [false, false]),
    [swiperConfig.loop, isBeginning, isEnd],
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (swiperInstance) {
      setCurrentIndex(swiperInstance.realIndex);

      // such amount of event listeners required, cuz slideChange is not always fired when it should
      if (!swiperConfig.loop) {
        swiperInstance.on('reachEnd', () => {
          const { realIndex } = swiperInstance;
          setCurrentIndex(realIndex + (count >= realIndex ? 0 : 1));
        });
      }
      swiperInstance.on('fromEdge', () => {
        setCurrentIndex(swiperInstance.realIndex);
      });
      swiperInstance.on('slideChange', () => {
        setCurrentIndex(swiperInstance.realIndex);
      });
    }
  }, [swiperInstance, swiperConfig.loop, count]);

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  const setSlideByIndex = (index: number) => {
    if (swiperInstance) {
      swiperInstance.slideToLoop(index);
      setCurrentIndex(index);
    }
  };

  return (
    <div className={classNames(root, className)}>
      <Swiper ref={swiperRef} {...swiperConfig} containerClass={carouselContainer}>
        {sliderItems}
      </Swiper>
      <Button
        variant="outlined"
        color={!prevBtnDisabled ? 'default' : 'secondary'}
        onClick={goPrev}
        className={classNames(buttonPrev, navButton, 'sliderButtonLeft sliderButton')}
      >
        <span className={classNames(shevron, 'left')} />
      </Button>
      <Button
        variant="outlined"
        color={!nextBtnDisabled ? 'default' : 'secondary'}
        onClick={goNext}
        className={classNames(buttonNext, navButton, 'sliderButtonRight sliderButton')}
      >
        <span className={shevron} />
      </Button>
      {withPagination && (
        <VehiclesSliderPagination
          count={count}
          currentIndex={currentIndex}
          isLoop={Boolean(swiperConfig.loop)}
          desktopSlidesPerView={
            Number.isInteger(swiperConfig.slidesPerView) ? (swiperConfig.slidesPerView as number) : 0
          }
          setSlideByIndex={setSlideByIndex}
        />
      )}
    </div>
  );
};
