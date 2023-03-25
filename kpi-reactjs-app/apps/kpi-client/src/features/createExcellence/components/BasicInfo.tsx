import { FormSection } from 'src/components/FormSection';
import React from 'react';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';
import { getCreateExcellenceState } from '../interface';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { DisplayTransString } from 'src/components/DisplayTransString';
import styled from 'styled-components';
import { boolOptions, requirementStatusOptions } from 'src/common/options';

export const Col = styled.div`
  padding: 0 15px;
  width: 25%;
`;

export const Col3 = styled.div`
  padding: 0 15px;
  width: ${100 / 3}%;
`;

export const ColSpan3 = styled(Col)`
  width: 75%;
`;

export const Row = styled.div`
  display: flex;
  margin: 0 -15px;
  & + & {
    margin-top: 10px;
  }
`;

export const Label = styled.div`
  font-weight: 600;
  display: flex;
  height: 100%;
  line-height: 38px;
  justify-content: flex-end;
  color: #244159;
`;

export function BasicInfo() {
  const { t } = useTranslation();
  const lang = useLanguage();
  const { units, criteria, themes } = getCreateExcellenceState.useState();
  const unitOptions = (units || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));
  const criteriaOptions = useSelectOptions(criteria);
  const themeOptions = useSelectOptions(themes);

  return (
    <FormSection title={t('BASIC INFO')}>
      <Row>
        <Col>
          <Label>{t('Name')}:</Label>
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
          <FormInput multiline name="description" langSuffix />
        </ColSpan3>
      </Row>
	  <Row>
        <Col>
          <Label>{t('Requirement Status')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect
            name="requirementStatus"
            options={requirementStatusOptions}
          />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Is Active')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="isActive" options={boolOptions} />
        </ColSpan3>
      </Row>
	  <Row>
        <Col>
          <Label>{t('Is Completed')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="isCompleted" options={boolOptions} />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Start date')}:</Label>
        </Col>
        <ColSpan3>
          <FormInput type="date" name="startDate" langSuffix />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('End date')}:</Label>
        </Col>
        <ColSpan3>
          <FormInput type="date" name="endDate" langSuffix />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Excellence Criteria')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="criteria" options={criteriaOptions} />
        </ColSpan3>
      </Row>

      <Row>
        <Col>
          <Label>{t('Excellence Theme')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="theme" options={themeOptions} />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Owner Unit')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="ownerUnit" options={unitOptions} />
        </ColSpan3>
      </Row>
      <Row>
        <Col>
          <Label>{t('Responsible Unit')}:</Label>
        </Col>
        <ColSpan3>
          <FormSelect name="responsibleUnit" options={unitOptions} />
        </ColSpan3>
      </Row>
      
    </FormSection>
  );
}
