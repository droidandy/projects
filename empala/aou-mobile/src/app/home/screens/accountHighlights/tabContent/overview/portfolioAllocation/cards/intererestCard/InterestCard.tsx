import React from 'react';

import * as s from './styles';

import { InterestMock } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { ValueChange } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/valueChange';
import downLineWithArrow from '~/assets/icons/lib/downLineWIthArrow';
import upLineWithArrow from '~/assets/icons/lib/upLineWithArrow';

type Props = {
  interest: InterestMock;
};

export const InterestCard = ({ interest }: Props): JSX.Element => {
  const fillPercentage = Math.random() * 100;
  const valueChange = Number(interest.valueChange.replace(',', ''));
  const grow = valueChange >= 0;
  const LineComponent = grow ? upLineWithArrow : downLineWithArrow;

  return (
    <s.Wrapper percentage={fillPercentage}>
      <s.Content>
        <s.TopPart>
          <s.ValuesWrapper>
            <LineComponent />
            <s.Name>{interest.name}</s.Name>
            <s.TotalValueWrapper>
              <s.TotalValueLabel>Total Value</s.TotalValueLabel>
              <s.TotalValue>
                $
                {interest.totalValue}
              </s.TotalValue>
            </s.TotalValueWrapper>
          </s.ValuesWrapper>
          <s.TopRightPart>
            <ValueChange valueChange={interest.valueChange} percentage={interest.percentage} />
          </s.TopRightPart>
        </s.TopPart>
        <s.BottomPart>
          <s.Companies>
            <s.CompaniesCount>
              <s.CompaniesCountLabel>
                {interest.companiesCount}
              </s.CompaniesCountLabel>
            </s.CompaniesCount>
            <s.CompaniesLabel>Companies</s.CompaniesLabel>
          </s.Companies>
          <s.Investacks>
            <s.CompaniesCount>
              <s.CompaniesCountLabel>
                {interest.investacksCount}
              </s.CompaniesCountLabel>
            </s.CompaniesCount>
            <s.CompaniesLabel>Investacks</s.CompaniesLabel>
          </s.Investacks>
        </s.BottomPart>
      </s.Content>
    </s.Wrapper>
  );
};
