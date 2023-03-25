import React from 'react';
import * as SVG from 'react-native-svg';

export default function SetOnMap({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 16 24" {...rest}>
      <SVG.Path fill={color || '#373737' } fillRule="nonzero" d="M8 14.414c3.59 0 6.5-2.893 6.5-6.461 0-3.569-2.91-6.462-6.5-6.462S1.5 4.384 1.5 7.953c0 3.568 2.91 6.461 6.5 6.461zm-.737 1.458C3.19 15.502 0 12.098 0 7.952 0 3.562 3.582 0 8 0s8 3.56 8 7.953c0 4.136-3.177 7.535-7.237 7.917v7.38a.75.75 0 1 1-1.5 0v-7.378zM8 9.746A1.78 1.78 0 0 0 9.786 7.97c0-.98-.8-1.775-1.786-1.775A1.78 1.78 0 0 0 6.214 7.97c0 .98.8 1.776 1.786 1.776zm0 1.49A3.276 3.276 0 0 1 4.714 7.97 3.276 3.276 0 0 1 8 4.704a3.276 3.276 0 0 1 3.286 3.266A3.276 3.276 0 0 1 8 11.237z" />
    </SVG.Svg>
  );
}
