import React from 'react';
import { StyleProp, ViewProps } from 'react-native';

import * as s from './styles';

type Props = {
  percentage: number;
  color?: string;
  style?: StyleProp<ViewProps>;
  children?: React.ReactNode;
};

export const FillableContainer = ({
  percentage,
  color,
  style,
  children,
}: Props): JSX.Element => (
  <s.Wrapper style={style}>
    <s.Filler percentage={percentage} color={color} />
    {children}
  </s.Wrapper>
);
