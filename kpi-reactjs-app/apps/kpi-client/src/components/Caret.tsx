import * as React from 'react';
import styled from 'styled-components';

interface CaretProps {
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right';
}

const rotateMap = {
  left: 90,
  right: -90,
  up: 180,
  down: 0,
};

const _Caret = (props: CaretProps) => {
  const { className } = props;
  return (
    <div className={className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="10"
        height="6"
        fill="none"
        viewBox="0 0 10 6"
      >
        <path
          fill="#244159"
          d="M.969 0C.688 0 .5.156.406.406c-.125.25-.062.469.125.656l4.032 4.032c.125.125.25.187.437.187a.617.617 0 00.438-.187l4.03-4.032c.188-.187.22-.406.126-.656C9.469.156 9.28 0 9.03 0H.97z"
        ></path>
      </svg>
    </div>
  );
};

export const Caret = styled(_Caret)`
  display: flex;
  width: 10px;
  height: 10px;
  align-items: center;
  justify-content: center;
  transform: rotate(${props => rotateMap[props.direction || 'up']}deg);
`;
