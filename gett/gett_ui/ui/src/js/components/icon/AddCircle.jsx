import React from 'react';
import IconBase from 'react-icon-base';

export default function AddCircle(props) {
  return (
    <IconBase viewBox="0 0 30 30" { ...props }>
      <g fill="none" fillRule="evenodd">
        <circle cx={ 15 } cy={ 15 } r={ 14 } stroke="#E2E2E2" strokeWidth={ 2 } transform="rotate(-180 15 15)" />
        <path fill="currentColor" fillRule="nonzero" d="M19.667 15.667h-4v4h-1.334v-4h-4v-1.334h4v-4h1.334v4h4z" />
      </g>
    </IconBase>
  );
}
