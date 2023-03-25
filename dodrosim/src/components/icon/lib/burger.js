import React from 'react';

export const burger = ({color = '#333E66', ...rest}) => (
  <svg viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <rect width="24" height="3" fill={color}/>
    <rect y="9" width="24" height="3" fill={color}/>
  </svg>
);
