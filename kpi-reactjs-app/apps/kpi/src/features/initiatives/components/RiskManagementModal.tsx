import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import { RiskManagementSymbol, RiskManagementFormSymbol } from '../symbol';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { getSelectOption, catchErrorAndShowModal } from 'src/common/utils';
import { createForm } from 'typeless-form';
import { validateOption, validateString } from 'src/common/helper';
import { SelectOption } from 'src/types';
import { Row, Col } from 'src/components/Grid';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { riskOptions } from 'src/common/options';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { getInitiativesState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { RiskManagementItem } from 'src/types-next';
import { SaveButtons } from 'src/components/SaveButtons';
import {
  updateRiskManagementItem,
  createRiskManagementItem,
} from 'src/services/API-next';
import { useLanguage } from 'src/hooks/useLanguage';

export function RiskManagementModal() {
  handle();
  useRiskManagementForm();
  const { isVisible, isLoading, risk } = getRiskManagementState.useState();
  const { close } = useActions(RiskManagementActions);
  const { submit } = useActions(RiskManagementFormActions);
  const { t } = useTranslation();
  const { initiatives } = getInitiativesState.useState();
  const initiativeOptions = useSelectOptions(initiatives);
  const isEditing = true;
  return (
    <Modal
      size="lg"
      isOpen={isVisible}
      title={t(risk ? 'Edit Risk Management' : 'Add Risk Management')}
      close={close}
    >
      <RiskManagementFormProvider>
        <Row>
          <Col>
            <FormItem label="Linked Initiative" required={isEditing}>
              <FormSelect
                name="linkedInitiative"
                options={initiativeOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col></Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Influence" required={isEditing}>
              <FormInput multiline name="influence" readOnlyText={!isEditing} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Potential Risk" required={isEditing}>
              <FormInput
                multiline
                name="potentialRiskDesc"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Possibility" required={isEditing}>
              <FormSelect
                name="possibility"
                options={riskOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="Impact" required={isEditing}>
              <FormSelect
                name="impact"
                options={riskOptions}
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Counter Measure" required={isEditing}>
              <FormInput
                multiline
                name="counterMeasure"
                readOnlyText={!isEditing}
              />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Notes" required={isEditing}>
              <FormInput multiline name="notes" readOnlyText={!isEditing} />
            </FormItem>
          </Col>
        </Row>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isLoading} />
      </RiskManagementFormProvider>
    </Modal>
  );
}

export const [
  handle,
  RiskManagementActions,
  getRiskManagementState,
] = createModule(RiskManagementSymbol)
  .withActions({
    show: (risk: RiskManagementItem | null) => ({
      payload: { risk },
    }),
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    riskCreated: (risk: RiskManagementItem) => ({
      payload: { risk },
    }),
    riskUpdated: (risk: RiskManagementItem) => ({
      payload: { risk },
    }),
  })
  .withState<RiskManagementState>();

interface RiskManagementState {
  isVisible: boolean;
  isLoading: boolean;
  risk: RiskManagementItem | null;
}

const initialState: RiskManagementState = {
  isVisible: false,
  isLoading: false,
  risk: null,
};

export interface RiskManagementFormValues {
  linkedInitiative: SelectOption;
  influence: string;
  potentialRiskDesc: string;
  possibility: SelectOption;
  impact: SelectOption;
  counterMeasure: string;
  notes: string;
}

export const [
  useRiskManagementForm,
  RiskManagementFormActions,
  getRiskManagementFormState,
  RiskManagementFormProvider,
] = createForm<RiskManagementFormValues>({
  symbol: RiskManagementFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'linkedInitiative');
    validateString(errors, values, 'influence');
    validateString(errors, values, 'potentialRiskDesc');
    validateOption(errors, values, 'possibility');
    validateOption(errors, values, 'impact');
    validateString(errors, values, 'counterMeasure');
    validateString(errors, values, 'notes');
  },
});

handle
  .epic()
  .on(RiskManagementActions.show, ({ risk }) => {
    if (!risk) {
      return [RiskManagementFormActions.reset()];
    } else {
      const lang = useLanguage();
      return [
        RiskManagementFormActions.reset(),
        RiskManagementFormActions.changeMany({
          linkedInitiative: {
            label: <DisplayTransString value={risk.linkedInitiative.name} />,
            value: risk.linkedInitiative.id,
            filterName: risk.linkedInitiative.name[lang],
          },
          influence: risk.influence,
          potentialRiskDesc: risk.potentialRiskDesc,
          possibility: getSelectOption(riskOptions, risk.possibility)!,
          impact: getSelectOption(riskOptions, risk.impact)!,
          counterMeasure: risk.counterMeasure,
          notes: risk.notes,
        }),
      ];
    }
  })
  .on(RiskManagementFormActions.setSubmitSucceeded, () => {
    const { values: formValues } = getRiskManagementFormState();
    const { risk } = getRiskManagementState();
    const values = {
      initiativeId: getInitiativesState().initiativeId!,
      linkedInitiativeId: formValues.linkedInitiative.value,
      influence: formValues.influence,
      potentialRiskDesc: formValues.potentialRiskDesc,
      possibility: formValues.possibility.value,
      impact: formValues.impact.value,
      riskIndex: formValues.possibility.value * formValues.impact.value,
      counterMeasure: formValues.counterMeasure,
      notes: formValues.notes,
    };
    return Rx.concatObs(
      Rx.of(RiskManagementActions.setLoading(true)),
      Rx.defer(() => {
        if (risk) {
          return updateRiskManagementItem(risk.id, values);
        } else {
          return createRiskManagementItem(values);
        }
      }).pipe(
        Rx.mergeMap(result => {
          return [
            risk
              ? RiskManagementActions.riskUpdated(result)
              : RiskManagementActions.riskCreated(result),
            RiskManagementActions.close(),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(RiskManagementActions.setLoading(false))
    );
  });

handle
  .reducer(initialState)
  .replace(RiskManagementActions.show, (state, { risk }) => ({
    ...initialState,
    isVisible: true,
    risk,
  }))
  .on(RiskManagementActions.close, state => {
    state.isVisible = false;
  })
  .on(RiskManagementActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });
