import React from 'react';
import { getKpiReportState, KpiReportActions } from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { TopText } from '../../../components/TopText';
import { DataSeriesTable } from './DataSeriesTable';
import { useActions } from 'typeless';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';
import { UnitSaveButtons } from 'src/features/unitReport/components/UnitSaveButtons';

export function SubmitterView() {
  const { t } = useTranslation();
  const { save } = useActions(KpiReportActions);

  const {
    kpiReport,
    unitReport,
    isSaving,
    saveType,
    isSubmitted,
  } = getKpiReportState.useState();
  const period = formatCalendarPeriod(kpiReport.unitReport.reportingCycle);

  const isDone =
    isSubmitted || (unitReport.status === 'InProgress' ? false : true);

  return (
    <>
      <TopText
        title={t('KPI Reporting for') + ' ' + period}
        desc={
          t(
            'Please fill the following fields to calculate the actual value for'
          ) +
          ' ' +
          period
        }
        status={unitReport.status}
      />
      <DataSeriesTable isReadOnly={isDone} />
      <UnitReportComments unitReport={unitReport} />
      <UnitSaveButtons
        type="submitter"
        saveType={saveType}
        isDone={isDone}
        isSaving={isSaving}
        save={save}
      />
    </>
  );
}
