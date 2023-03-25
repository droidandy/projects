import React from 'react';
import IconBase from 'react-icon-base';

export default function Menu(props) {

  return (
    <IconBase viewBox="0 0 20 20" { ...props }>
      <g fill="#000" fillRule="evenodd" transform="translate(0 1)">
        <rect width="24" height="2" rx="1" />
        <rect width="16.8" height="2" y="8" rx="1" />
        <rect width="24" height="2" y="16" rx="1" />
      </g>
    </IconBase>
  );
}
