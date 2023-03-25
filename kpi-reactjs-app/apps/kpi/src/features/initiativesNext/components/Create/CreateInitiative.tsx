import * as React from 'react';
import styled from 'styled-components';
import { Card } from 'src/components/Card';
import { CardTitleNext } from 'src/components/CardTitleNext';
import { getInitiativesState, InitiativesActions } from '../../interface';
import { useSelector, useActions, useMappedState } from 'typeless';
import { useTranslation } from 'react-i18next';
import { getCurrentItemTitle } from '../../selectors';
import { InfoFormProvider, getInfoFormState } from '../../info-form';
import { SectionTitle } from 'src/components/SectionTitle';
import { Row, Col } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { getGlobalState } from 'src/features/global/interface';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { NoLabelItem } from 'src/components/NoLabelItem';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { UpdatersFormField } from './UpdatersFormField';
import { OutcomesTable } from './OutcomesTable';
import { OutcomeForm } from './OutcomeForm';
import {
  initiativeTypeOptions,
  initiativeLevelOptions,
} from 'src/common/options';
import { Button } from 'src/components/Button';
import { ActivitiesTable } from './ActivitiesTable';
import { ActivityActions } from '../ActivityModal';
import { RelatedItemActions } from '../RelatedItemModal';
import { RelatedItemsTable } from './RelatedItemsTable';
import { RiskManagementActions } from '../RiskManagementModal';
import { RisksTable } from './RisksTable';

interface InitiativeDetailsProps {
  className?: string;
}

const _CreateInitiative = (props: InitiativeDetailsProps) => {
  const { className } = props;
  const { lookups } = getGlobalState.useState();
  const { initiative, isAdding, isSaving } = getInitiativesState.useState();
  const { t } = useTranslation();
  const { save, cancelAdd } = useActions(InitiativesActions);
  const { show: showActivity } = useActions(ActivityActions);
  const { show: showRelatedItem } = useActions(RelatedItemActions);
  const { show: showRiskManagement } = useActions(RiskManagementActions);
  const title = useSelector(getCurrentItemTitle);
  const currencyOptions = useLookupOptions(lookups, 'Currency');
  const requireContracting = useMappedState(
    [getInfoFormState],
    state => state.values.requireContracting
  );
  if (!initiative && !isAdding) {
    return null;
  }
  return (
    <Card className={className}>
      <CardTitleNext>{title}</CardTitleNext>
      <InfoFormProvider>
        <SectionTitle>{t('Basic Info')}:</SectionTitle>
        <Row>
          <Col>
            <FormItem label="Name" required>
              <FormInput name="name" langSuffix />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
        <FormItem label="Description" required>
          <FormInput multiline name="description" langSuffix />
        </FormItem>
        <Row>
          <Col>
            <FormItem label="Start Date" required>
              <FormInput name="startDate" type="date" />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="End Date" required>
              <FormInput name="endDate" type="date" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Budget">
              <FormInput name="budget" />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Currency" required>
              <FormSelect name="currency" options={currencyOptions} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Initiative Level" required>
              <FormSelect
                name="initiativeLevel"
                options={initiativeLevelOptions}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="FTE" required>
              <FormInput name="fullTimeEquivalent" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Type" required>
              <FormSelect
                name="initiativeType"
                options={initiativeTypeOptions}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Code" required>
              <FormInput name="projectCode" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <NoLabelItem>
              <FormCheckbox name="requireContracting">
                {t('Require Contracting?')}
              </FormCheckbox>
            </NoLabelItem>
          </Col>
          <Col>
            {requireContracting && (
              <FormItem label="Project Contract" required>
                <FormInput name="contractNumber" />
              </FormItem>
            )}
          </Col>
        </Row>
        <OutcomeForm />
        <OutcomesTable />
        <SectionTitle>{t('Activities')}:</SectionTitle>
        <NoLabelItem>
          <Button onClick={() => showActivity(null)}>
            {t('Add Activity')}
          </Button>
        </NoLabelItem>
        <ActivitiesTable />
        <SectionTitle>{t('Related Items')}:</SectionTitle>
        <NoLabelItem>
          <Button onClick={() => showRelatedItem()}>
            {t('Add Related Item')}
          </Button>
        </NoLabelItem>
        <RelatedItemsTable />
        <SectionTitle>{t('Risk Management')}:</SectionTitle>
        <NoLabelItem>
          <Button onClick={() => showRiskManagement(null)}>
            {t('Add Risk Management')}
          </Button>
        </NoLabelItem>
        <RisksTable />
        <SectionTitle>{t('Users Details')}:</SectionTitle>
        <UpdatersFormField />
        <SaveButtonsNext
          isSaving={isSaving}
          save={save}
          cancelAdd={cancelAdd}
        />
      </InfoFormProvider>
    </Card>
  );
};

export const CreateInitiative = styled(_CreateInitiative)`
  display: block;
  min-height: 100%;
  background: white;
  overflow: auto;
  ${SaveButtonsNext} {
    margin-top: 20px;
  }
`;
