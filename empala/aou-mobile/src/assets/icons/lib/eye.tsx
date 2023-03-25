import React from 'react';
import Svg, { G, Path } from 'react-native-svg';

export default function Eye({ color = '#fff', ...rest }) {
  return (
    <Svg viewBox="0 0 24 24" {...rest}>
      <G opacity="0.8">
        <Path d="M3.03833 11.7831C3.03833 11.7831 6.12227 5.61523 11.5192 5.61523C16.916 5.61523 20 11.7831 20 11.7831C20 11.7831 16.916 17.951 11.5192 17.951C6.12227 17.951 3.03833 11.7831 3.03833 11.7831Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <Path d="M11.5191 14.0961C12.7965 14.0961 13.8321 13.0606 13.8321 11.7832C13.8321 10.5058 12.7965 9.47021 11.5191 9.47021C10.2417 9.47021 9.20618 10.5058 9.20618 11.7832C9.20618 13.0606 10.2417 14.0961 11.5191 14.0961Z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}
