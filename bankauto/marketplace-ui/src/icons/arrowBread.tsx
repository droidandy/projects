import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width={12} height={8} viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0.5 3.5C0.223858 3.5 0 3.72386 0 4C0 4.27614 0.223858 4.5 0.5 4.5V3.5ZM11 4.5C11.2761 4.5 11.5 4.27614 11.5 4C11.5 3.72386 11.2761 3.5 11 3.5V4.5ZM0.5 4.5H11V3.5H0.5V4.5Z"
        fill="#222222"
      />
      <path d="M8.5 1L11.5 4L8.5 7" stroke="#222222" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ReactComponent;
