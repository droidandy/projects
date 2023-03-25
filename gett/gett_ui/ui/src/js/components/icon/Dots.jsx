import React from 'react';
import IconBase from 'react-icon-base';

export default function Dots(props) {

  return (
    <IconBase viewBox="0 0 20 20" { ...props }>
      <path fill="currentColor" fillRule="evenodd" d="M2 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </IconBase>
  );
}
