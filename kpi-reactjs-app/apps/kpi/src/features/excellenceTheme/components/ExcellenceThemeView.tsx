import React from 'react';
import { getExcellenceThemeState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  ExcellenceThemeFormProvider,
  ExcellenceThemeFormActions,
} from '../excellenceTheme-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';

export const ExcellenceThemeView = () => {
  const { isLoading, isSaving } = getExcellenceThemeState.useState();
  const { submit } = useActions(ExcellenceThemeFormActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ExcellenceThemeFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/excellence-themes" />
          <RequiredNote />
          <FormItem label="Name" required>
            <FormInput name="name" langSuffix />
          </FormItem>
          <FormItem label="Description" required>
            <FormInput multiline name="description" langSuffix />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/settings/excellence-themes"
          onSave={submit}
          isSaving={isSaving}
        />
      </ExcellenceThemeFormProvider>
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
