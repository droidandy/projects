import React, { FC } from 'react';

export const ErrorIcon: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg width="26" height="34" viewBox="0 0 26 34" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M1 18.7778L18.6 1L15 13L25 15.2222L7.4 33L12.2 20.5556L1 18.7778Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
