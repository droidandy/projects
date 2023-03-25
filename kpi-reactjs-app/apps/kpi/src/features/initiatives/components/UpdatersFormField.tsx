import React from 'react';
import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { UpdatersFormSymbol, UpdatersSymbol } from '../symbol';
import { validateOption } from 'src/common/helper';
import { getInfoFormState, InfoFormActions } from '../info-form';
import { useActions, createModule } from 'typeless';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { useTranslation } from 'react-i18next';
import { UpdatersField } from 'src/components/UpdatersField';
import { UpdatersTable } from 'src/components/UpdatersTable';
import { getInitiativesState } from '../interface';

export function UpdatersFormField() {
  handle();
  useUpdatersForm();
  const { t } = useTranslation();
  const { values: infoFormValues } = getInfoFormState.useState();
  const updaters = infoFormValues.updaters || [];
  const { submit } = useActions(UpdatersFormActions);
  const { change: changeInfo } = useActions(InfoFormActions);
  const { isEditing } = getInitiativesState.useState();

  return (
    <>
      <UpdatersFormProvider>
        <UpdatersField
          submit={submit}
          updaters={updaters}
          checkbox={
            <FormCheckbox name="allowUpdatingProgress">
              {t('allow updating progress')}
            </FormCheckbox>
          }
        />
      </UpdatersFormProvider>
      <UpdatersTable
        updaters={updaters}
        changeInfo={changeInfo}
        boolLabel={t('update progress')}
        boolNameSuffix="allowUpdatingProgress"
        isEditing={isEditing}
      />
    </>
  );
}

export interface UpdatersFormValues {
  user: SelectOption;
  allowUpdatingProgress: boolean;
}

export const [
  useUpdatersForm,
  UpdatersFormActions,
  getUpdatersFormState,
  UpdatersFormProvider,
] = createForm<UpdatersFormValues>({
  symbol: UpdatersFormSymbol,
  validator: (errors, values) => {
    validateOption(errors, values, 'user');
  },
});

export const [handle] = createModule(UpdatersSymbol);

handle.epic().on(UpdatersFormActions.setSubmitSucceeded, () => {
  const { values: infoFormValues } = getInfoFormState();
  const updaters = infoFormValues.updaters || [];
  const { values } = getUpdatersFormState();
  const id = values.user.value;
  return [
    InfoFormActions.changeMany({
      updaters: [...updaters, id],
      [`user_${id}_allowUpdatingProgress`]: values.allowUpdatingProgress,
    }),
    UpdatersFormActions.reset(),
  ];
});
