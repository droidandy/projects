/* eslint-disable max-len */
import React from 'react';
import Svg, { Path, G, Rect } from 'react-native-svg';

export const closeIcon = (): JSX.Element => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M14.6667 3.75171L3.60358 14.8148" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M3.60358 3.75171L14.6667 14.8148" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const switchIcon = (): JSX.Element => (
  <Svg width="37" height="38" viewBox="0 0 37 38" fill="none">
    <G opacity="0.2">
      <Path d="M32.375 16.625C32.375 16.625 21.169 16.625 19.2708 16.625" stroke="white" strokeWidth="3.16667" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4.625 22.9583C4.625 22.9583 15.4167 22.9583 17.7292 22.9583" stroke="white" strokeWidth="3.16667" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M26.2083 10.2916L32.375 16.625L26.2083 22.9583" stroke="white" strokeWidth="3.16667" strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M10.7917 16.625L4.625 22.9584L10.7917 29.2917" stroke="white" strokeWidth="3.16667" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  </Svg>
);

export const octagonIcon = (): JSX.Element => (
  <Svg width="102" height="102" viewBox="0 0 102 102" fill="none">
    <Path d="M33.405 8.5H68.595L93.5 33.405V68.595L68.595 93.5H33.405L8.5 68.595V33.405L33.405 8.5Z" stroke="white" strokeOpacity="0.2" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M65.8713 40.3713C67.0429 39.1997 67.0429 37.3003 65.8713 36.1287C64.6997 34.9571 62.8003 34.9571 61.6287 36.1287L51 46.7574L40.3713 36.1287C39.1997 34.9571 37.3003 34.9571 36.1287 36.1287C34.9571 37.3003 34.9571 39.1997 36.1287 40.3713L46.7574 51L36.1287 61.6287C34.9571 62.8003 34.9571 64.6997 36.1287 65.8713C37.3003 67.0429 39.1997 67.0429 40.3713 65.8713L51 55.2426L61.6287 65.8713C62.8003 67.0429 64.6997 67.0429 65.8713 65.8713C67.0429 64.6997 67.0429 62.8003 65.8713 61.6287L55.2426 51L65.8713 40.3713Z" fill="white" fillOpacity="0.2" />
  </Svg>
);

export const backArrowIcon = (): JSX.Element => (
  <Svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <Path d="M14.9999 8.58984H3.67944" stroke="white" strokeWidth="1.61721" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9.33967 14.2501L3.67944 8.58992L9.33967 2.92969" stroke="white" strokeWidth="1.61721" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const growingChartIcon = (): JSX.Element => (
  <Svg width="21" height="22" viewBox="0 0 21 22" fill="none">
    <Rect x="21" y="21.5" width="21" height="21" rx="10.5" transform="rotate(-180 21 21.5)" fill="white" />
    <Path d="M15.5 8.5L11.6 12.4L9.4 10.2L6 13.5" stroke="#00C0A9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const fallingChartIcon = (): JSX.Element => (
  <Svg width="21" height="21" viewBox="0 0 21 21" fill="none">
    <Rect x="21" y="21" width="21" height="21" rx="10.5" transform="rotate(-180 21 21)" fill="white" />
    <Path d="M6 8L9.9 11.9L12.1 9.7L15.5 13" stroke="#EA2B27" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

export const switcherOn = (): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M6 6C2.68629 6 0 8.68629 0 12C0 15.3137 2.68629 18 6 18H18C21.3137 18 24 15.3137 24 12C24 8.68629 21.3137 6 18 6H6ZM18 16C20.2091 16 22 14.2091 22 12C22 9.79086 20.2091 8 18 8C15.7909 8 14 9.79086 14 12C14 14.2091 15.7909 16 18 16Z" fill="#94A3B8" />
  </Svg>
);

export const switcherOff = (): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path d="M6 16C8.20914 16 10 14.2091 10 12C10 9.79086 8.20914 8 6 8C3.79086 8 2 9.79086 2 12C2 14.2091 3.79086 16 6 16Z" fill="#0F172A" />
    <Path fillRule="evenodd" clipRule="evenodd" d="M0 12C0 8.68629 2.68629 6 6 6H18C21.3137 6 24 8.68629 24 12C24 15.3137 21.3137 18 18 18H6C2.68629 18 0 15.3137 0 12ZM6 7H18C20.7614 7 23 9.23858 23 12C23 14.7614 20.7614 17 18 17H6C3.23858 17 1 14.7614 1 12C1 9.23858 3.23858 7 6 7Z" fill="#0F172A" />
  </Svg>
);

export const chartModeSwitcher = (): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M10.6 5H13.4V19H10.6V5ZM5 9.2H8V19H5V9.2ZM19 13H16.2V19H19V13Z" fill="#475569" />
  </Svg>
);

export const fullscreenSwitcher = (): JSX.Element => (
  <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M7 10H5V5H10V7H7V10ZM5 14H7V17H10V19H5V14ZM17 17H14V19H19V14H17V17ZM14 7V5H19V10H17V7H14Z" fill="#475569" />
  </Svg>
);

export const filter = (): JSX.Element => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Path d="M20.1668 2.75H1.8335L9.16683 11.4217V17.4167L12.8335 19.25V11.4217L20.1668 2.75Z" stroke="#475569" strokeWidth="1.83333" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);
