import React from 'react';
import * as SVG from 'react-native-svg';

export default function Recent({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 20 20" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M3.537 2.37A9.96 9.96 0 0 1 10 0c5.523 0 10 4.477 10 10s-4.477 10-10 10S0 15.523 0 10h1.5A8.5 8.5 0 1 0 10 1.5c-2.176 0-4.218.82-5.774 2.262l1.691.298-.26 1.477-4.075-.718.706-4.006 1.477.261-.228 1.295zm-.189 1.237l-.025-.024-.004.019.029.005zm11.47 9.74l-.747 1.3-5.174-2.969V5.556h1.5v5.253l4.42 2.537z" />
    </SVG.Svg>
  );
}
