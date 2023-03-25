import React from 'react';
import * as SVG from 'react-native-svg';

export default function Clock({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 26 26" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M12.989 1.25C19.484 1.25 24.75 6.512 24.75 13s-5.266 11.75-11.761 11.75C6.505 24.75 1.25 19.488 1.25 13S6.505 1.25 12.989 1.25zm0 1.5C7.334 2.75 2.75 7.34 2.75 13s4.584 10.25 10.239 10.25c5.667 0 10.261-4.59 10.261-10.25S18.656 2.75 12.989 2.75zm5.989 13.255l-.772 1.286-6.14-3.683V6.583h1.5v6.176l5.412 3.246z" />
    </SVG.Svg>
  );
}
