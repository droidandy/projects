import { FormSection } from 'src/components/FormSection';
import React from 'react';
import {
  ColSpan3,
  Sep,
  SubSectionTitle,
  Label,
  Row,
  Col,
} from './SharedComponents';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';
import { getGlobalState } from 'src/features/global/interface';
import { getCreateKpiState } from '../interface';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ParentField } from './ParentField';
import { convertToOption } from 'src/common/utils';

export function BasicInfo() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { kpiLevels } = getGlobalState.useState();
  const { units, scorecards } = getCreateKpiState.useState();
  const kpiLevelOptions = useSelectOptions(kpiLevels);
  const unitOptions = (units || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));
  const scoreCardOptions = React.useMemo(() => {
    if (!scorecards) {
      return [];
    }
    const unitScorecards = scorecards.filter(item => !!item.unitId);
    const orgScorecards = scorecards.filter(item => !item.unitId);
    const unitScorecardOptions = {
      label: t('Unit Scorecards'),
      options: unitScorecards.map(convertToOption),
    };
    const orgScorecardOptions = {
      label: t('Organization Scorecards'),
      options: orgScorecards.map(convertToOption),
    };
    return [orgScorecardOptions, unitScorecardOptions];
  }, [scorecards]);

  return (
    <FormSection title={t('BASIC INFO')}>
      <Row>
        <Col>
          <Label>{t('KPI Name')}:</Label>
        </Col>
        <ColSpan3>
          <FormInput name="name" langSuffix />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Description')}:</Label>
        </Col>
        <ColSpan3>
          <FormInput name="description" multiline langSuffix />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('KPI Code')}:</Label>
        </Col>
        <ColSpan3>
          <FormInput name="kpiCode" />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Level')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="level" options={kpiLevelOptions} />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Strategy Link')}:</Label>
        </Col>
        <ColSpan3>
          <ParentField />
        </ColSpan3>
      </Row>
      <Sep />
      <Row>
        <Col></Col>
        <ColSpan3>
          <SubSectionTitle>{t('OWNER DETAILS')}</SubSectionTitle>
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Scorecard')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect
            isLoading={!scorecards}
            name="scorecard"
            options={scoreCardOptions}
          />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Responsible Unit')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect
            isLoading={!units}
            name="unit"
            options={unitOptions}
            noMenuPortal
          />
        </ColSpan3>
      </Row>
    </FormSection>
  );
}
