import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import React from 'react';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { getKpiDetailsState, KpiDetailsActions } from '../interface';
import { KpiDataSeriesTable } from './KpiDataSeriesTable';
import { FormInput } from 'src/components/ReduxInput';
import { KpiFormProvider } from '../kpi-form';
import { FormSelect } from 'src/components/FormSelect';
import { getGlobalState } from 'src/features/global/interface';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import {
  frequencyOptions,
  aggregationTypeOptions,
  boolOptions,
  valueTypeOptions,
} from 'src/common/options';
import { useActualValue } from '../hooks';
import { useLanguage } from 'src/hooks/useLanguage';
import { Button } from 'src/components/Button';
import { useActions } from 'typeless';

const Top = styled.div`
  padding: 20px 30px 30px;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Header = styled.div`
  background: #f7f9fc;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 30px;
`;

const Row = styled.div`
  display: flex;
`;

const Section = styled.div`
  padding: 10px 15px 20px;
`;

const Col = styled.div`
  padding: 0 15px;
  width: 25%;
`;

const ColSpan3 = styled(Col)`
  width: 75%;
`;

const Label = styled.div`
  font-weight: 600;
  display: flex;
  height: 100%;
  align-items: center;
`;

const TopButtons = styled.div`
  ${Button} + ${Button} {
    margin-right: 10px; 
  };
`;

const BottomButtons = styled(TopButtons)`
  margin-top: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px;
  ${Button} + ${Button} {
    margin-right: 10px; 
  };
`;

interface DetailsTabProps {
  className?: string;
}

function SaveButtons() {
  const { t } = useTranslation();
  const { cancelEdit, save } = useActions(KpiDetailsActions);
  const { isSaving } = getKpiDetailsState.useState();
  return (
    <>
      <Button onClick={save} styling="primary" loading={isSaving}>
        {t('Save')}
      </Button>
      <Button onClick={cancelEdit} styling="secondary">
        {t('Cancel')}
      </Button>
    </>
  );
}

const _DetailsTab = (props: DetailsTabProps) => {
  const { className } = props;
  const lang = useLanguage();
  const { t } = useTranslation();
  const { edit } = useActions(KpiDetailsActions);
  const { isEditing, units } = getKpiDetailsState.useState();
  const { lookups, kpiLevels } = getGlobalState.useState();
  const kpiLevelOptions = useSelectOptions(kpiLevels);
  const scoringTypeOptions = useLookupOptions(lookups, 'KPIScoringType');
  const dataTypeOptions = useLookupOptions(lookups, 'KPIDataType');
  const actualValue = useActualValue();

  const unitOptions = (units || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));

  return (
    <KpiFormProvider>
      <div className={className}>
        <Top>
          {t('KPI Details')}
          <TopButtons>
            {isEditing ? (
              <SaveButtons />
            ) : (
              <Button onClick={edit} styling="primary">
                {t('Edit')}
              </Button>
            )}
          </TopButtons>
        </Top>
        <Header>{t('Basic Info')}</Header>
        <Section>
          <Row>
            <Col>
              <Label>{t('KPI Name')}:</Label>
            </Col>
            <ColSpan3>
              <FormInput name="name" langSuffix readOnlyText={!isEditing} />
            </ColSpan3>
          </Row>
          <Row>
            <Col>
              <Label>{t('Description')}:</Label>
            </Col>
            <ColSpan3>
              <FormInput
                name="description"
                multiline
                langSuffix
                readOnlyText={!isEditing}
              />
            </ColSpan3>
          </Row>
          <Row>
            <Col>
              <Label>{t('KPI Code')}:</Label>
            </Col>
            <ColSpan3>
              <FormInput name="kpiCode" readOnlyText={!isEditing} />
            </ColSpan3>
          </Row>
          <Row>
            <Col>
              <Label>{t('Level')}:</Label>
            </Col>
            <ColSpan3>
              <FormSelect
                name="level"
                options={kpiLevelOptions}
                readOnlyText={!isEditing}
              />
            </ColSpan3>
          </Row>
        </Section>
        <Header>{t('Measure Details')}</Header>
        <Section>
          <Row>
            <Col>
              <Label>{t('Scoring Type')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="scoringType"
                options={scoringTypeOptions}
                readOnlyText={!isEditing}
              />
            </Col>
            <Col>
              <Label>{t('Data Type')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="dataType"
                options={dataTypeOptions}
                readOnlyText={!isEditing}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Label>{t('Frequency')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="frequency"
                options={frequencyOptions}
                readOnlyText={!isEditing}
              />
            </Col>
            <Col>
              <Label>{t('Max. Limit')}:</Label>
            </Col>
            <Col>
              <FormInput name="maxLimit" readOnlyText={!isEditing} />
            </Col>
          </Row>
          <Row>
            <Col>
              <Label>{t('Is Value Aggregated?')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="isSeriesAggregated"
                options={boolOptions}
                readOnlyText={!isEditing}
              />
            </Col>
            <Col>
              <Label>{t('Aggregation')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="aggregation"
                options={aggregationTypeOptions}
                readOnlyText={!isEditing}
              />
            </Col>
          </Row>
        </Section>
        <Header>{t('Series Details')}</Header>
        <Section>
          <Row>
            <Col>
              <Label>{t('Actual Value')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="actualValue"
                options={valueTypeOptions}
                readOnlyText={!isEditing}
              />
            </Col>
            <Col>
              <Label>{t('Goal')}:</Label>
            </Col>
            <Col>
              <FormSelect
                name="goal"
                options={valueTypeOptions}
                readOnlyText={!isEditing}
                isDisabled={actualValue === 'Index'}
              />
            </Col>
          </Row>
          <KpiDataSeriesTable />
        </Section>
        <Header>{t('User Details')}</Header>
        <Section>
          <Row>
            <Col>
              <Label>{t('Responsible Unit')}:</Label>
            </Col>
            <ColSpan3>
              <FormSelect
                isLoading={!units}
                name="unit"
                options={unitOptions}
                readOnlyText={!isEditing}
                noMenuPortal
              />
            </ColSpan3>
          </Row>
        </Section>
      </div>
      {isEditing && (
        <BottomButtons>
          <SaveButtons />
        </BottomButtons>
      )}
    </KpiFormProvider>
  );
};

export const DetailsTab = styled(_DetailsTab)`
  display: block;
  color: #244159;
  ${Row} + ${Row} {
    margin-top: 10px;
  }
`;
