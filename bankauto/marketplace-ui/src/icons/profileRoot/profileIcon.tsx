import React, { FC } from 'react';

export const ReactComponent: FC<React.SVGProps<SVGSVGElement>> = (props) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M38 28H48" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M38 36H48" stroke="#990031" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M23.0254 36C26.3391 36 29.0254 33.3137 29.0254 30C29.0254 26.6863 26.3391 24 23.0254 24C19.7117 24 17.0254 26.6863 17.0254 30C17.0254 33.3137 19.7117 36 23.0254 36Z"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.2773 41.9999C15.7212 40.2826 16.7231 38.7614 18.1254 37.6754C19.5278 36.5894 21.2513 36.0001 23.025 36C24.7987 35.9999 26.5222 36.5892 27.9247 37.6751C29.3271 38.761 30.3291 40.2821 30.7731 41.9993"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M54 12H10C8.89543 12 8 12.8954 8 14V50C8 51.1046 8.89543 52 10 52H54C55.1046 52 56 51.1046 56 50V14C56 12.8954 55.1046 12 54 12Z"
        stroke="#990031"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ReactComponent;
