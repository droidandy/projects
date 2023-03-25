import React from 'react';
import * as SVG from 'react-native-svg';

export default function NoResults({ ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 198 191" {...rest}>
      <SVG.G fill="none" fillRule="evenodd">
        <SVG.G fillRule="nonzero">
          <SVG.Path fill="#A0A0A0" d="M116.453 138.027c20.774-2.734 44.292 16.018 64.847 0 20.555-16.018 14.949-61.074-3.942-76.051-18.89-14.977-29.862-4.378-53.82-6.13-23.957-1.752-23.903-21.068-54.348-21.068S35.377 48.552 19.593 68.85C3.809 89.147-2.92 113.39 24.415 125.882c27.335 12.493 20.917 28.163 44.775 28.163 23.858 0 26.49-13.285 47.263-16.018z" opacity=".1" />
          <SVG.G stroke="#A0A0A0" opacity=".7" transform="translate(3 52)">
            <SVG.G strokeWidth="3" transform="rotate(45 44.237 108.805)">
              <SVG.Circle cx="28.5" cy="28.5" r="28.5" />
              <SVG.Rect width="18" height="7" x="67.5" y="25.5" rx="3.5" />
              <SVG.Path d="M57 29h9.582" />
            </SVG.G>
            <SVG.Circle cx="43" cy="97" r="2" strokeWidth="2" />
            <SVG.Circle cx="138" cy="7" r="2" strokeWidth="2" />
            <SVG.Circle cx="33" cy="39" r="3" strokeWidth="2" />
            <SVG.Circle cx="166" cy="58" r="3" strokeWidth="2" />
            <SVG.G strokeLinecap="round" strokeWidth="2">
              <SVG.Path d="M9.828 76.172l-5.656 5.656M9.828 81.828l-5.656-5.656" />
            </SVG.G>
            <SVG.G strokeLinecap="round" strokeWidth="2">
              <SVG.Path d="M186.828 8.172l-5.656 5.656M186.828 13.828l-5.656-5.656" />
            </SVG.G>
          </SVG.G>
        </SVG.G>
      </SVG.G>
    </SVG.Svg>
  );
}
