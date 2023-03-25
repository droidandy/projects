import React from 'react';
import { getLookupManagementState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  LookupManagementFormProvider,
  LookupManagementFormActions,
} from '../lookup-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';

export const LookupManagementView = () => {
  const { isLoading, isSaving } = getLookupManagementState.useState();
  const { submit } = useActions(LookupManagementFormActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <LookupManagementFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/lookup-management" />
          <RequiredNote />
          <FormItem label="En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <FormItem label="Category" required>
            <FormInput name="category" />
          </FormItem>
          <FormItem label="Slug" required>
            <FormInput name="slug" />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/settings/lookup-management"
          onSave={submit}
          isSaving={isSaving}
        />
      </LookupManagementFormProvider>
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
