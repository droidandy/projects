import React from 'react';
import * as SVG from 'react-native-svg';

export default function NoCards({ color, ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 198 191" {...rest}>
      <SVG.G fill="none" fillRule="nonzero">
        <SVG.Path fill="#A0A0A0" d="M116.3 137c20.774-2.734 44.292 16.017 64.847 0 20.555-16.019 14.949-61.075-3.942-76.051-18.89-14.977-29.862-4.379-53.82-6.13C99.43 53.067 99.483 33.75 69.038 33.75S35.224 47.525 19.44 67.822c-15.784 20.298-22.513 44.54 4.822 57.033 27.335 12.493 20.917 28.162 44.775 28.162 23.858 0 26.49-13.284 47.263-16.018z" opacity=".1" />
        <SVG.G stroke="#A0A0A0" opacity=".7" transform="translate(-1 55)">
          <SVG.Circle cx="43" cy="92" r="2" strokeWidth="2" />
          <SVG.Circle cx="138" cy="2" r="2" strokeWidth="2" />
          <SVG.Circle cx="33" cy="34" r="3" strokeWidth="2" />
          <SVG.Circle cx="166" cy="53" r="3" strokeWidth="2" />
          <SVG.G strokeLinecap="round" strokeWidth="2">
            <SVG.Path d="M9.828 71.172l-5.656 5.656M9.828 76.828l-5.656-5.656" />
          </SVG.G>
          <SVG.G strokeLinecap="round" strokeWidth="2">
            <SVG.Path d="M186.828 3.172l-5.656 5.656M186.828 8.828l-5.656-5.656" />
          </SVG.G>
          <SVG.G transform="rotate(-15 108.154 -171.28)">
            <SVG.Rect width="74.965" height="50.481" x="1.5" y="1.5" strokeWidth="3" rx="4" />
            <SVG.Path fill="#A0A0A0" strokeWidth=".5" d="M1.579 12.184h75.25v12.76H1.579z" />
            <SVG.Rect width="42.627" height="1" x="7.689" y="40.657" strokeWidth="3" rx=".5" />
            <SVG.Rect width="42.627" height="1" x="7.982" y="46.432" strokeWidth="3" rx=".5" />
          </SVG.G>
          <SVG.G strokeWidth="3" transform="translate(71.035 28.52)">
            <SVG.Rect width="74.965" height="50.481" x="1.5" y="1.5" fill={color || '#F5F5F5'} rx="4" />
            <SVG.Rect width="12.061" height="8.934" x="7.5" y="9.5" rx="2.652" />
            <SVG.Rect width="11.175" height="1" x="7.702" y="32.743" rx=".5" />
            <SVG.Rect width="17.82" height="1" x="7.702" y="38.721" rx=".5" />
            <SVG.Rect width="11.175" height="1" x="24.092" y="32.743" rx=".5" />
            <SVG.Rect width="6.303" height="1" x="30.737" y="38.721" rx=".5" />
            <SVG.Rect width="6.303" height="1" x="7.702" y="44.699" rx=".5" />
            <SVG.Path d="M62.195 10.305A4.862 4.862 0 0 1 65.518 9a4.867 4.867 0 0 1 4.872 4.862 4.867 4.867 0 0 1-4.872 4.862 4.862 4.862 0 0 1-3.323-1.306 4.862 4.862 0 0 1-3.322 1.306A4.867 4.867 0 0 1 54 13.862 4.867 4.867 0 0 1 58.873 9c1.284 0 2.452.495 3.322 1.305z" />
            <SVG.Rect width="11.175" height="1" x="40.482" y="32.743" rx=".5" />
            <SVG.Rect width="11.175" height="1" x="56.873" y="32.743" rx=".5" />
          </SVG.G>
        </SVG.G>
      </SVG.G>
    </SVG.Svg>
  );
}
