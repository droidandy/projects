import React from 'react';
import * as SVG from 'react-native-svg';

export default function NoFavourites({ ...rest }) {
  return (
    <SVG.Svg viewBox="0 0 198 191" {...rest}>
      <SVG.G fill="none" fillRule="nonzero">
        <SVG.Path fill="#A0A0A0" d="M119.29 137.768c20.533-4.176 45.302 12.889 64.69-4.524 19.387-17.413 10.651-61.968-9.238-75.59-19.89-13.623-30.095-2.285-54.116-2.361-24.02-.077-25.315-19.35-55.686-17.226-30.37 2.124-32.77 16.1-47.1 37.449-14.329 21.349-19.35 46.001 8.79 56.557 28.139 10.556 22.83 26.635 46.63 24.97 23.8-1.664 25.498-15.1 46.03-19.275z" opacity=".1"/>
        <SVG.G stroke="#A0A0A0" opacity=".7" transform="translate(3 53)">
          <SVG.Path strokeWidth="3" d="M72.667 79.312L96 66.922l23.333 12.39c1.147.609 2.495-.38 2.272-1.693l-4.453-26.224 18.865-18.575c.942-.928.422-2.547-.867-2.736l-26.083-3.828L97.405 2.387a1.556 1.556 0 0 0-2.81 0L82.933 26.256 56.85 30.084c-1.289.19-1.81 1.808-.867 2.736l18.865 18.575-4.453 26.224c-.223 1.313 1.125 2.302 2.272 1.693z"/>
          <SVG.Circle cx="43" cy="96" r="2" strokeWidth="2"/>
          <SVG.Circle cx="138" cy="6" r="2" strokeWidth="2"/>
          <SVG.Circle cx="33" cy="38" r="3" strokeWidth="2"/>
          <SVG.Circle cx="166" cy="57" r="3" strokeWidth="2"/>
          <SVG.Path strokeLinecap="round" strokeWidth="2" d="M9.828 75.172l-5.656 5.656m5.656 0l-5.656-5.656M186.828 7.172l-5.656 5.656m5.656 0l-5.656-5.656"/>
        </SVG.G>
      </SVG.G>
    </SVG.Svg>
  );
}
