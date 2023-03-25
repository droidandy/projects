import React from 'react';
import { useActions } from 'typeless';
import { Input } from 'src/components/FormInput';
import { Select } from 'src/components/Select';
import { useTranslation } from 'react-i18next';
import { getReportsState, ReportsActions } from '../interface';
import { Row, Col } from 'src/components/Grid';
import { reportsTypeOptions } from 'src/common/options';
import { FilterContainer } from 'src/components/FilterContainer';

export function ReportsFilters() {
  const { t } = useTranslation();
  const { filter, isFilterExpanded } = getReportsState();
  const { setFilter, clearFilter, search } = useActions(ReportsActions);

  console.log(filter);
  return (
    <FilterContainer isExpanded={isFilterExpanded} clearFilter={clearFilter} applyFilter={search}>
      <Row>
        <Col>
          <Input
            label={t('Search')}
            placeholder={t('Search')}
            value={filter.searchText}
            onChange={value => setFilter('searchText', value.target.value)}
          />
        </Col>
        <Col>
          <Select
            label={t('Select Type')}
            placeholder={t('Select Type')}
            options={reportsTypeOptions}
            value={filter.type}
            onChange={value => setFilter('type', value)}
          />
        </Col>
        <Col />
        <Col />
      </Row>
    </FilterContainer>
  );
}
