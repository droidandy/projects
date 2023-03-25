import { useTranslation } from 'react-i18next';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { FullPageForm } from 'src/components/FullPageForm';
import React from 'react';
import { getCreateExcellenceState } from '../interface';
import {
  ExcellenceFormProvider,
  ExcellenceFormActions,
} from '../excellence-form';
import { BasicInfo } from './BasicInfo';

export const CreateExcellenceView = () => {
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { submit } = useActions(ExcellenceFormActions);
  const { isSaving } = getCreateExcellenceState.useState();

  return (
    <FullPageForm
      title={t('Create Excellence')}
      onCancel={() => {
        push('/excellence');
      }}
      onSave={submit}
      isSaving={isSaving}
    >
      <ExcellenceFormProvider>
        <BasicInfo />
      </ExcellenceFormProvider>
    </FullPageForm>
  );
};
