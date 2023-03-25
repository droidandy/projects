import * as React from "react";
import Svg, { Circle, Path } from "react-native-svg";

const exchange = (props) => (
  <Svg
    viewBox="0 0 26 26"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Circle cx={13} cy={13} r={13} fill="#94A3B8" />
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.25 16.1162L12.625 16.1162L16.125 12.625L19.625 16.1163L17 16.1162L17 22.25L15.25 22.25L15.25 16.1162ZM11.75 4.75L11.75 10.8837L14.375 10.8837L10.875 14.375L7.375 10.8837L10 10.8837L10 4.75L11.75 4.75Z"
      fill="white"
    />
  </Svg>
);

export default exchange;
