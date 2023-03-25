import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { FilterIcon } from 'src/icons/FilterIcon';
import { ChevronDown } from 'src/icons/ChevronDown';
import { ChevronUp } from 'src/icons/ChevronUp';

interface FilterToggleProps {
  className?: string;
  setIsFilterExpanded: (isExpanded: boolean) => void;
  isFilterExpanded: boolean;
}

const _FilterToggle = (props: FilterToggleProps) => {
  const { className, setIsFilterExpanded, isFilterExpanded } = props;
  const { t } = useTranslation();
  return (
    <div
      className={className}
      onClick={() => setIsFilterExpanded(!isFilterExpanded)}
    >
      <FilterIcon />
      <span>{t('Filter')}</span>
      {isFilterExpanded ? <ChevronDown /> : <ChevronUp />}
    </div>
  );
};

export const FilterToggle = styled(_FilterToggle)`
  display: flex;
  align-items: center;
  cursor: pointer;
  padding-left: 25px;

  span {
    margin-left: 7px;
    margin-right: 5px;
  }
`;
