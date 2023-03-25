import Svg, { Circle, G, Path } from 'react-native-svg';
import React from 'react';
import { SvgIconProps } from './types';

export const GiftInCartIcon = ({
  active = false,
  width = 47,
  height = 47,
  style,
}: SvgIconProps) => {
  return (
    <Svg style={style} height={height} width={width} viewBox="0 0 47 47">
      <G
        id="Ellipse_127"
        fill="none"
        stroke="#a2a2a2"
        strokeLinecap="round"
        strokeWidth="1"
        strokeDasharray="2"
      >
        <Circle cx="23.5" cy="23.5" r="23.5" stroke="none" />
        <Circle cx="23.5" cy="23.5" r="23" fill="none" />
      </G>
      <Circle
        id="Ellipse_128"
        cx="18.5"
        cy="18.5"
        r="18.5"
        transform="translate(5 5)"
        fill="#a2a2a2"
      />
      <Path
        id="Icon_awesome-cart-arrow-down"
        d="M15.3,10.259H6.416l.2,1.026h8.139a.76.76,0,0,1,.71.94L15.3,13a1.807,1.807,0,0,1,.958,1.616,1.7,1.7,0,1,1-3.4.05,1.844,1.844,0,0,1,.51-1.332H7.01a1.841,1.841,0,0,1,.51,1.282,1.743,1.743,0,0,1-1.779,1.793,1.753,1.753,0,0,1-1.615-1.7,1.82,1.82,0,0,1,.851-1.654L2.847,2.052H.728A.749.749,0,0,1,0,1.282V.769A.749.749,0,0,1,.728,0H3.837A.739.739,0,0,1,4.55.615l.278,1.437H16.738a.76.76,0,0,1,.71.94L16.014,9.66A.738.738,0,0,1,15.3,10.259Zm-3.084-4.1h-1.3V4.232a.375.375,0,0,0-.364-.385H9.825a.375.375,0,0,0-.364.385V6.156h-1.3a.388.388,0,0,0-.257.657L9.931,8.961a.35.35,0,0,0,.515,0l2.033-2.149A.388.388,0,0,0,12.221,6.156Z"
        transform="translate(14.644 15.492)"
        fill="#fff"
      />
      <G
        id="Ellipse_131"
        fill="none"
        stroke="#328a27"
        strokeLinecap="round"
        strokeWidth="1"
        strokeDasharray="2"
      >
        <Circle cx="23.5" cy="23.5" r="23.5" stroke="none" />
        <Circle cx="23.5" cy="23.5" r="23" fill="none" />
      </G>
      <Circle
        id="Ellipse_132"
        cx="18.5"
        cy="18.5"
        r="18.5"
        transform="translate(5 5)"
        fill="#328a27"
      />
      <Path
        id="Path_447"
        d="M14.92-8.661a.866.866,0,0,0-.25-.607l-1.214-1.214a.866.866,0,0,0-.607-.25.866.866,0,0,0-.607.25L6.384-4.616,3.759-7.25a.866.866,0,0,0-.607-.25.866.866,0,0,0-.607.25L1.33-6.036a.866.866,0,0,0-.25.607.866.866,0,0,0,.25.607L4.563-1.589,5.777-.375a.866.866,0,0,0,.607.25.866.866,0,0,0,.607-.25L8.205-1.589,14.67-8.054A.866.866,0,0,0,14.92-8.661Z"
        transform="translate(16 29)"
        fill="#fff"
      />
    </Svg>
  );
};

/*
<svg xmlns="http://www.w3.org/2000/svg" width="47" height="47" viewBox="0 0 47 47">
  <g id="Ellipse_127" data-name="Ellipse 127" fill="none" stroke="#a2a2a2" stroke-linecap="round" stroke-width="1" stroke-dasharray="2">
    <circle cx="23.5" cy="23.5" r="23.5" stroke="none"/>
    <circle cx="23.5" cy="23.5" r="23" fill="none"/>
  </g>
  <circle id="Ellipse_128" data-name="Ellipse 128" cx="18.5" cy="18.5" r="18.5" transform="translate(5 5)" fill="#a2a2a2"/>
  <path id="Icon_awesome-cart-arrow-down" data-name="Icon awesome-cart-arrow-down" d="M15.3,10.259H6.416l.2,1.026h8.139a.76.76,0,0,1,.71.94L15.3,13a1.807,1.807,0,0,1,.958,1.616,1.7,1.7,0,1,1-3.4.05,1.844,1.844,0,0,1,.51-1.332H7.01a1.841,1.841,0,0,1,.51,1.282,1.743,1.743,0,0,1-1.779,1.793,1.753,1.753,0,0,1-1.615-1.7,1.82,1.82,0,0,1,.851-1.654L2.847,2.052H.728A.749.749,0,0,1,0,1.282V.769A.749.749,0,0,1,.728,0H3.837A.739.739,0,0,1,4.55.615l.278,1.437H16.738a.76.76,0,0,1,.71.94L16.014,9.66A.738.738,0,0,1,15.3,10.259Zm-3.084-4.1h-1.3V4.232a.375.375,0,0,0-.364-.385H9.825a.375.375,0,0,0-.364.385V6.156h-1.3a.388.388,0,0,0-.257.657L9.931,8.961a.35.35,0,0,0,.515,0l2.033-2.149A.388.388,0,0,0,12.221,6.156Z" transform="translate(14.644 15.492)" fill="#fff"/>
  <g id="Ellipse_131" data-name="Ellipse 131" fill="none" stroke="#328a27" stroke-linecap="round" stroke-width="1" stroke-dasharray="2">
    <circle cx="23.5" cy="23.5" r="23.5" stroke="none"/>
    <circle cx="23.5" cy="23.5" r="23" fill="none"/>
  </g>
  <circle id="Ellipse_132" data-name="Ellipse 132" cx="18.5" cy="18.5" r="18.5" transform="translate(5 5)" fill="#328a27"/>
  <path id="Path_447" data-name="Path 447" d="M14.92-8.661a.866.866,0,0,0-.25-.607l-1.214-1.214a.866.866,0,0,0-.607-.25.866.866,0,0,0-.607.25L6.384-4.616,3.759-7.25a.866.866,0,0,0-.607-.25.866.866,0,0,0-.607.25L1.33-6.036a.866.866,0,0,0-.25.607.866.866,0,0,0,.25.607L4.563-1.589,5.777-.375a.866.866,0,0,0,.607.25.866.866,0,0,0,.607-.25L8.205-1.589,14.67-8.054A.866.866,0,0,0,14.92-8.661Z" transform="translate(16 29)" fill="#fff"/>
</svg>

 */
