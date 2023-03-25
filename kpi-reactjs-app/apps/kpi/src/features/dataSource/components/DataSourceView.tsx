import React from 'react';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { getDataSourceState, DataSourceActions } from '../interface';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { BalancedScorecardItemType } from 'src/types-next';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { ResourceForm } from 'src/features/resource/components/ResourceForm';
import { useResource } from 'src/features/resource/module';
import { useResourceForm } from 'src/features/resource/resource-form';

export const DataSourceView = () => {
  const { resource, isLoaded, isSaving, type } = getDataSourceState.useState();
  useResource();
  useResourceForm();
  const { push } = useActions(RouterActions);
  const { save } = useActions(DataSourceActions);
  const backUrl = `/settings/strategy-items/${BalancedScorecardItemType[type]}`;

  const renderDetails = () => {
    if (isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <div>
        <BackButton href={backUrl} />
        <RequiredNote />
        <ResourceForm isEditing isAdding={!resource} />
        <SaveButtonsNext
          topMargin
          isSaving={isSaving}
          cancelAdd={() => {
            push(backUrl);
          }}
          save={save}
        />
      </div>
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
