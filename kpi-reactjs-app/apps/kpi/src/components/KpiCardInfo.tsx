import * as React from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Card } from './Card';
import { OptionsValue } from './OptionsValue';
import {
  measurementFrequencyOptions,
  measurementUnitOptions,
  kpiTrendTypeOptions,
} from 'src/common/options';
import { Kpi } from 'src/types';

interface KpiCardInfoProps {
  className?: string;
  kpi: Kpi;
}

const Label = styled.div`
  font-weight: bold;
`;
const Field = styled.div`
  display: flex;
  margin-bottom: 10px;
`;
const Value = styled.div`
  padding-left: 5px;
`;

const _KpiCardInfo = (props: KpiCardInfoProps) => {
  const { className, kpi } = props;
  const { t } = useTranslation();

  return (
    <Card className={className}>
      <Field>
        <Label>{t('Measure Freq')}:</Label>
        <Value>
          <OptionsValue
            options={measurementFrequencyOptions}
            value={kpi.measurement.frequency}
          />
        </Value>
      </Field>
      <Field>
        <Label>{t('Measure Unit')}:</Label>
        <Value>
          <OptionsValue
            options={measurementUnitOptions}
            value={kpi.measurement.unit}
          />
        </Value>
      </Field>
      <Field>
        <Label>{t('Measure Unit Desc')}:</Label>
        <Value>{kpi.measurement.unitDescription}</Value>
      </Field>
      <Field>
        <Label>{t('Measure Criteria')}:</Label>
        <Value>{kpi.measurement.mechanism}</Value>
      </Field>
      {kpi.measurement.formula && (
        <Field>
          <Label>{t('Formula')}:</Label>
          <Value>{kpi.measurement.formula.blocks[0].text}</Value>
        </Field>
      )}
      <Field>
        <Label>{t('Trend')}:</Label>
        <Value>
          <OptionsValue
            options={kpiTrendTypeOptions}
            value={kpi.measurement.trend}
          />
        </Value>
      </Field>
      <Field>
        <Label>{t('Start Date')}:</Label>
        <Value>{kpi.info.startDate}</Value>
      </Field>
      <Field>
        <Label>{t('End Date')}:</Label>
        <Value>{kpi.info.endDate}</Value>
      </Field>
    </Card>
  );
};

export const KpiCardInfo = styled(_KpiCardInfo)`
  display: block;
`;
