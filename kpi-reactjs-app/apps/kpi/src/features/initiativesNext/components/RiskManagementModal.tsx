import { createModule, useActions } from 'typeless';
import { RiskManagementSymbol, RiskManagementFormSymbol } from '../symbol';
import React from 'react';
import * as Rx from 'src/rx';
import { useTranslation } from 'react-i18next';
import { getSelectOption, catchErrorAndShowModal } from 'src/common/utils';
import { createForm } from 'typeless-form';
import { validateOption, validateString } from 'src/common/helper';
import { SelectOption } from 'src/types';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { riskOptions } from 'src/common/options';
import { useSelectOptions } from 'src/hooks/useSelectOptions';
import { getInitiativesState } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { RiskManagementItem } from 'src/types-next';
import { SaveButtons } from 'src/components/SaveButtons';
import { SidePanel } from 'src/components/SidePanel';
import {
  createRiskManagementItem,
  updateRiskManagementItem,
} from 'src/services/API-next';

export function RiskManagementModal() {
  handle();
  useRiskManagementForm();
  const { isVisible, isSaving, risk } = getRiskManagementState.useState();
  const { close } = useActions(RiskManagementActions);
  const { submit } = useActions(RiskManagementFormActions);
  const { t } = useTranslation();
  const { initiatives } = getInitiativesState.useState();
  const rootInitiatives = React.useMemo(
    () => initiatives.filter(x => !x.parentId),
    [initiatives]
  );
  const initiativeOptions = useSelectOptions(rootInitiatives);
  const isEditing = true;
  return (
    <SidePanel
      isOpen={isVisible}
      title={t(risk ? 'Edit Risk Management' : 'Add Risk Management')}
      close={close}
    >
      <RiskManagementFormProvider>
        <FormItem label="Linked Initiative" required={isEditing}>
          <FormSelect
            name="linkedInitiative"
            options={initiativeOptions}
            readOnlyText={!isEditing}
          />
        </FormItem>
        <FormItem label="Influence" required={isEditing}>
          <FormInput multiline name="influence" readOnlyText={!isEditing} />
        </FormItem>
        <FormItem label="Potential Risk" required={isEditing}>
          <FormInput
            multiline
            name="potentialRiskDesc"
            readOnlyText={!isEditing}
          />
        </FormItem>
        <FormItem label="Possibility" required={isEditing}>
          <FormSelect
            name="possibility"
            options={riskOptions}
            readOnlyText={!isEditing}
          />
        </FormItem>
        <FormItem label="Impact" required={isEditing}>
          <FormSelect
            name="impact"
            options={riskOptions}
            readOnlyText={!isEditing}
          />
        </FormItem>
        <FormItem label="Counter Measure" required={isEditing}>
          <FormInput
            multiline
            name="counterMeasure"
            readOnlyText={!isEditing}
          />
        </FormItem>
        <FormItem label="Notes" required={isEditing}>
          <FormInput multiline name="notes" readOnlyText={!isEditing} />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isSaving} />
      </RiskManagementFormProvider>
    </SidePanel>
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
  isSaving: boolean;
  risk: RiskManagementItem | null;
}

const initialState: RiskManagementState = {
  isVisible: false,
  isSaving: false,
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
      return [
        RiskManagementFormActions.reset(),
        RiskManagementFormActions.changeMany({
          linkedInitiative: {
            label: <DisplayTransString value={risk.linkedInitiative.name} />,
            value: risk.linkedInitiative.id,
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
    const { isEditing } = getInitiativesState();
    const { values: formValues } = getRiskManagementFormState();
    const { risk } = getRiskManagementState();
    const { initiatives } = getInitiativesState();
    const linkedInitiativeId = formValues.linkedInitiative.value;
    const values = {
      id: risk ? risk.id : -Date.now(),
      initiativeId: getInitiativesState().initiativeId!,
      linkedInitiative: initiatives.find(x => x.id === linkedInitiativeId),
      linkedInitiativeId,
      influence: formValues.influence,
      potentialRiskDesc: formValues.potentialRiskDesc,
      possibility: formValues.possibility.value,
      impact: formValues.impact.value,
      riskIndex: formValues.possibility.value * formValues.impact.value,
      counterMeasure: formValues.counterMeasure,
      notes: formValues.notes,
    } as RiskManagementItem;
    if (isEditing) {
      return [
        risk
          ? RiskManagementActions.riskUpdated(values)
          : RiskManagementActions.riskCreated(values),
        RiskManagementActions.close(),
      ];
    } else {
      delete values.linkedInitiative;
      if (values.id < 0) {
        delete values.id;
      }
      return Rx.concatObs(
        Rx.of(RiskManagementActions.setSaving(true)),
        Rx.defer(() => {
          if (values.id) {
            return updateRiskManagementItem(values.id, values);
          } else {
            return createRiskManagementItem(values);
          }
        }).pipe(
          Rx.mergeMap(created => [
            values.id
              ? RiskManagementActions.riskUpdated(created)
              : RiskManagementActions.riskCreated(created),
            RiskManagementActions.close(),
          ]),
          catchErrorAndShowModal()
        ),
        Rx.of(RiskManagementActions.setSaving(false))
      );
    }
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
  .on(RiskManagementActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });
