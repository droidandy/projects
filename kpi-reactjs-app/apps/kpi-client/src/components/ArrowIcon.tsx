import * as React from 'react';
import styled from 'styled-components';

interface ArrowIconProps {
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  color?: string;
}

const rotateMap = {
  left: -90,
  right: 90,
  up: 0,
  down: 180,
};

const _ArrowIcon = (props: ArrowIconProps) => {
  const { className, color } = props;
  return (
    <div className={className}>
      <svg
        width="11"
        height="7"
        viewBox="0 0 11 7"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.64844 0.570312C5.53125 0.453125 5.39062 0.382812 5.25 0.382812C5.08594 0.382812 4.94531 0.453125 4.85156 0.570312L0.304688 5.11719C0.1875 5.23438 0.140625 5.375 0.140625 5.51562C0.140625 5.67969 0.1875 5.82031 0.304688 5.91406L0.820312 6.42969C0.914062 6.54688 1.05469 6.61719 1.21875 6.61719C1.35938 6.61719 1.5 6.57031 1.61719 6.45312L5.25 2.82031L8.88281 6.45312C8.97656 6.57031 9.11719 6.61719 9.28125 6.61719C9.42188 6.61719 9.5625 6.54688 9.67969 6.42969L10.1953 5.91406C10.2891 5.82031 10.3594 5.67969 10.3594 5.51562C10.3594 5.375 10.2891 5.23438 10.1953 5.11719L5.64844 0.570312Z"
          fill={color || '#10A6E9'}
        />
      </svg>
    </div>
  );
};

export const ArrowIcon = styled(_ArrowIcon)`
  display: block;
  transform: rotate(${props => rotateMap[props.direction || 'up']}deg);
`;
