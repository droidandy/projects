import React from 'react';
import { getExcellenceReportState } from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { ExcellenceItemTable } from './ExcellenceItemTable';
import { TopText } from 'src/components/TopText';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';

export function ReadOnlyView() {
  const { t } = useTranslation();
  const { excellenceReport, unitReport } = getExcellenceReportState.useState();
  const period = formatCalendarPeriod(
    excellenceReport.unitReport.reportingCycle
  );

  return (
    <>
      <TopText
        title={t('Excellence Reporting for') + ' ' + period}
        status={unitReport.status}
      />
      <ExcellenceItemTable isReadOnly />
      <UnitReportComments unitReport={unitReport} />
    </>
  );
}
