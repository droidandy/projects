import React, { useState } from 'react';

import { CompaniesList } from './companiesList';
import {
  companies,
  investacks,
  cashs,
  notInvestack, interests,
} from './mocks';
import * as s from './styles';
import { AllocationType } from './types';

// eslint-disable-next-line max-len
import { InterestsList } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/interestsList';
// eslint-disable-next-line max-len
import { InvestacksList } from '~/app/home/screens/accountHighlights/tabContent/overview/portfolioAllocation/investacksList';
import { Dropdown, Option } from '~/components/atoms/dropdown';

const options: Option[] = [
  { id: AllocationType.companies, label: 'Companies' },
  { id: AllocationType.investacks, label: 'Investacks' },
  { id: AllocationType.interests, label: 'Interests' },
];

export const PortfolioAllocation = (): JSX.Element => {
  const [activeOption, setActiveOption] = useState(AllocationType.companies);

  return (
    <s.Wrapper>
      <s.Header>
        <s.HeaderLabel>Portfolio allocation</s.HeaderLabel>
        <Dropdown
          activeOptionId={activeOption}
          options={options}
          onSelect={setActiveOption}
        />
      </s.Header>
      <s.ListWrapper>
        {activeOption === AllocationType.companies && (
          <CompaniesList companies={companies} nonCompanies={cashs.slice(0, 1)} />
        )}
        {activeOption === AllocationType.investacks && (
          <InvestacksList investacks={investacks} companies={notInvestack} cashs={cashs.slice(0, 1)} />
        )}
        {activeOption === AllocationType.interests && (
          <InterestsList interests={interests} companies={notInvestack.slice(1, 2)} cashs={cashs.slice(1, 2)} />
        )}
      </s.ListWrapper>
    </s.Wrapper>
  );
};
