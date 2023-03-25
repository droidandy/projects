import React from 'react';
import Svg, { Path, Defs, Pattern, Use, Image } from 'react-native-svg';
import { MOCKED_ICONS } from './constants';

export const IconBoilerplate = (base64: string) => (
  <Svg width="24" height="25" viewBox="0 0 24 25" fill="none">
    <Path d="M0 24.68H24V0.68H0V24.68Z" fill="url(#pattern0)" />
    <Defs>
      <Pattern id="pattern0" patternContentUnits="objectBoundingBox" width="1" height="1">
        <Use href="#image0" transform="scale(0.015625)" />
      </Pattern>
      <Image id="image0" width="64" height="64" href={base64} />
    </Defs>
  </Svg>
);

export const OkIcon = () => IconBoilerplate(MOCKED_ICONS.ok);
export const StarIcon = () => IconBoilerplate(MOCKED_ICONS.star);
export const SunIcon = () => IconBoilerplate(MOCKED_ICONS.sun);
export const SadIcon = () => IconBoilerplate(MOCKED_ICONS.sad);
export const RetchIcon = () => IconBoilerplate(MOCKED_ICONS.retch);
export const BallIcon = () => IconBoilerplate(MOCKED_ICONS.ball);
export const FingerIcon = () => IconBoilerplate(MOCKED_ICONS.finger);

export const PlusIcon = () => (
  <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
    <Path fillRule="evenodd" clipRule="evenodd" d="M12.5001 3.6665C12.5001 2.83808 11.8285 2.1665 11.0001 2.1665C10.1717 2.1665 9.50008 2.83808 9.50008 3.6665V9.49984H3.66675C2.83832 9.49984 2.16675 10.1714 2.16675 10.9998C2.16675 11.8283 2.83832 12.4998 3.66675 12.4998H9.50008V18.3332C9.50008 19.1616 10.1717 19.8332 11.0001 19.8332C11.8285 19.8332 12.5001 19.1616 12.5001 18.3332V12.4998H18.3334C19.1618 12.4998 19.8334 11.8283 19.8334 10.9998C19.8334 10.1714 19.1618 9.49984 18.3334 9.49984H12.5001V3.6665Z" fill="white" />
  </Svg>
)