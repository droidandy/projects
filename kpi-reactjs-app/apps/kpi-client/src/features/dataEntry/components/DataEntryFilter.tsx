import * as React from 'react';
import { DataEntryActions, getDataEntryState } from '../interface';
import { useActions } from 'typeless';
import { Row, Col } from 'src/components/Grid';
import { Input } from 'src/components/FormInput';
import { useTranslation } from 'react-i18next';
import { Select } from 'src/components/Select';
import {
  colorOptions,
  frequencyOptions,
  aggregationTypeOptions,
} from 'src/common/options';
import { getGlobalState } from 'src/features/global/interface';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { FilterContainer } from 'src/components/FilterContainer';
import { TablePeriodPicker } from 'src/components/TablePeriodPicker';

export const DataEntryFilter = () => {
  const { setFilter, clearFilter, search, changePeriod } = useActions(DataEntryActions);
  const { filter, isFilterExpanded, period } = getDataEntryState.useState();
  const { lookups } = getGlobalState.useState();
  const { t } = useTranslation();
  const kpiTypeOptions = useLookupOptions(lookups, 'KPIType');

  return (
    <FilterContainer isExpanded={isFilterExpanded} clearFilter={clearFilter} applyFilter={search}>
      <Row>
        <Col>
        {t('Aggregation Types')}
        </Col>
        <Col>
        {t('Name')}
        </Col>
        <Col>
        {t('Color')}
        </Col>
        <Col>
        {t('KPI Types')}
        </Col>
      </Row>
      <Row>
        <Col>
          <Select
            isMulti
            placeholder={t('Aggregation Types')}
            options={aggregationTypeOptions}
            value={filter.aggregationTypes}
            onChange={value => setFilter('aggregationTypes', value)}
          />
        </Col>
        <Col>
          <Input
            placeholder={t('Name')}
            value={filter.searchTerm}
            onChange={value => setFilter('searchTerm', value.target.value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('Color')}
            options={colorOptions}
            value={filter.colors}
            onChange={value => setFilter('colors', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('KPI Types')}
            options={kpiTypeOptions}
            value={filter.kpiTypes}
            onChange={value => setFilter('kpiTypes', value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
        {t('Frequencies')}
        </Col>
        <Col>
        {t('Date Period')}
        </Col>
        <Col>
        </Col>
        <Col>
        </Col>
      </Row>
      <Row>
        <Col>
          <Select
            isMulti
            placeholder={t('Frequencies')}
            options={frequencyOptions}
            value={filter.frequencies}
            onChange={value => setFilter('frequencies', value)}
          />
        </Col>
        <Col>
          <TablePeriodPicker period={period} changePeriod={changePeriod} type="filter"/>
        </Col>
        <Col>
        </Col>
        <Col>
        </Col>
      </Row>
    </FilterContainer>
  );
};
