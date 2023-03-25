import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M24 24H40" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 32H40" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 40H32" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M39.1716 54H12C11.4696 54 10.9609 53.7893 10.5858 53.4142C10.2107 53.0391 10 52.5304 10 52V12C10 11.4696 10.2107 10.9609 10.5858 10.5858C10.9609 10.2107 11.4696 10 12 10H52C52.5304 10 53.0391 10.2107 53.4142 10.5858C53.7893 10.9609 54 11.4696 54 12V39.1716C54 39.4342 53.9483 39.6943 53.8478 39.9369C53.7472 40.1796 53.5999 40.4001 53.4142 40.5858L40.5858 53.4142C40.4001 53.5999 40.1796 53.7472 39.9369 53.8478C39.6943 53.9483 39.4342 54 39.1716 54V54Z"
        stroke="#990031"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M53.819 39.998H40V53.818"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReactComponent;
