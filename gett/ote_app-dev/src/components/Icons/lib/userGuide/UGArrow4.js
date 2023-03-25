import React from 'react';
import Svg, { Defs, LinearGradient, Stop, G, Path } from 'react-native-svg';

export default function UGArrow4({ color, ...rest }) {
  return (
    <Svg viewBox="0 0 45 42" {...rest}>
      <Defs>
        <LinearGradient id="a" x1="50%" x2="50%" y1="0%" y2="100%">
          <Stop offset="0%" stopColor={color || '#fff'} stopOpacity=".144"/>
          <Stop offset="100%" stopColor={color || '#fff'}/>
        </LinearGradient>
      </Defs>
      <G fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
        <Path stroke="url(#a)" d="M20.603.061C-.487 14.274-4.657 31.977 8.091 53.171" transform="scale(1 -1) rotate(32 102.846 19.961)"/>
        <Path stroke={color || '#fff'} d="M.77 5.55L5.23.99l3.498 5.395"/>
      </G>
    </Svg>
  );
}
