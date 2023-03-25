import { FormSection } from 'src/components/FormSection';
import React from 'react';
import { FormSelect } from 'src/components/FormSelect';
import {
  frequencyOptions,
  boolOptions,
  aggregationTypeOptions,
} from 'src/common/options';
import { FormInput } from 'src/components/ReduxInput';
import {
  Sep,
  ColSpan3,
  SubSectionTitle,
  Col3,
  InputWithLabel,
  IconLabel,
  Label,
  Row,
  Col,
} from './SharedComponents';
import { isKPIScoring4Colors } from 'src/common/utils';
import { ScoringIcon } from 'src/icons/ScoringIcon';
import { KPIScoringType } from 'src/types';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { useScoringOptions } from 'src/hooks/useScoringOptions';
import { useScoringType } from '../hooks';
import { useTranslation } from 'react-i18next';
import { getGlobalState } from 'src/features/global/interface';
import styled from 'styled-components';

const Center = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

export function MeasureDetails() {
  const { t } = useTranslation();
  const { lookups } = getGlobalState.useState();
  const dataTypeOptions = useLookupOptions(lookups, 'KPIDataType');
  const scoringTypeOptions = useScoringOptions(lookups);
  const scoringType = useScoringType();

  return (
    <FormSection title={t('MEASURE DETAILS')}>
      <Row>
        <Col>
          <Label>{t('Scoring Type')}:</Label>
        </Col>
        <Col>
          <FormSelect name="scoringType" options={scoringTypeOptions} />
        </Col>
        <Col>
          <Label>{t('Data Type')}:</Label>
        </Col>
        <Col>
          <FormSelect name="dataType" options={dataTypeOptions} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Label>{t('Frequency')}:</Label>
        </Col>
        <Col>
          <FormSelect name="frequency" options={frequencyOptions} />
        </Col>
        <Col>
          <Label>{t('Max. Limit')}:</Label>
        </Col>
        <Col>
          <FormInput name="maxLimit" />
        </Col>
      </Row>
      <Row>
        <Col>
          <Label>{t('Is Value Aggregated?')}:</Label>
        </Col>
        <Col>
          <FormSelect name="isSeriesAggregated" options={boolOptions} />
        </Col>
        <Col>
          <Label>{t('Aggregation')}:</Label>
        </Col>
        <Col>
          <FormSelect name="aggregation" options={aggregationTypeOptions} />
        </Col>
      </Row>
      <Sep />
      <Row>
        <Col></Col>
        <ColSpan3>
          <SubSectionTitle>{t('THRESHOLD VALUES')}</SubSectionTitle>
        </ColSpan3>
      </Row>
      {isKPIScoring4Colors(scoringType) && (
        <Row>
          <Col3>
            <InputWithLabel>
              <IconLabel>
                <ScoringIcon colors={['gray', 'yellow', 'gray', 'gray']} />
                {t('Yellow %')}
              </IconLabel>
              <FormInput name="yellow" />
            </InputWithLabel>
          </Col3>
          <Col3>
            <InputWithLabel>
              <IconLabel>
                <ScoringIcon colors={['gray', 'gray', 'green', 'gray']} />
                {t('Target %')}
              </IconLabel>
              <FormInput name="target" />
            </InputWithLabel>
          </Col3>
          <Col3>
            <InputWithLabel>
              <IconLabel>
                <ScoringIcon colors={['gray', 'gray', 'gray', 'blue']} />
                {t('Best %')}
              </IconLabel>
              <FormInput name="best" />
            </InputWithLabel>
          </Col3>
        </Row>
      )}
      {KPIScoringType.Bounded === scoringType && (
        <Row>
          <Col3>
            <InputWithLabel>
              <IconLabel>
                <ScoringIcon colors={['gray', 'green', 'gray', 'gray']} />
                {t('Low %')}
              </IconLabel>
              <FormInput name="low" />
            </InputWithLabel>
          </Col3>
          <Col3>
            <InputWithLabel>
              <IconLabel>
                <ScoringIcon colors={['gray', 'gray', 'green', 'gray']} />
                {t('High %')}
              </IconLabel>
              <FormInput name="high" />
            </InputWithLabel>
          </Col3>
          <Col3>
            <Center>
              <FormCheckbox name="greenInsideBoundaries" noMargin>
                {t('Green inside boundaries?')}
              </FormCheckbox>
            </Center>
          </Col3>
        </Row>
      )}
    </FormSection>
  );
}
