import * as Rx from 'src/rx';
import { createModule, useActions } from 'typeless';
import { AmountSymbol, AmountFormSymbol } from '../symbol';
import React from 'react';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { Modal } from '../../../components/Modal';
import { createForm } from 'typeless-form';
import { validateNumber } from '../../../common/helper';
import { SaveButtons } from 'src/components/SaveButtons';
import { createInitiativeItemProgress } from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getInitiativesState } from '../interface';

export function AmountModal() {
  handle();
  useAmountForm();
  const { isVisible, isSaving } = getAmountState.useState();
  const { close } = useActions(AmountActions);
  const { submit } = useActions(AmountFormActions);

  return (
    <Modal isOpen={isVisible} title={'Enter Amount'} close={close} side>
      <AmountFormProvider>
        <FormItem label="Amount" required>
          <FormInput name="amount" />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isSaving} />
      </AmountFormProvider>
    </Modal>
  );
}

export const [handle, AmountActions, getAmountState] = createModule(
  AmountSymbol
)
  .withActions({
    close: null,
    show: null,
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<AmountState>();

interface AmountState {
  isVisible: boolean;
  isSaving: boolean;
}

const initialState: AmountState = {
  isVisible: false,
  isSaving: false,
};

export interface AmountFormValues {
  amount: string;
}

export const [
  useAmountForm,
  AmountFormActions,
  getAmountFormState,
  AmountFormProvider,
] = createForm<AmountFormValues>({
  symbol: AmountFormSymbol,
  validator: (errors, values) => {
    validateNumber(errors, values, 'amount');
  },
});

handle
  .epic()
  .on(AmountActions.show, () => {
    return AmountFormActions.reset();
  })
  .on(AmountFormActions.setSubmitSucceeded, () => {
    return Rx.concatObs(
      Rx.of(AmountActions.setSaving(true)),
      createInitiativeItemProgress({
        initiativeItemId: getInitiativesState().initiativeId!,
        date: new Date().toISOString(),
        progressPercentage: 100,
        budgetSpent: Number(getAmountFormState().values.amount),
      }).pipe(
        Rx.mergeMap(() => {
          return [AmountActions.close()];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(AmountActions.setSaving(false))
    );
  });

handle
  .reducer(initialState)
  .replace(AmountActions.show, state => ({
    ...initialState,
    isVisible: true,
  }))
  .on(AmountActions.close, state => {
    state.isVisible = false;
  })
  .on(AmountActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });
