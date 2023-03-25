import React from 'react';

import * as s from './stepIndicatorStyles';

type Props = {
  active: boolean;
};

export const Step = ({ active }: Props): JSX.Element => (
  <s.ItemContainer>
    <s.Dash active={active} />
    <s.Margin />
  </s.ItemContainer>
);
