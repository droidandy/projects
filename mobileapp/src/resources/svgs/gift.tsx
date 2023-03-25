import Svg, { G, Path } from 'react-native-svg';
import React from 'react';
import { SvgIconProps } from './types';

export const GiftIcon = ({ active = false, width = 22, height = 22, style }: SvgIconProps) => {
  return (
    <Svg style={style} height={height} width={width} viewBox="0 0 22 22">
      <G
        fill="white"
        id="Icon_feather-gift"
        data-name="Icon feather-gift"
        transform="translate(-2 -2)"
      >
        <Path
          id="Path_442"
          data-name="Path 442"
          d="M22,18V28H6V18"
          transform="translate(-1 -5)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <Path
          id="Path_443"
          data-name="Path 443"
          d="M3,10.5H23v5H3Z"
          transform="translate(0 -2.5)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <Path
          id="Path_444"
          data-name="Path 444"
          d="M18,25.5v-15"
          transform="translate(-5 -2.5)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <Path
          id="Path_445"
          data-name="Path 445"
          d="M14.5,8H10a2.5,2.5,0,1,1,0-5C13.5,3,14.5,8,14.5,8Z"
          transform="translate(-1.5)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
        <Path
          id="Path_446"
          data-name="Path 446"
          d="M18,8h4.5a2.5,2.5,0,1,0,0-5C19,3,18,8,18,8Z"
          transform="translate(-5)"
          fill="none"
          stroke="#fff"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
        />
      </G>
    </Svg>
  );
};

/*
<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
  <g id="Icon_feather-gift" data-name="Icon feather-gift" transform="translate(-2 -2)">
    <path id="Path_442" data-name="Path 442" d="M22,18V28H6V18" transform="translate(-1 -5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="Path_443" data-name="Path 443" d="M3,10.5H23v5H3Z" transform="translate(0 -2.5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="Path_444" data-name="Path 444" d="M18,25.5v-15" transform="translate(-5 -2.5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="Path_445" data-name="Path 445" d="M14.5,8H10a2.5,2.5,0,1,1,0-5C13.5,3,14.5,8,14.5,8Z" transform="translate(-1.5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
    <path id="Path_446" data-name="Path 446" d="M18,8h4.5a2.5,2.5,0,1,0,0-5C19,3,18,8,18,8Z" transform="translate(-5)" fill="none" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
  </g>
</svg>
 */
