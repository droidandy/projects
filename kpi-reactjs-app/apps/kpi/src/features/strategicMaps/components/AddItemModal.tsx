import * as Rx from 'src/rx';
import { validateLangString, validateOption } from 'src/common/helper';
import { AddItemFormSymbol, AddItemSymbol } from '../symbol';
import { createForm } from 'typeless-form';
import { createModule, useActions } from 'typeless';
import React from 'react';
import { Modal } from 'src/components/Modal';
import { useTranslation } from 'react-i18next';
import { SelectOption } from 'src/types';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { useLookupOptions } from 'src/hooks/useLookupOptions';
import { getGlobalState } from 'src/features/global/interface';
import { SaveButtons } from 'src/components/SaveButtons';
import { BalancedScorecardItemType } from 'src/types-next';
import { createResource } from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { StrategicMapsActions } from '../interface';

export function AddItemModal() {
  useAddItemForm();
  handle();
  const { lookups } = getGlobalState.useState();
  const { isVisible, isSaving } = getAddItemState.useState();
  const { close } = useActions(AddItemActions);
  const { submit } = useActions(AddItemFormActions);
  const { t } = useTranslation();

  const baseTypeOptions = useLookupOptions(
    lookups,
    'BalancedScorecardItemType'
  );
  const typeOptions = baseTypeOptions.filter(
    x => x.value !== BalancedScorecardItemType.KPI
  );

  return (
    <Modal size="md" isOpen={isVisible} title={t('Add Item')} close={close}>
      <AddItemFormProvider>
        <FormItem label="Name" required>
          <FormInput name="name" langSuffix />
        </FormItem>
        <FormItem label="Type" required>
          <FormSelect name="type" options={typeOptions} />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isSaving} />
      </AddItemFormProvider>
    </Modal>
  );
}

interface AddItemState {
  isVisible: boolean;
  isSaving: boolean;
  scorecardId: number;
  parentId: number | null;
}

export const [handle, AddItemActions, getAddItemState] = createModule(
  AddItemSymbol
)
  .withActions({
    show: (scorecardId: number, parentId: number | null) => ({
      payload: { scorecardId, parentId },
    }),
    close: null,
    setIsSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
  })
  .withState<AddItemState>();

export interface AddItemFormValues {
  name_ar: string;
  name_en: string;
  type: SelectOption;
}

export const [
  useAddItemForm,
  AddItemFormActions,
  getAddItemFormState,
  AddItemFormProvider,
] = createForm<AddItemFormValues>({
  symbol: AddItemFormSymbol,
  validator: (errors, values) => {
    validateLangString(errors, values, 'name');
    validateOption(errors, values, 'type');
  },
});

handle
  .epic()
  .on(AddItemActions.show, () => AddItemFormActions.reset())
  .on(AddItemFormActions.setSubmitSucceeded, () => {
    const { values: formValues } = getAddItemFormState();
    const { parentId, scorecardId } = getAddItemState();
    const type = formValues.type.value as BalancedScorecardItemType;
    const values = {
      name: {
        en: formValues.name_en,
        ar: formValues.name_ar,
      },
      description: {
        en: '',
        ar: '',
      },
      typeId: type,
      status: 'Active',
      parentId,
      balancedScorecardId: scorecardId,
    } as const;

    return Rx.concatObs(
      Rx.of(AddItemActions.setIsSaving(true)),
      Rx.defer(() => createResource(type, values)).pipe(
        Rx.mergeMap(created => {
          return [
            StrategicMapsActions.scorecardItemCreated(created),
            AddItemActions.close(),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(AddItemActions.setIsSaving(false))
    );
  });

const initialState: AddItemState = {
  isVisible: false,
  isSaving: false,
  parentId: null,
  scorecardId: null!,
};

handle
  .reducer(initialState)
  .on(AddItemActions.show, (state, { scorecardId, parentId }) => {
    state.isVisible = true;
    state.parentId = parentId;
    state.scorecardId = scorecardId;
  })
  .on(AddItemActions.close, state => {
    state.isVisible = false;
  })
  .on(AddItemActions.setIsSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  });
