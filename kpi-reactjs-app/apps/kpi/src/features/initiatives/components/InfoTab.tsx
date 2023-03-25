import styled from 'styled-components';
import { FormItemLabel, FormItem } from 'src/components/FormItem';
import { getInitiativesState, InitiativesActions } from '../interface';
import { getGlobalState } from 'src/features/global/interface';
import { SectionTitle } from 'src/components/SectionTitle';
import React from 'react';
import { InfoFormProvider, getInfoFormState } from '../info-form';
import { Col, Row } from 'src/components/Grid';
import { FormInput } from 'src/components/ReduxInput';
import { useTranslation } from 'react-i18next';
import { FormSelect } from 'src/components/FormSelect';
import { useActions, useMappedState } from 'typeless';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { useLoadUsers } from 'src/features/referencesNext/hooks';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { UpdatersFormField } from './UpdatersFormField';
import { useInitiativeType } from '../hooks';
import { InitiativeItemType } from 'src/types-next';
import { EditButtonBar } from './EditButtonBar';
import { initiativeTypeOptions } from 'src/common/options';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { OutcomeForm } from './OutcomeForm';
import { OutcomesTable } from './OutcomesTable';
import { SkillForm } from './SkillForm';
import { SkillsTable } from './SkillsTable';

const Wrapper = styled.div`
  margin-bottom: -15px;
`;
const Inner = styled.div`
  padding-bottom: 40px;
  ${FormItemLabel} {
    width: 110px;
  }
`;

export function InfoTab() {
  const { lookups } = getGlobalState.useState();
  const { isAdding, isSaving, isEditing } = getInitiativesState.useState();
  const { t } = useTranslation();
  useLoadUsers();
  const typeOptions = useLookupOptions(lookups, 'InitiativeItemType');
  const currencyOptions = useLookupOptions(lookups, 'Currency');
  const { save, cancelAdd } = useActions(InitiativesActions);
  const type = useInitiativeType();
  const requireContracting = useMappedState(
    [getInfoFormState],
    state => state.values.requireContracting
  );

  return (
    <Wrapper>
      <Inner>
        <InfoFormProvider>
          <SectionTitle>{t('Basic Info')}:</SectionTitle>
          <Row>
            <Col>
              <FormItem label="Name" required={isEditing}>
                <FormInput name="name" langSuffix readOnlyText={!isEditing} />
              </FormItem>
            </Col>
            <Col>
              <FormItem label="Type" required={isEditing}>
                <FormSelect
                  name="type"
                  isDisabled={!isAdding}
                  options={typeOptions}
                  readOnlyText={!isEditing}
                />
              </FormItem>
            </Col>
          </Row>
          <FormItem label="Description" required={isEditing}>
            <FormInput
              multiline
              name="description"
              langSuffix
              readOnlyText={!isEditing}
            />
          </FormItem>
          <Row>
            <Col>
              <FormItem label="Start Date" required={isEditing}>
                <FormInput
                  name="startDate"
                  type="date"
                  readOnlyText={!isEditing}
                />
              </FormItem>
            </Col>
            <Col>
              <FormItem label="End Date" required={isEditing}>
                <FormInput
                  name="endDate"
                  type="date"
                  readOnlyText={!isEditing}
                />
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col>
              <FormItem label="Budget" required={isEditing}>
                <FormInput name="budget" readOnlyText={!isEditing} />
              </FormItem>
            </Col>
            <Col>
              <FormItem label="Currency" required={isEditing}>
                <FormSelect
                  name="currency"
                  options={currencyOptions}
                  readOnlyText={!isEditing}
                />
              </FormItem>
            </Col>
          </Row>
          {type === InitiativeItemType.Activity && (
            <>
              {isEditing && <SkillForm />}
              <SkillsTable />
            </>
          )}
          {type === InitiativeItemType.Initiative && (
            <>
              <Row>
                <Col></Col>
                <Col>
                  <FormItem label="FTE" required={isEditing}>
                    <FormInput
                      name="fullTimeEquivalent"
                      readOnlyText={!isEditing}
                    />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  <FormItem label="Type" required={isEditing}>
                    <FormSelect
                      name="initiativeType"
                      options={initiativeTypeOptions}
                      readOnlyText={!isEditing}
                    />
                  </FormItem>
                </Col>
                <Col>
                  <FormItem label="Code" required={isEditing}>
                    <FormInput name="projectCode" readOnlyText={!isEditing} />
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col>
                  {isEditing ? (
                    <NoLabelItem>
                      <FormCheckbox
                        name="requireContracting"
                        readOnlyText={!isEditing}
                      >
                        {t('Require Contracting?')}
                      </FormCheckbox>
                    </NoLabelItem>
                  ) : (
                    <FormItem label="Require Contracting?">
                      <FormCheckbox readOnlyText name="requireContracting">
                        &nbsp;
                      </FormCheckbox>
                    </FormItem>
                  )}
                </Col>
                <Col>
                  {requireContracting && (
                    <FormItem label="Project Contract" required={isEditing}>
                      <FormInput
                        name="contractNumber"
                        readOnlyText={!isEditing}
                      />
                    </FormItem>
                  )}
                </Col>
              </Row>
              {isEditing && <OutcomeForm />}
              <OutcomesTable />
            </>
          )}
          <SectionTitle>{t('Users Details')}:</SectionTitle>
          {isEditing && <UpdatersFormField />}
        </InfoFormProvider>
      </Inner>
      {isEditing ? (
        <SaveButtonsNext
          isSaving={isSaving}
          save={save}
          cancelAdd={cancelAdd}
        />
      ) : (
        <EditButtonBar />
      )}
    </Wrapper>
  );
}
