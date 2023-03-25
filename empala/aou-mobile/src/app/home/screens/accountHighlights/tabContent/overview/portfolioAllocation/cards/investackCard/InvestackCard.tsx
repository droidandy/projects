import React from 'react';

import * as s from './styles';

// eslint-disable-next-line max-len
import ChartDown from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/mockedCharts/ChartDown';
import ChartUp from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/mockedCharts/ChartUp';
import { InvestackMock } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { ValueChange } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/valueChange';
import downLineWithArrow from '~/assets/icons/lib/downLineWIthArrow';
import upLineWithArrow from '~/assets/icons/lib/upLineWithArrow';

type Props = {
  investack: InvestackMock;
};

export const InvestackCard = ({ investack }: Props): JSX.Element => {
  const fillPercentage = Math.random() * 100;
  const valueChange = Number(investack.valueChange.replace(',', ''));
  const grow = valueChange >= 0;
  const LineComponent = grow ? upLineWithArrow : downLineWithArrow;

  return (
    <s.Wrapper percentage={fillPercentage}>
      <s.Content>
        <s.TopPart>
          <s.ValuesWrapper>
            <LineComponent />
            <s.Name>{investack.name}</s.Name>
            <s.TotalValueWrapper>
              <s.TotalValueLabel>Total Value</s.TotalValueLabel>
              <s.TotalValue>
                $
                {investack.totalValue}
              </s.TotalValue>
            </s.TotalValueWrapper>
          </s.ValuesWrapper>
          <s.TopRightPart>
            <s.PercentageAndAvatarWrapper>
              <ValueChange valueChange={investack.valueChange} percentage={investack.percentage} />
              <s.AvatarPlaceholder />
            </s.PercentageAndAvatarWrapper>
            <s.ChartWrapper>
              {grow ? <ChartUp /> : <ChartDown />}
            </s.ChartWrapper>
          </s.TopRightPart>
        </s.TopPart>
        <s.BottomPart>
          <s.Companies>
            <s.CompaniesCount>
              <s.CompaniesCountLabel>
                {investack.companiesCount}
              </s.CompaniesCountLabel>
            </s.CompaniesCount>
            <s.CompaniesLabel>Companies</s.CompaniesLabel>
          </s.Companies>
          <s.BottomRightIconsWrapper>
            {Array(investack.bottomIconsCount).fill(null).map((_, i) => <s.BottomRightImage key={i} />)}
          </s.BottomRightIconsWrapper>
        </s.BottomPart>
      </s.Content>
    </s.Wrapper>
  );
};
