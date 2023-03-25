import React from 'react';
import { SelectOption } from 'src/types';
import { createForm } from 'typeless-form';
import { validateOption } from 'src/common/helper';
import { useActions, createModule } from 'typeless';
import { FormCheckbox } from 'src/components/FormCheckbox';
import { useTranslation } from 'react-i18next';
import { UpdatersField } from 'src/components/UpdatersField';
import { UpdatersTable } from 'src/components/UpdatersTable';
import { getResourceFormState, ResourceFormActions } from '../resource-form';
import { UpdatersSymbol, UpdatersFormSymbol } from '../symbol';

interface UpdatersFormFieldProps {
  isEditing: boolean;
}

export function UpdatersFormField(props: UpdatersFormFieldProps) {
  const { isEditing } = props;
  handle();
  useUpdatersForm();
  const { t } = useTranslation();
  const { values: infoFormValues } = getResourceFormState.useState();
  const updaters = infoFormValues.updaters || [];
  const { submit } = useActions(UpdatersFormActions);
  const { change: changeInfo } = useActions(ResourceFormActions);

  return (
    <>
      {isEditing && (
        <UpdatersFormProvider>
          <UpdatersField
            submit={submit}
            updaters={updaters}
            checkbox={
              <FormCheckbox name="allowUpdatingScoringThreshold">
                {t('allow updating scoring threshold')}
              </FormCheckbox>
            }
          />
        </UpdatersFormProvider>
      )}
      <UpdatersTable
        updaters={updaters}
        changeInfo={changeInfo}
        boolLabel={t('update thresholds')}
        boolNameSuffix="allowUpdatingScoringThreshold"
        isEditing={isEditing}
      />
    </>
  );
}

export interface UpdatersFormValues {
  user: SelectOption;
  allowUpdatingScoringThreshold: boolean;
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
  const { values: infoFormValues } = getResourceFormState();
  const updaters = infoFormValues.updaters || [];
  const { values } = getUpdatersFormState();
  const id = values.user.value;
  return [
    ResourceFormActions.changeMany({
      updaters: [...updaters, id],
      [`user_${id}_allowUpdatingScoringThreshold`]: values.allowUpdatingScoringThreshold,
    }),
    UpdatersFormActions.reset(),
  ];
});
