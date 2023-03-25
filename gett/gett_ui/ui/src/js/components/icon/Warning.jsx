import React from 'react';
import IconBase from 'react-icon-base';

export default function Alert(props) {

  return (
    <IconBase viewBox="0 0 32 28" { ...props }>
      <g fillRule="nonzero">
        <path d="M16 20a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm0-10a1 1 0 0 1 1 1v7a1 1 0 0 1-2 0v-7a1 1 0 0 1 1-1z" />
        <path d="M16 2.004L2.055 25.996h27.89L16 2.004zm15.732 23.004c.56.963.213 2.186-.774 2.732-.31.17-.659.26-1.014.26H2.055C.92 28 0 27.103 0 25.996c0-.346.092-.687.267-.988L14.211 1.016c.56-.963 1.815-1.3 2.802-.755.324.179.592.44.775.755l13.944 23.992z" />
      </g>
    </IconBase>
  );
}
