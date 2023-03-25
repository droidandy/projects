import * as React from 'react';
import styled from 'styled-components';
import { PeriodPicker } from 'src/components/PeriodPicker';
import { KPIReportsActions, getKPIReportsState } from '../interface';
import { useActions } from 'typeless';
import { Row, Col } from 'src/components/Grid';
import { useTranslation } from 'react-i18next';
import { Select } from 'src/components/Select';
import {
  colorOptions,
  kpiLevelOptions,
  aggregationTypeOptions,
} from 'src/common/options';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/FormInput';
import { getGlobalState } from 'src/features/global/interface';

interface DataEntryFilterProps {
  className?: string;
}

const Buttons = styled.div`
  display: flex;
  justify-content: flex-end;
  height: 100%;
  margin-right: 10px;
  ${Button} {
    font-weight: bold;
  }
`;

const _KPIReportsFilters = (props: DataEntryFilterProps) => {
  const { className } = props;
  const { changePeriod, setFilter, clearFilters, search } = useActions(
    KPIReportsActions
  );
  const { period, filter, units, isFilterExpanded } = getKPIReportsState.useState();
  const { lookups } = getGlobalState.useState();
  const { t } = useTranslation();
  const unitOptions = units.map(el => {
    return {
      label: <DisplayTransString value={el.name} />,
      value: el.id,
    };
  });
  const kpiTypeOptions = lookups
    .filter(item => item.category === 'KPIType')
    .map(item => {
      return {
        label: <DisplayTransString value={{ en: item.en, ar: item.ar }} />,
        value: item.slug,
      };
    });


  if (isFilterExpanded) return null;
  return (
    <div className={className}>
      <Row>
        <Col>{t('Responsible Unit')}</Col>
        <Col>{t('KPI Level')}</Col>
        <Col>{t('Search')}</Col>
        <Col>{t('Date Period')}</Col>
      </Row>
      <Row>
        <Col>
          <Select
            placeholder={t('Responsible Unit')}
            options={unitOptions}
            value={filter.organizationId ? filter.organizationId : null}
            onChange={value => setFilter('organizationId', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('KPI Level')}
            options={kpiLevelOptions}
            value={filter.kpiLevels ? filter.kpiLevels : null}
            onChange={value => setFilter('kpiLevels', value)}
          />
        </Col>
        <Col>
          <Input
            placeholder={t('Search')}
            value={filter.searchText ? filter.searchText : ''}
            onChange={value => setFilter('searchText', value.target.value)}
          />
        </Col>
        <Col>
          <PeriodPicker
            arrows
            start={new Date().getFullYear() - 5}
            end={new Date().getFullYear()}
            value={period}
            minFrequency="Quarterly"
            width="100%"
            type="filter"
            onChange={value => {
              changePeriod(value);
            }}
          />
        </Col>
      </Row>
      <Row>
        <Col>{t('Unit')}</Col>
        <Col>{t('Color')}</Col>
        <Col>{t('KPI Type')}</Col>
        <Col>{t('Aggregation Type')}</Col>
      </Row>
      <Row>
        <Col>
          <Select
            isMulti
            placeholder={t('Unit')}
            options={unitOptions}
            value={filter.units ? filter.units : null}
            onChange={value => setFilter('units', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('Color')}
            options={colorOptions}
            value={filter.colors ? filter.colors : null}
            onChange={value => setFilter('colors', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('KPI Type')}
            options={kpiTypeOptions}
            value={filter.kpiTypes ? filter.kpiTypes : null}
            onChange={value => setFilter('kpiTypes', value)}
          />
        </Col>
        <Col>
          <Select
            isMulti
            placeholder={t('Aggregation Type')}
            options={aggregationTypeOptions}
            value={filter.aggregationTypes ? filter.aggregationTypes : null}
            onChange={value => setFilter('aggregationTypes', value)}
          />
        </Col>
      </Row>
      <Row>
        <Col
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'flex-end',
          }}
        >
          <Buttons>
            <Button styling="primary" onClick={() => search()}>
              {t('Apply')}
            </Button>
          </Buttons>
          <Buttons>
            <Button styling="secondary" onClick={() => clearFilters()}>
              {t('Clear Filter')}
            </Button>
          </Buttons>
        </Col>
      </Row>
    </div>
  );
};

export const KPIReportsFilters = styled(_KPIReportsFilters)`
  display: block;
  padding: 20px 30px;
  ${Row} + ${Row} {
    margin-top: 15px;
  }
`;
