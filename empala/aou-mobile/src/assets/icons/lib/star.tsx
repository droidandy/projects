import React from 'react';
import Svg, { Path } from 'react-native-svg';

const star = (props) => (
  <Svg viewBox="0 0 24 24" fill="none" {...props}>
    <Path d="M12 2.90186L14.781 8.53586L21 9.44486L16.5 13.8279L17.562 20.0199L12 17.0949L6.438 20.0199L7.5 13.8279L3 9.44486L9.219 8.53586L12 2.90186Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export default star;
