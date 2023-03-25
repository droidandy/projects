import React from 'react';

export const document = ({color = '#333E66', ...rest}) => (
  <svg viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path d="M10 0H2C0.9 0 0.0100002 0.9 0.0100002 2L0 18C0 19.1 0.89 20 1.99 20H14C15.1 20 16 19.1 16 18V6L10 0ZM2 18V2H9V7H14V18H2Z" fill="#008E5B"/>
  </svg>
);
