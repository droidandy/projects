import React from 'react';
import { useActionDetails } from '../module';
import { useActions } from 'typeless';
import { ActionDetailsActions, getActionDetailsState } from '../interface';
import {
  ActionDetailsFormActions,
  ActionDetailsFormProvider,
  useActionDetailsForm,
} from '../actionDetails-form';
import { useTranslation } from 'react-i18next';
import { Modal } from 'src/components/Modal';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { SaveButtons } from 'src/components/SaveButtons';

export const ActionDetailsModal = () => {
  useActionDetailsForm();
  useActionDetails();
  const { isVisible, isSaving } = getActionDetailsState.useState();
  const { close } = useActions(ActionDetailsActions);
  const { submit } = useActions(ActionDetailsFormActions);
  const { t } = useTranslation();

  return (
    <Modal size="lg" isOpen={isVisible} title={t('Add Action')} close={close}>
      <ActionDetailsFormProvider>
        <FormItem label="Name" required>
          <FormInput name="name" langSuffix />
        </FormItem>
        <FormItem label="Start Date" required>
          <FormInput name="startDate" type="date" />
        </FormItem>
        <FormItem label="End Date" required>
          <FormInput name="endDate" type="date" />
        </FormItem>
        <SaveButtons onCancel={close} onSave={submit} isSaving={isSaving} />
      </ActionDetailsFormProvider>
    </Modal>
  );
};
