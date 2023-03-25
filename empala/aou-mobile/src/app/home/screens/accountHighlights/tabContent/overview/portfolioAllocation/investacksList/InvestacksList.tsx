import React from 'react';
import styled from 'styled-components/native';

import { CashCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/cashCard';
// eslint-disable-next-line max-len
import { CompanyCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/companyCard';
// eslint-disable-next-line max-len
import { InvestackCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/investackCard';
// eslint-disable-next-line max-len
import { Company, Cash, InvestackMock } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { OtherLabel } from '~/app/home/screens/accountHighlights/tabContent/overview/styles';

type Props = {
  investacks: InvestackMock[];
  companies?: Company[];
  cashs?: Cash[];
};

export const InvestacksList = ({ investacks, companies, cashs }: Props): JSX.Element => {
  const showOtherSection = companies?.length > 0 || cashs?.length > 0;

  return (
    <Wrapper>
      {investacks.map((investack) => <InvestackCard key={investack.id} investack={investack} />)}
      {showOtherSection && (
        <OtherLabel>Not in investacks</OtherLabel>
      )}
      {companies?.map((company) => <CompanyCard key={company.id} company={company} />)}
      {cashs?.map((cash) => <CashCard key={cash.id} cash={cash} />)}
    </Wrapper>
  );
};

export const Wrapper = styled.View`
  width: 100%;
  padding-bottom: 30px;
`;
