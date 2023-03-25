import React from 'react';
import { FullPageForm } from 'src/components/FullPageForm';
import { useTranslation } from 'react-i18next';
import { KpiFormProvider, KpiFormActions } from '../kpi-form';
import { useActions } from 'typeless';
import { RouterActions } from 'typeless-router';
import { MeasureDetails } from './MeasureDetails';
import { BasicInfo } from './BasicInfo';
import { SeriesDetails } from './SeriesDetails';
import { getCreateKpiState } from '../interface';

export const CreateKpiView = () => {
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { submit } = useActions(KpiFormActions);
  const { isSaving } = getCreateKpiState.useState();

  return (
    <FullPageForm
      title={t('Create KPI')}
      onCancel={() => {
        push('/my-kpis');
      }}
      onSave={submit}
      isSaving={isSaving}
    >
      <KpiFormProvider>
        <BasicInfo />
        <MeasureDetails />
        <SeriesDetails />
      </KpiFormProvider>
    </FullPageForm>
  );
};
