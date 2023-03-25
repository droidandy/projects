import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M24 26H40" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M24 34H40" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M37.4174 48.9709L33.715 55.1416C33.5373 55.4377 33.2859 55.6828 32.9854 55.853C32.6849 56.0231 32.3454 56.1126 32 56.1126C31.6546 56.1126 31.3151 56.0231 31.0146 55.853C30.7141 55.6828 30.4627 55.4377 30.285 55.1416L26.5826 48.9709C26.4049 48.6747 26.1536 48.4296 25.853 48.2595C25.5525 48.0893 25.213 47.9999 24.8676 47.9999H10C9.46957 47.9999 8.96086 47.7892 8.58579 47.4141C8.21071 47.039 8 46.5303 8 45.9999V14C8 13.4696 8.21071 12.9609 8.58579 12.5858C8.96086 12.2107 9.46957 12 10 12H54C54.5304 12 55.0391 12.2107 55.4142 12.5858C55.7893 12.9609 56 13.4696 56 14V46C56 46.5304 55.7893 47.0391 55.4142 47.4142C55.0391 47.7893 54.5304 48 54 48L39.1324 47.9999C38.787 47.9999 38.4475 48.0893 38.147 48.2595C37.8464 48.4296 37.5951 48.6747 37.4174 48.9709V48.9709Z"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReactComponent;
