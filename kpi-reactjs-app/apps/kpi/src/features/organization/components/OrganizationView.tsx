import React from 'react';
import { getOrganizationState, OrganizationActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  OrganizationFormProvider,
  OrganizationFormActions,
} from '../organization-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';

export const OrganizationView = () => {
  const {
    isLoading,
    organization,
    isSaving,
    isDeleting,
  } = getOrganizationState.useState();
  const { submit } = useActions(OrganizationFormActions);
  const { remove } = useActions(OrganizationActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <OrganizationFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/organizations" />
          <RequiredNote />
          <FormItem label="Name - En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Name - Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        {
          <SaveButtons
            showDelete={!!organization}
            onCancel="/settings/organizations"
            onSave={submit}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onDelete={remove}
          />
        }
      </OrganizationFormProvider>
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
