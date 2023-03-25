import React from 'react';

import * as s from './styles';

import { Company } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { ValueChange } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/valueChange';
import downLineWithArrow from '~/assets/icons/lib/downLineWIthArrow';
import upLineWithArrow from '~/assets/icons/lib/upLineWithArrow';

type Props = {
  company: Company;
};

export const CompanyCard = ({ company }: Props): JSX.Element => {
  const fillPercentage = Math.random() * 100;

  const grow = company.percentage >= 0;
  const LineComponent = grow ? upLineWithArrow : downLineWithArrow;

  return (
    <s.Wrapper percentage={fillPercentage}>
      <s.Content>
        {company.image}
        <s.NameSharesWrapper>
          <s.Name>
            {company.name}
          </s.Name>
          <s.Shares>
            {company.sharesCount}
            {' @ $'}
            {company.sharesValue}
          </s.Shares>
        </s.NameSharesWrapper>
        <s.ValueWrapper>
          <s.Value>
            $
            {company.value}
          </s.Value>
          <s.ValueChangesWrapper>
            <s.LineIconWrapper>
              <LineComponent />
            </s.LineIconWrapper>
            <ValueChange
              valueChange={company.valueChange}
              percentage={company.percentage}
            />
          </s.ValueChangesWrapper>
        </s.ValueWrapper>
      </s.Content>
    </s.Wrapper>
  );
};
