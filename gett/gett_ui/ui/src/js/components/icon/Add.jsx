import React from 'react';
import IconBase from 'react-icon-base';

export default function Add(props) {
  return (
    <IconBase viewBox="0 0 20 20" { ...props }>
      <g fill="none" fillRule="nonzero">
        <path d="M0 0h20v20H0z" />
        <path fill="currentColor" d="M9 4h2v12H9z" />
        <path fill="currentColor" d="M16 9v2H4V9z" />
      </g>
    </IconBase>
  );
}
