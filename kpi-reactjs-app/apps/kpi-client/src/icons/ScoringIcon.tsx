import * as React from 'react';
import { Colors } from 'src/Const';

type ScoringTypeColor = 'red' | 'yellow' | 'green' | 'blue' | 'gray';

interface ScoringAllIconProps {
  colors: [
    ScoringTypeColor,
    ScoringTypeColor,
    ScoringTypeColor,
    ScoringTypeColor
  ];
}
export function ScoringIcon(props: ScoringAllIconProps) {
  const { colors } = props;

  return (
    <svg width={30} height={15} viewBox="0 0 30 15" fill="none">
      <path
        d="M27 15c0-6.627-5.373-12-12-12S3 8.373 3 15"
        stroke={Colors[colors[0]]}
        strokeWidth={5}
        strokeLinejoin="bevel"
      />
      <path
        d="M15 3a11.97 11.97 0 018.944 4"
        stroke={Colors[colors[1]]}
        strokeWidth={5}
        strokeLinejoin="bevel"
      />
      <path
        d="M15 3C8.373 3 3 8.373 3 15"
        stroke={Colors[colors[2]]}
        strokeWidth={5}
        strokeLinejoin="bevel"
      />
      <path
        d="M3 15c0-3.306 1.337-6.3 3.5-8.47"
        stroke={Colors[colors[3]]}
        strokeWidth={5}
        strokeLinejoin="bevel"
      />
    </svg>
  );
}
