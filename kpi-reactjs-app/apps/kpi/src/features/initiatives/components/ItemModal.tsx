import React from 'react';
import * as Rx from 'src/rx';
import { Modal } from 'src/components/Modal';
import { createModule, useActions } from 'typeless';
import { ItemSymbol, ItemFormSymbol } from '../symbol';
import { createForm } from 'typeless-form';
import { validateDate, validateNumber } from 'src/common/helper';
import { useTranslation } from 'react-i18next';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormInput } from 'src/components/ReduxInput';
import { FormItem } from 'src/components/FormItem';
import { catchErrorAndShowModal, dateToInputFormat } from 'src/common/utils';
import { InitiativeItemProgress } from 'src/types-next';
import { getInitiativesState } from '../interface';
import {
  updateInitiativeItemProgress,
  createInitiativeItemProgress,
} from 'src/services/API-next';

export function ItemModal() {
  useItemForm();
  useItemModule();
  const { isVisible, isLoading } = getItemState.useState();
  const { t } = useTranslation();
  const { close } = useActions(ItemActions);
  const { submit } = useActions(ItemFormActions);

  return (
    <Modal
      size="lg"
      isOpen={isVisible}
      title={t('Update Progress')}
      close={close}
    >
      <ItemFormProvider>
        <FormItem label="Date" required>
          <FormInput name="date" type="date" />
        </FormItem>
        <FormItem label="Percent Complete" required>
          <FormInput name="progressPercentage" />
        </FormItem>
        <FormItem label="Budget Spent" required>
          <FormInput name="budgetSpent" />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isLoading} />
      </ItemFormProvider>
    </Modal>
  );
}

export const [handle, ItemActions, getItemState] = createModule(ItemSymbol)
  .withActions({
    show: (item: InitiativeItemProgress | null) => ({ payload: { item } }),
    close: null,
    setLoading: (isLoading: boolean) => ({ payload: { isLoading } }),
    itemCreated: (item: InitiativeItemProgress) => ({
      payload: { item },
    }),
    itemUpdated: (item: InitiativeItemProgress) => ({
      payload: { item },
    }),
  })
  .withState<ItemState>();

const initialState = {
  isVisible: false,
  isLoading: false,
  item: null,
};

const useItemModule = () => handle();

interface ItemState {
  isVisible: boolean;
  isLoading: boolean;
  item: InitiativeItemProgress | null;
}

export interface ItemFormValues {
  date: string;
  progressPercentage: number;
  budgetSpent: number;
}

export const [
  useItemForm,
  ItemFormActions,
  getItemFormState,
  ItemFormProvider,
] = createForm<ItemFormValues>({
  symbol: ItemFormSymbol,
  validator: (errors, values) => {
    validateDate(errors, values, 'date');
    validateNumber(errors, values, 'budgetSpent');
    validateNumber(errors, values, 'progressPercentage');
  },
});

handle
  .epic()
  .on(ItemActions.show, ({ item }) => {
    if (!item) {
      return ItemFormActions.reset();
    } else {
      return [
        ItemFormActions.reset(),
        ItemFormActions.changeMany({
          date: dateToInputFormat(item.date),
          progressPercentage: item.progressPercentage,
          budgetSpent: item.budgetSpent,
        }),
      ];
    }
  })
  .on(ItemFormActions.setSubmitSucceeded, () => {
    const { values: formValues } = getItemFormState();
    const { item } = getItemState();
    const values = {
      initiativeItemId: getInitiativesState().initiativeId!,
      date: formValues.date,
      progressPercentage: Number(formValues.progressPercentage),
      budgetSpent: Number(formValues.budgetSpent),
    };
    return Rx.concatObs(
      Rx.of(ItemActions.setLoading(true)),
      Rx.defer(() => {
        if (item) {
          return updateInitiativeItemProgress(item.id, values);
        } else {
          return createInitiativeItemProgress(values);
        }
      }).pipe(
        Rx.mergeMap(result => {
          return [
            item
              ? ItemActions.itemUpdated(result)
              : ItemActions.itemCreated(result),
            ItemActions.close(),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(ItemActions.setLoading(false))
    );
  });

handle
  .reducer(initialState)
  .on(ItemActions.show, (state, { item }) => {
    state.isVisible = true;
    state.item = item;
  })
  .on(ItemActions.close, state => {
    state.isVisible = false;
  })
  .on(ItemActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  });
