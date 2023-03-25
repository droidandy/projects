import React, { FC, useCallback } from 'react';
import cx from 'classnames';
import { useStyles } from './SwiperPagination.styles';

interface PaginationDotsProps {
  slidesCount: number;
  currentSlideIndex: number;
  setSlideByIndex(index: number): void;
  slidesPerView?: number;
}

export const PaginationDots: FC<PaginationDotsProps> = ({
  slidesCount,
  currentSlideIndex,
  setSlideByIndex,
  slidesPerView = 1,
}) => {
  const { dot, dotsContainer } = useStyles();
  const dots = new Array(Math.ceil(slidesCount / slidesPerView)).fill(1).map((_item, index) => index * slidesPerView);
  const isActive = useCallback(
    (dotIndex: number) => {
      return dotIndex > currentSlideIndex - slidesPerView && dotIndex <= currentSlideIndex;
    },
    [currentSlideIndex, slidesPerView],
  );
  return (
    <div className={dotsContainer} role="button" tabIndex={-1} aria-label="Slider Pagination">
      {dots.map((dotIndex) => (
        <div
          key={dotIndex}
          role="button"
          tabIndex={-1}
          className={cx(dot, isActive(dotIndex) && 'active')}
          onClick={() => setSlideByIndex(dotIndex)}
          aria-label="Slider Pagination Item"
          style={{ outline: 'none' }}
        />
      ))}
    </div>
  );
};
