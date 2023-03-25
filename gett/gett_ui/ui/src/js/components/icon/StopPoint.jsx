import React from 'react';
import IconBase from 'react-icon-base';

export default function StopPoint(props) {
  return (
    <IconBase viewBox="0 0 12 12" { ...props }>
      <g fill="none" fillRule="nonzero">
        <circle cx="6" cy="6" r="6" fill="#989898" />
        <circle cx="6" cy="6" r="3" fill="#FFF" />
      </g>
    </IconBase>
  );
}
