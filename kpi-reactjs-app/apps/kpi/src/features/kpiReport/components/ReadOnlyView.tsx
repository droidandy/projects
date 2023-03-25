import React from 'react';
import { getKpiReportState } from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { TopText } from '../../../components/TopText';
import { DataSeriesTable } from './DataSeriesTable';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';

export function ReadOnlyView() {
  const { t } = useTranslation();

  const { kpiReport, unitReport } = getKpiReportState.useState();
  const period = formatCalendarPeriod(kpiReport.unitReport.reportingCycle);

  return (
    <>
      <TopText
        title={t('KPI Reporting for') + ' ' + period}
        status={unitReport.status}
      />
      <DataSeriesTable isReadOnly />
      <UnitReportComments unitReport={unitReport} />
    </>
  );
}
