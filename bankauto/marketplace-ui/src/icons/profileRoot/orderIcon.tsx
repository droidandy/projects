import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8 12C8 9.79086 9.79086 8 12 8H20H52C54.2091 8 56 9.79086 56 12V52C56 54.2091 54.2091 56 52 56H20H12C9.79086 56 8 54.2091 8 52V12ZM22 52H52V12H22V52ZM18 12V52H12V12H18ZM28 26C26.8954 26 26 26.8954 26 28C26 29.1046 26.8954 30 28 30H44C45.1046 30 46 29.1046 46 28C46 26.8954 45.1046 26 44 26H28ZM28 34C26.8954 34 26 34.8954 26 36C26 37.1046 26.8954 38 28 38H44C45.1046 38 46 37.1046 46 36C46 34.8954 45.1046 34 44 34H28Z"
        fill="#990031"
      />
    </svg>
  );
};

export default ReactComponent;
