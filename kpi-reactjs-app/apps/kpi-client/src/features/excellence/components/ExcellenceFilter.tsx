import * as React from 'react';
import * as R from 'remeda';
import { useTranslation } from 'react-i18next';
import { Checkbox } from 'src/components/Checkbox';
import { getExcellenceState, ExcellenceActions } from '../interface';
import { CalcStatusExcellence } from 'src/types';
import { useActions } from 'typeless';
import { FilterContainer } from 'src/components/FilterContainer';
import styled from 'styled-components';

const options: Array<{ value: CalcStatusExcellence; text: string }> = [
  { value: 'Completed', text: 'Completed' },
  { value: 'Active', text: 'Active' },
  { value: 'Exist', text: 'Exist' },
  { value: 'NotExist', text: 'Not Exist' },
];

const Checkboxes = styled.div`
  display: flex;
  color: #244159;
  margin-bottom: 10px;
  ${Checkbox} {
    margin-left: 20px;
  }
`;

export const ExcellenceFilter = () => {
  const { t } = useTranslation();
  const { tempFilter, isFilterExpanded } = getExcellenceState();
  const { setFilter, clearFilter, applyFilter } = useActions(ExcellenceActions);
  const statusMap = R.indexBy(tempFilter.status, x => x);

  return (
    <FilterContainer isExpanded={isFilterExpanded} clearFilter={clearFilter} applyFilter={applyFilter}>
      <Checkboxes>
        Status
      </Checkboxes>
      <Checkboxes>
        {options.map(option => (
          <Checkbox
            key={option.value}
            checked={!!statusMap[option.value]}
            onChange={() => {
              const copy = { ...statusMap };
              if (copy[option.value]) {
                delete copy[option.value];
              } else {
                copy[option.value] = option.value;
              }
              setFilter('status', Object.values(copy));
            }}
          >
            {t(option.text)}
          </Checkbox>
        ))}
      </Checkboxes>
    </FilterContainer>
  );
};
