import React from 'react';
import * as SVG from 'react-native-svg';

export default function Phone({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 16 24" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M2 1.5a.5.5 0 0 0-.5.5v20a.5.5 0 0 0 .5.5h12a.5.5 0 0 0 .5-.5V2a.5.5 0 0 0-.5-.5H2zM2 0h12a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2zm5.75 20h.5a.75.75 0 1 1 0 1.5h-.5a.75.75 0 1 1 0-1.5z" />
    </SVG.Svg>
  );
}
