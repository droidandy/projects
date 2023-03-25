import React from 'react';
import styled from 'styled-components/native';

// eslint-disable-next-line max-len
import { CashCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/cashCard';
// eslint-disable-next-line max-len
import { CompanyCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/companyCard';
// eslint-disable-next-line max-len
import { InterestCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/intererestCard';
import {
  Cash,
  Company,
  InterestMock,
} from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { OtherLabel } from '~/app/home/screens/accountHighlights/tabContent/overview/styles';

type Props = {
  interests: InterestMock[];
  companies: Company[];
  cashs: Cash[];
};

export const InterestsList = ({ interests, companies, cashs }: Props): JSX.Element => {
  console.log('InterestsList');
  console.log(companies);
  console.log(cashs);
  const showOtherSection = companies?.length > 0 || cashs?.length > 0;

  return (
    <Wrapper>
      {interests.map((interest) => <InterestCard key={interest.id} interest={interest} />)}
      {showOtherSection && (
        <OtherLabel>Not in Interests</OtherLabel>
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
