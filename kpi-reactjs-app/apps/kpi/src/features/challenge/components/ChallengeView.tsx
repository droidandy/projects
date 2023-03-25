import React from 'react';
import { getChallengeState, ChallengeActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  ChallengeFormProvider,
  getChallengeFormState,
} from '../challenge-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions, useSelector } from 'typeless';
import { FormSelect } from 'src/components/FormSelect';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { Col, Row } from 'src/components/Grid';
import { FormPeriodPicker } from 'src/components/FormPeriodPicker';
import { getStrategicDocument } from 'src/features/global/selectors';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { getGlobalState } from 'src/features/global/interface';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { RouterActions } from 'typeless-router';
import { ActionDetails } from './ActionDetails';
import { ActionsTable } from './ActionsTable';

export const ChallengeView = () => {
  const { resources, units, isLoaded, isSaving } = getChallengeState.useState();
  const { push } = useActions(RouterActions);
  const { save } = useActions(ChallengeActions);
  const {
    values: { itemType },
  } = getChallengeFormState.useState();

  const { lookups } = getGlobalState.useState();
  const typeOptions = useLookupOptions(lookups, 'BalancedScorecardItemType');
  const resourceOptions = useSelectOptions(resources);
  const unitOptions = useSelectOptions(units);
  const doc = useSelector(getStrategicDocument);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <ChallengeFormProvider>
        <BackButton href="/challenges" />
        <RequiredNote />
        <Row>
          <Col>
            <FormItem label="Name" required>
              <FormInput name="name" langSuffix />
            </FormItem>
          </Col>
          <Col />
        </Row>
        <Row>
          <Col>
            <FormItem label="Description" required>
              <FormInput multiline name="description" langSuffix />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Affected Unit" required>
              <FormSelect
                name="affectedUnit"
                isLoading={!units}
                options={unitOptions}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Challenged Unit" required>
              <FormSelect
                name="challengedUnit"
                isLoading={!units}
                options={unitOptions}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Item Type" required>
              <FormSelect name="itemType" options={typeOptions} />
            </FormItem>
          </Col>
          <Col>
            {itemType && (
              <FormItem label="Item" required>
                <FormSelect
                  name="item"
                  options={resourceOptions}
                  isLoading={!resources}
                />
              </FormItem>
            )}
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Affected Period" required>
              <FormPeriodPicker
                readOnlyText={false}
                start={doc!.startYear}
                end={doc!.endYear}
                name="period"
                minFrequency="Quarterly"
              />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
        <ActionDetails />
        <ActionsTable />

        <SaveButtonsNext
          topMargin
          isSaving={isSaving}
          cancelAdd={() => {
            push('/challenges');
          }}
          save={save}
        />
      </ChallengeFormProvider>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
