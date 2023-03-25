import React from 'react';
import Svg, { Path } from 'react-native-svg';

type Props = {
  color: string;
};

export default function Back({ color = '#ccc', ...rest }: Props): JSX.Element {
  return (
    <Svg viewBox="0 0 10 18" {...rest}>
      <Path
        fill={color}
        fillRule="nonzero"
        d="M9.619 2.224A1.34 1.34 0 0 0 9.66.4 1.182 1.182 0 0 0 7.929.356L.351 8.08a1.384 1.384 0 0 0 .04 1.885l7.538 7.677a1.182 1.182 0 0 0 1.732-.04 1.34 1.34 0 0 0-.04-1.825l-6.205-6.43a.5.5 0 0 1 0-.693l6.203-6.43z"
      />
    </Svg>
  );
}
