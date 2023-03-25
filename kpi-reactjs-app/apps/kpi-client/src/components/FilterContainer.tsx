import * as React from 'react';
import styled from 'styled-components';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';
import { Row } from './Grid';

interface FilterContainerProps {
  className?: string;
  children: React.ReactNode;
  isExpanded: boolean;
  clearFilter(): void;
  applyFilter(): void;
}

const Buttons = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  margin-right: 10px;
  ${Button} {
    border: 1px solid #E2E5EC;
    border-radius: 2px;
    width: 110px;
    height: 36px;
    font-weight: bold;
  }
`;
const FilterButtons = styled.div`
  display: flex;
  place-content: flex-end;
`;
const _FilterContainer = (props: FilterContainerProps) => {
  const { className, children, isExpanded, clearFilter, applyFilter } = props;
  const { t } = useTranslation();
  if (!isExpanded) {
    return null;
  }
  return (
    <div className={className}>
      {children}
      <FilterButtons>
        <Buttons>
          <Button styling="primary" onClick={() => applyFilter()}>
            {t('Apply')}
          </Button>
        </Buttons>
        <Buttons>
          <Button styling="secondary" onClick={() => clearFilter()}>
            {t('Clear Filter')}
          </Button>
        </Buttons>
      </FilterButtons>
    </div>
  );
};

export const FilterContainer = styled(_FilterContainer)`
  display: block;
  padding: 25px 30px 20px;
  ${Row} + ${Row} {
    margin-top: 15px;
  }
  color: #495057;
`;
