import React from 'react';

import * as s from './styles';

type Props = {
  children: React.ReactNode;
};

export const ChartScreen = ({ children }: Props): JSX.Element => (
  <s.Wrapper>
    <s.Content
      mode="padding"
      edges={['top', 'bottom', 'left', 'right']}
    >
      {children}
    </s.Content>
  </s.Wrapper>
);
