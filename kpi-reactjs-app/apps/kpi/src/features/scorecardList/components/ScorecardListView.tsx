import React from 'react';
import { useActions } from 'typeless';
import { getScorecardListState } from '../interface';
import { getGlobalState } from 'src/features/global/interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { FormSelect } from 'src/components/FormSelect';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { SaveButtons } from 'src/components/SaveButtons';
import {
  ScorecardListFormProvider,
  ScorecardListFormActions,
} from '../scorecardList-form';
import { useLanguage } from 'src/hooks/useLanguage';

export const ScorecardListView = () => {
  const { isLoading, isSaving } = getScorecardListState.useState();
  const { organizationUnits } = getGlobalState.useState();
  const { submit } = useActions(ScorecardListFormActions);
  const lang = useLanguage();
  const unitIdOptions = (organizationUnits || []).map(unit => ({
    label: <DisplayTransString value={unit.name} />,
    value: unit.id,
    filterName: unit.name[lang],
  }));

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ScorecardListFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/scorecards" />
          <RequiredNote />
          <FormItem label="Name - En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Name - Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <FormItem label="Description - En" required>
            <FormInput name="description_en" />
          </FormItem>
          <FormItem label="Description - Ar" required>
            <FormInput name="description_ar" />
          </FormItem>
          <FormItem label="Responsible Unit" required>
            <FormSelect name="unitId" options={unitIdOptions} />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        {
          <SaveButtons
            onCancel="/settings/scorecards"
            onSave={submit}
            isSaving={isSaving}
          />
        }
      </ScorecardListFormProvider>
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
