import React, { FC, MouseEvent } from 'react';
import cx from 'classnames';
import { useBreakpoints } from '@marketplace/ui-kit';
import { useStyles } from './VehiclesSliderPagination.styles';

interface Props extends PaginationDotsProps {
  isLoop: boolean;
  desktopSlidesPerView: number;
}

interface PaginationDotsProps {
  count: number;
  currentIndex: number;

  setSlideByIndex(index: number): void;
}

export enum BreakpointName {
  Mobile = 'xs',
  Tablet = 'md',
  Desktop = 'lg',
}

const BREAKPOINT_MAP = new Map([
  [BreakpointName.Mobile, 1],
  [BreakpointName.Tablet, 2],
  [BreakpointName.Desktop, 4],
]);

const getSlidesPerView = (mobileBreakpoint: boolean, tabletBreakpoint: boolean) => {
  if (!mobileBreakpoint && !tabletBreakpoint) return BREAKPOINT_MAP.get(BreakpointName.Desktop);
  return mobileBreakpoint ? BREAKPOINT_MAP.get(BreakpointName.Mobile) : BREAKPOINT_MAP.get(BreakpointName.Tablet);
};

const PaginationDots: FC<PaginationDotsProps> = ({ count, currentIndex, setSlideByIndex }) => {
  const { isMobile, isTablet } = useBreakpoints();
  const { dot, dotsContainer } = useStyles();
  const dots = new Array(count).fill(1).map((_item, index) => index);
  const handleDotClick = (e: MouseEvent) => {
    const { target }: { [x: string]: any } = e;

    if (target.closest(`.${dot}`)) setSlideByIndex(Number(target.dataset.index));
  };

  return (
    <div className={dotsContainer} onClick={handleDotClick} role="button" tabIndex={-1} aria-label="Slider Pagination">
      {dots.map((val, index) => (
        <div
          className={cx(dot, currentIndex === index * getSlidesPerView(isMobile, isTablet)! && 'active')}
          key={val}
          data-index={index * getSlidesPerView(isMobile, isTablet)!}
        />
      ))}
    </div>
  );
};

export const VehiclesSliderPagination: FC<Props> = ({
  currentIndex,
  count,
  isLoop,
  desktopSlidesPerView,
  setSlideByIndex,
}) => {
  const { isMobile, isTablet } = useBreakpoints();
  const getDotsCount = (num: number) => {
    return Math.round(num / getSlidesPerView(isMobile, isTablet)!);
  };
  const { desktop } = useStyles();
  const desktopCount = isLoop ? getDotsCount(count) : count + 1 - desktopSlidesPerView;
  return (
    <>
      <div className={desktop}>
        <PaginationDots currentIndex={currentIndex} count={desktopCount} setSlideByIndex={setSlideByIndex} />
      </div>
    </>
  );
};
