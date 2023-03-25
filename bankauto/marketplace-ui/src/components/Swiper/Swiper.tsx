import React, { memo, MutableRefObject, useEffect, useMemo, useRef, useState } from 'react';
import SwiperBase, { ReactIdSwiperProps, SelectableElement } from 'react-id-swiper';
import classNames from 'classnames';
// import { Button } from '@marketplace/ui-kit';
import { PaginationDots } from './SwiperPagination';
import { useStyles } from './Swiper.styles';

export interface Props extends ReactIdSwiperProps {
  forwardRef?: MutableRefObject<SelectableElement>;
  setRef?: (ref: any) => void;
  className?: string;
  withPagination?: boolean;
  withNavigation?: boolean;
}

const SwiperRoot = ({
  className,
  forwardRef,
  setRef,
  withPagination = false,
  children,
  loop = true,
  spaceBetween = 10,
  slidesPerView = 1,
  centeredSlides = false,
  ...rest
}: Props) => {
  const { root } = useStyles();

  const swiperRef = useRef<SelectableElement>(null);
  const count = useMemo(() => React.Children.count(children), [children]);

  useEffect(() => {
    if (forwardRef && !forwardRef.current && swiperRef.current) {
      // eslint-disable-next-line no-param-reassign
      forwardRef.current = swiperRef.current?.swiper;
    }
    if (setRef && swiperRef.current) {
      setRef(swiperRef.current.swiper);
    }
  }, [forwardRef, swiperRef]);

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance && !swiperInstance.destroyed) {
      setCurrentIndex(swiperInstance.realIndex);

      // such amount of event listeners required, cuz slideChange is not always fired when it should
      if (!loop) {
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
  }, [setCurrentIndex, loop, count]);

  const setSlideByIndex = (index: number) => {
    const swiperInstance = swiperRef.current?.swiper;
    if (swiperInstance && !swiperInstance.destroyed) {
      swiperInstance.slideToLoop(index);
      setCurrentIndex(index);
    }
  };

  return (
    <div className={classNames(root, className)}>
      <SwiperBase
        ref={swiperRef}
        loop={loop}
        spaceBetween={spaceBetween}
        slidesPerView={slidesPerView}
        centeredSlides={centeredSlides}
        {...rest}
      >
        {children}
      </SwiperBase>
      {withPagination ? (
        <PaginationDots
          slidesCount={count}
          currentSlideIndex={currentIndex}
          slidesPerView={Number.isInteger(slidesPerView) ? (slidesPerView as number) : 1}
          setSlideByIndex={setSlideByIndex}
        />
      ) : null}
    </div>
  );
};

export const Swiper = memo(SwiperRoot);
