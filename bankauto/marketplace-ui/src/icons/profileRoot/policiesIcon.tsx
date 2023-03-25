import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10 26.6667V12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10H52C52.5304 10 53.0391 10.2107 53.4142 10.5858C53.7893 10.9609 54 11.4696 54 12V26.6667C54 47.6705 36.1735 54.6292 32.6141 55.8093C32.2161 55.9463 31.7839 55.9463 31.386 55.8093C27.8265 54.6292 10 47.6705 10 26.6667Z"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M43 24L28.3333 38L21 31" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default ReactComponent;
