import React from 'react';
import { FormSection } from 'src/components/FormSection';
import { useTranslation } from 'react-i18next';
import { Row, Col, Label } from './SharedComponents';
import { FormSelect } from 'src/components/FormSelect';
import { valueTypeOptions } from 'src/common/options';
import { useActualValue } from '../hooks';
import { KpiDataSeriesTable } from './KpiDataSeriesTable';

export function SeriesDetails() {
  const { t } = useTranslation();
  const actualValue = useActualValue();

  return (
    <FormSection title={t('SERIES DETAILS')}>
      <Row>
        <Col>
          <Label>{t('Frequency')}:</Label>
        </Col>
        <Col>
          <FormSelect name="actualValue" options={valueTypeOptions} />
        </Col>
        <Col>
          <Label>{t('Goal')}:</Label>
        </Col>
        <Col>
          <FormSelect
            name="goal"
            options={valueTypeOptions}
            isDisabled={actualValue === 'Index'}
          />
        </Col>
      </Row>
      <KpiDataSeriesTable />
    </FormSection>
  );
}
