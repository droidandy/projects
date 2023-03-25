import React from 'react';
import { Modal } from 'src/components/Modal';
import {
  getOrganizationStructureState,
  OrganizationStructureActions,
} from '../interface';
import { useActions } from 'typeless';
import {
  OrganizationFormProvider,
  OrganizationFormActions,
} from '../organization-form';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormItem } from 'src/components/FormItem';
import { RequiredNote } from 'src/components/RequiredNote';
import { FormInput } from 'src/components/ReduxInput';
import { Trans } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';

export function OrganizationStructureModal() {
  const {
    isFormVisible,
    formEditItem,
    isSaving,
  } = getOrganizationStructureState.useState();
  const lang = useLanguage();
  const { hideForm } = useActions(OrganizationStructureActions);
  const { submit } = useActions(OrganizationFormActions);

  return (
    <Modal
      size="md"
      isOpen={isFormVisible}
      title={
        <Trans>
          {formEditItem ? `Edit ${formEditItem.name[lang]}` : 'Add Unit'}
        </Trans>
      }
      close={hideForm}
    >
      <OrganizationFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <RequiredNote />
          <FormItem label="Name" required>
            <FormInput name="name" langSuffix />
          </FormItem>
          <FormItem label="Description" required>
            <FormInput name="description" langSuffix multiline />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons onCancel={hideForm} onSave={submit} isSaving={isSaving} />
      </OrganizationFormProvider>
    </Modal>
  );
}
