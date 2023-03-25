import React from 'react';
import { TopText } from '../../../components/TopText';
import { getKpiReportState, KpiReportActions } from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { DataSeriesTable } from './DataSeriesTable';
import { useActions } from 'typeless';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';
import { UnitSaveButtons } from 'src/features/unitReport/components/UnitSaveButtons';
import { AddUnitComment } from 'src/features/unitReport/components/AddUnitComment';

export function ReviewerView() {
  const {
    kpiReport,
    isSaving,
    saveType,
    unitReport,
  } = getKpiReportState.useState();
  const { t } = useTranslation();
  const period = formatCalendarPeriod(kpiReport.unitReport.reportingCycle);
  const { save } = useActions(KpiReportActions);
  const isDone = unitReport.status === 'Submitted' ? false : true;

  return (
    <>
      <TopText
        title={t('KPI Reporting for') + ' ' + period}
        desc={t('Please review the following fields')}
        status={unitReport.status}
      />
      <DataSeriesTable isReadOnly />
      <UnitReportComments unitReport={unitReport} />
      <AddUnitComment reportId={unitReport.id} />
      <UnitSaveButtons
        type="reviewer"
        saveType={saveType}
        isDone={isDone}
        isSaving={isSaving}
        save={save}
      />
    </>
  );
}
