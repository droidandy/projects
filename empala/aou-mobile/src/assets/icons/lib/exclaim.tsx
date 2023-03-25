import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

const Exclaim = (props) => (
  <Svg
    viewBox="0 0 140 140"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M60.0235 22.5179L10.6152 105.001C9.59652 106.765 9.05751 108.765 9.0518 110.803C9.0461 112.84 9.5739 114.843 10.5827 116.613C11.5915 118.382 13.0461 119.857 14.8018 120.89C16.5576 121.923 18.5532 122.479 20.5902 122.501H119.407C121.444 122.479 123.44 121.923 125.195 120.89C126.951 119.857 128.406 118.382 129.414 116.613C130.423 114.843 130.951 112.84 130.945 110.803C130.94 108.765 130.401 106.765 129.382 105.001L79.9735 22.5179C78.9336 20.8035 77.4694 19.3861 75.7222 18.4024C73.9749 17.4186 72.0037 16.9019 69.9985 16.9019C67.9934 16.9019 66.0221 17.4186 64.2749 18.4024C62.5277 19.3861 61.0634 20.8035 60.0235 22.5179V22.5179Z"
      stroke="#EE625F"
      strokeWidth={11.6667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M70 52.5V75.8333"
      stroke="#EE625F"
      strokeWidth={11.6667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M70 99.1665H70.0583"
      stroke="#EE625F"
      strokeWidth={11.6667}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default Exclaim;
