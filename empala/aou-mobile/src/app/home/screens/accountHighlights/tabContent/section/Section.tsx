import React from 'react';

import * as s from './styles';

type Props = {
  name: string;
  children?: React.ReactNode;
};

export const Section = ({ name, children }: Props): JSX.Element => (
  <s.Wrapper>
    <s.Name>{name}</s.Name>
    <s.List>
      {children}
    </s.List>
  </s.Wrapper>
);
