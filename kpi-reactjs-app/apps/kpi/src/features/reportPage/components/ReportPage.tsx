import React from 'react';
import { getReportPageState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  ReportPageFormProvider,
  ReportPageFormActions,
} from '../reportPage-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';

export const ReportPage = () => {
  const { isLoading, isSaving } = getReportPageState.useState();
  const { submit } = useActions(ReportPageFormActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ReportPageFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/reports-page" />
          <RequiredNote />
          <FormItem label="En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/reports-page"
          onSave={submit}
          isSaving={isSaving}
        />
      </ReportPageFormProvider>
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
