import React from 'react';
import styled from 'styled-components/native';

import { CashCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/cashCard';
// eslint-disable-next-line max-len
import { CompanyCard } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/cards/companyCard';
import { Company, Cash } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/types';
import { OtherLabel } from '~/app/home/screens/accountHighlights/tabContent/overview/styles';

type Props = {
  companies: Company[];
  nonCompanies: Cash[];
};

export const CompaniesList = ({ companies, nonCompanies }: Props): JSX.Element => (
  <Wrapper>
    {companies.map((company) => <CompanyCard key={company.id} company={company} />)}
    {nonCompanies?.length > 0 && (
      <>
        <OtherLabel>Not in companies</OtherLabel>
        <OtherContainer>
          {nonCompanies.map((nonCompany) => <CashCard key={nonCompany.id} cash={nonCompany} />)}
        </OtherContainer>
      </>
    )}
  </Wrapper>
);

export const Wrapper = styled.View`
  width: 100%;
  padding-bottom: 30px;
`;

export const OtherContainer = styled.View``;
