import React from 'react';

import * as s from './styles';

import { Cash } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';

type Props = {
  cash: Cash;
};

export const CashCard = ({ cash }: Props): JSX.Element => (
  <s.Wrapper key={cash.id} percentage={Math.random() * 100}>
    <s.Content>
      {cash.image}
      <s.NameWrapper>
        <s.Name>
          {cash.name}
        </s.Name>
      </s.NameWrapper>
      <s.ValueWrapper>
        <s.Value>
          $
          {cash.value}
        </s.Value>
      </s.ValueWrapper>
    </s.Content>
  </s.Wrapper>
);
