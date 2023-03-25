import React from 'react';

export const close = ({color = '#333E66', ...rest}) => (
  <svg viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <rect x="2.57422" y="0.954102" width="24" height="3" transform="rotate(45 2.57422 0.954102)" fill={color}/>
    <rect x="0.454102" y="17.9246" width="24" height="3" transform="rotate(-45 0.454102 17.9246)" fill={color}/>
  </svg>
);
