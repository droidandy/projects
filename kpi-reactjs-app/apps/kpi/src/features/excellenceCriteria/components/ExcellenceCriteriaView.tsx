import React from 'react';
import { getExcellenceCriteriaState } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import {
  ExcellenceCriteriaFormProvider,
  ExcellenceCriteriaFormActions,
} from '../excellenceCriteria-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormSelect } from '../../../components/FormSelect';
import { useSelectOptions } from '../../../hooks/useSelectOptions';

export const ExcellenceCriteriaView = () => {
  const {
    isLoading,
    isSaving,
    excellenceCriterias,
    excellenceCriteria,
  } = getExcellenceCriteriaState.useState();
  const { submit } = useActions(ExcellenceCriteriaFormActions);
  const excellenceCriteriasOptions = useSelectOptions(excellenceCriterias);

  const filteredCriteria =
    excellenceCriteriasOptions && excellenceCriteria
      ? excellenceCriteriasOptions.filter(
          criteria => criteria.value !== excellenceCriteria.id
        )
      : excellenceCriteriasOptions;

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ExcellenceCriteriaFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/excellence-criterias" />
          <RequiredNote />
          <FormItem label="Name" required>
            <FormInput name="name" langSuffix />
          </FormItem>
          <FormItem label="Parent Criteria">
            <FormSelect name="parentId" options={filteredCriteria} />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        <SaveButtons
          onCancel="/settings/excellence-criterias"
          onSave={submit}
          isSaving={isSaving}
        />
      </ExcellenceCriteriaFormProvider>
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
