import React from 'react';

export const arrowUp = ({color = '#777777', ...rest}) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M16.59 15.4099L12 10.8299L7.41 15.4099L6 13.9999L12 7.99991L18 13.9999L16.59 15.4099Z" fill={color}/>
  </svg>
);
