import React, { FC } from 'react';
import classNames from 'classnames';
import { useStyles } from './VehicleCardSlider.styles';

interface PaginationDotsProps {
  count: number;
  currentIndex: number;
  active?: boolean;
  onChange?: (index: number | null) => void;
}

export const PaginationDots: FC<PaginationDotsProps> = ({ count, currentIndex, active, onChange }) => {
  const { hoverDot, hoverDotsContainer, dot, dotsContainer } = useStyles();
  const dots = Array.from({ length: count }, (_, i) => i);

  const handleChangeFactory = (index: number) => () => onChange && onChange(index);
  const handleOnLeave = () => onChange && onChange(null);

  return (
    <div>
      <div className={hoverDotsContainer}>
        {dots.map((val, index) => (
          <div
            className={hoverDot}
            key={val}
            style={{
              flexBasis: 100 / count + '%',
            }}
            onMouseEnter={handleChangeFactory(index)}
            onMouseLeave={handleOnLeave}
          />
        ))}
      </div>
      <div className={classNames(dotsContainer, { active })} role="button" tabIndex={-1}>
        {dots.map((val, index) => (
          <div
            className={classNames(dot, { active: index === currentIndex })}
            key={val}
            style={{
              flexBasis: 100 / count - 2 + '%',
            }}
          />
        ))}
      </div>
    </div>
  );
};
