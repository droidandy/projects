import React from 'react';
import { SectionTitle } from '../../../components/SectionTitle';
import { useTranslation } from 'react-i18next';
import { getGlobalState } from 'src/features/global/interface';
import { useScoringType, useActualValue, useAggregationValue } from '../hooks';
import { Col, Row } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormSelect } from 'src/components/FormSelect';
import { FormInput } from 'src/components/ReduxInput';
import { KPIScoringType } from 'src/types-next';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { NoLabelItem } from 'src/components/NoLabelItem';
import styled from 'styled-components';
import { KpiPeriodForm } from './KpiPeriodForm';
import { KpiValuesTable } from './KpiValuesTable';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { isKPIScoring4Colors } from 'src/common/helper';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import {
  periodFrequencyOptions,
  aggregationTypeOptions,
  valueTypeOptions,
} from 'src/common/options';
import { LinkKpi } from './LinkKpi';
import { LinkKpiTable } from './LinkKpiTable';

const percentWidth = 60;

const Center = styled.div`
  padding-top: 15px;
  display: flex;
  align-items: center;
  height: 100%;
`;

interface KPIFormFieldsProps {
  isEditing: boolean;
}

const CheckboxWrapper = styled.div`
  padding-top: 15px;
  padding-bottom: 15px;
  display: flex;
  align-items: center;
  height: 100%;
`;

export function KPIFormFields(props: KPIFormFieldsProps) {
  const { isEditing } = props;
  const { lookups, kpiLevels } = getGlobalState.useState();
  const { t } = useTranslation();
  const scoringOptions = useLookupOptions(lookups, 'KPIScoringType');
  const dataTypeOptions = useLookupOptions(lookups, 'KPIDataType');
  const scoringType = useScoringType();
  const actualValue = useActualValue();
  const aggregationValue = useAggregationValue();
  const levelOptions = useSelectOptions(kpiLevels);
  return (
    <>
      <SectionTitle>{t('KPI Details')}:</SectionTitle>
      <Row>
        <Col>
          <FormItem label="Level" required={isEditing}>
            <FormSelect
              name="level"
              options={levelOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="KPI Code" required={isEditing}>
            <FormInput name="kpiCode" readOnlyText={!isEditing} />
          </FormItem>
        </Col>
      </Row>
      <SectionTitle>{t('Measure Details')}:</SectionTitle>
      <Row>
        <Col>
          <FormItem label="Scoring Type" required={isEditing}>
            <FormSelect
              name="scoringType"
              options={scoringOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="Data Type" required={isEditing}>
            <FormSelect
              name="dataType"
              options={dataTypeOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="Frequency" required={isEditing}>
            <FormSelect
              name="frequency"
              options={periodFrequencyOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="Aggregation" required={isEditing}>
            <FormSelect
              name="aggregation"
              options={aggregationTypeOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col>
          <FormItem label="Max Limit">
            <FormInput name="maxLimit" readOnlyText={!isEditing} />
          </FormItem>
        </Col>
        <Col></Col>
      </Row>
      {aggregationValue === 'Sum' && (
        <Row>
          <Col></Col>
          <Col>
            {isEditing ? (
              <CheckboxWrapper>
                <NoLabelItem>
                  <FormCheckbox
                    name="isSeriesAggregated"
                    readOnlyText={!isEditing}
                    noMargin
                  >
                    {t('value aggregated?')}
                  </FormCheckbox>
                </NoLabelItem>
              </CheckboxWrapper>
            ) : (
              <CheckboxWrapper>
                <NoLabelItem>
                  <FormCheckbox
                    name="isSeriesAggregated"
                    readOnlyText={!isEditing}
                  >
                    {t('value aggregated?')}
                  </FormCheckbox>
                </NoLabelItem>
              </CheckboxWrapper>
            )}
          </Col>
        </Row>
      )}
      <SectionTitle>{t('Series Details')}:</SectionTitle>
      <Row>
        <Col>
          <FormItem label="Actual Value" required={isEditing}>
            <FormSelect
              name="actualValue"
              options={valueTypeOptions}
              readOnlyText={!isEditing}
            />
          </FormItem>
        </Col>
        <Col>
          <FormItem label="Goal" required={isEditing}>
            <FormSelect
              name="goal"
              options={valueTypeOptions}
              readOnlyText={!isEditing}
              isDisabled={actualValue === 'Index'}
            />
          </FormItem>
        </Col>
      </Row>
      {isKPIScoring4Colors(scoringType) && (
        <Row>
          <Col>
            <FormItem label="Yellow %" required={isEditing}>
              <FormInput
                style={{ width: percentWidth }}
                name="yellow"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Target %" required={isEditing}>
              <FormInput
                style={{ width: percentWidth }}
                name="target"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Best %" required={isEditing}>
              <FormInput
                style={{ width: percentWidth }}
                name="best"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
      )}
      {KPIScoringType.Bounded === scoringType && (
        <Row>
          <Col>
            <FormItem label="Low %" required={isEditing}>
              <FormInput
                style={{ width: percentWidth }}
                name="low"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="High %" required={isEditing}>
              <FormInput
                style={{ width: percentWidth }}
                name="high"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col grow={2}>
            <Center>
              <FormCheckbox name="greenInsideBoundaries" noMargin>
                {t('Green inside boundaries?')}
              </FormCheckbox>
            </Center>
          </Col>
        </Row>
      )}
      {actualValue === 'Index' ? (
        <>
          {isEditing && <LinkKpi />}
          <LinkKpiTable isEditing={isEditing} />
        </>
      ) : (
        <>
          {isEditing && <KpiPeriodForm />}
          <KpiValuesTable isEditing={isEditing} />
        </>
      )}
    </>
  );
}
