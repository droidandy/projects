import * as React from 'react';
import styled from 'styled-components';
import { Row, Col } from 'src/components/Grid';
import { useTranslation } from 'react-i18next';
import { getMyKpisState, MyKpisActions } from '../interface';
import { useActions } from 'typeless';
import {
  aggregationTypeOptions,
  frequencyOptions,
  kpiStatusOptions,
} from 'src/common/options';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { getGlobalState } from 'src/features/global/interface';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { Input } from 'src/components/FormInput';
import { Select } from 'src/components/Select';
import { FilterContainer } from 'src/components/FilterContainer';
import { TablePeriodPicker } from 'src/components/TablePeriodPicker';
const Label = styled.label`
  display: block;
  font-weight: 400;
  margin-bottom: 0.5rem;
`;
export const MyKpiFilter = () => {
  const { t } = useTranslation();
  const { tempFilter, isFilterExpanded, period } = getMyKpisState.useState();
  const { setFilter, clearFilter, applyFilter, changePeriod } = useActions(MyKpisActions);
  const { lookups, kpiLevels } = getGlobalState.useState();
  const scoringTypeOptions = useLookupOptions(lookups, 'KPIScoringType');
  const kpiLevelOptions = useSelectOptions(kpiLevels);

  return (
    <FilterContainer isExpanded={isFilterExpanded} clearFilter={clearFilter} applyFilter={applyFilter}>
      <Row>
        <Col>
          <Select
            isClearable
            label={t('Status')}
            placeholder={t('Status')}
            options={kpiStatusOptions}
            value={tempFilter.status}
            onChange={value => setFilter('status', value)}
          />
        </Col>
        <Col>
          <Input
            label={t('KPI Name')}
            placeholder={t('KPI Name')}
            value={tempFilter.kpiName}
            onChange={value => setFilter('kpiName', value.target.value)}
          />
        </Col>
        <Col>
          <Input
            label={t('KPI Code')}
            placeholder={t('KPI Code')}
            value={tempFilter.kpiCode}
            onChange={value => setFilter('kpiCode', value.target.value)}
          />
        </Col>
        <Col>
          <Select
            isClearable
            label={t('Frequency')}
            placeholder={t('Frequency')}
            options={frequencyOptions}
            value={tempFilter.frequency}
            onChange={value => setFilter('frequency', value)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Select
            isClearable
            label={t('Level')}
            placeholder={t('Level')}
            options={kpiLevelOptions}
            value={tempFilter.level}
            onChange={value => setFilter('level', value)}
          />
        </Col>
        <Col>
          <Select
            isClearable
            label={t('Scoring Type')}
            placeholder={t('Scoring Type')}
            options={scoringTypeOptions}
            value={tempFilter.scoringType}
            onChange={value => setFilter('scoringType', value)}
          />
        </Col>
        <Col>
          <Select
            isClearable
            label={t('Aggregation Types')}
            placeholder={t('Aggregation Types')}
            options={aggregationTypeOptions}
            value={tempFilter.aggregation}
            onChange={value => setFilter('aggregation', value)}
          />
        </Col>
        <Col>
          <Label>{t('Date Period')}</Label>
          <TablePeriodPicker period={period} changePeriod={changePeriod} type="filter"/>
        </Col>
      </Row>
    </FilterContainer>
  );
};
