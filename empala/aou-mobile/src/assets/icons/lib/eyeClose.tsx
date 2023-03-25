import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function EyeClose({ color = '#fff', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <G opacity="0.8">
        <Path d="M11 17.818C12.563 17.7925 14.0768 17.2675 15.32 16.3198L6.68 7.67984C5.15937 8.84101 3.90465 10.3139 3 11.9998C3 11.9998 5.90909 17.818 11 17.818Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11 6.18166C10.4859 6.18045 9.97333 6.23903 9.47273 6.3562L17.4291 14.3198C18.032 13.6033 18.5585 12.8257 19 11.9998C19 11.9998 16.0909 6.18166 11 6.18166Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M3 4L19 20" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M12.5417 13.5416C12.342 13.756 12.1011 13.9279 11.8335 14.0472C11.5658 14.1664 11.2769 14.2306 10.984 14.2357C10.691 14.2409 10.4 14.187 10.1284 14.0773C9.85668 13.9675 9.60989 13.8042 9.40271 13.597C9.19553 13.3898 9.0322 13.1431 8.92247 12.8714C8.81273 12.5997 8.75884 12.3087 8.76401 12.0158C8.76918 11.7228 8.8333 11.4339 8.95255 11.1663C9.0718 10.8986 9.24373 10.6578 9.4581 10.458" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}
