import React from 'react';
import { View } from 'react-native';

import * as s from './styles';

import { PortfolioAllocation } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation';
import { Chart } from '~/components/molecules/chart';

const MOCKED_CURRENT_VALUE = '12,000';
const MOCKED_AVAILABLE_TO_INVEST = '2,600';
const MOCKED_AVAILABLE_TO_WITHDRAW = '400';

export const Overview = (): JSX.Element => (
  <s.Wrapper showsVerticalScrollIndicator={false}>
    <s.ChartWrapper>
      <Chart companyId={2662} />
    </s.ChartWrapper>
    <s.ValuesWrapper>
      <View>
        <s.ValueLabel>Current Value</s.ValueLabel>
        <s.Value>
          $
          {MOCKED_CURRENT_VALUE}
        </s.Value>
      </View>
      <View>
        <s.ValueLabel>$ available to invest</s.ValueLabel>
        <s.Value>
          $
          {MOCKED_AVAILABLE_TO_INVEST}
        </s.Value>
      </View>
      <View>
        <s.ValueLabel>$available to withdraw</s.ValueLabel>
        <s.Value>
          $
          {MOCKED_AVAILABLE_TO_WITHDRAW}
        </s.Value>
      </View>
    </s.ValuesWrapper>
    <PortfolioAllocation />
  </s.Wrapper>
);
