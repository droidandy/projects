import React from 'react';
import {
  getExcellenceReportState,
  ExcellenceReportActions,
} from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { ExcellenceItemTable } from './ExcellenceItemTable';
import { useActions } from 'typeless';
import { TopText } from 'src/components/TopText';
import { UnitSaveButtons } from 'src/features/unitReport/components/UnitSaveButtons';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';

export function SubmitterView() {
  const { t } = useTranslation();
  const { save } = useActions(ExcellenceReportActions);

  const {
    excellenceReport,
    unitReport,
    isSaving,
    saveType,
    isSubmitted,
  } = getExcellenceReportState.useState();
  const period = formatCalendarPeriod(
    excellenceReport.unitReport.reportingCycle
  );

  const isDone = isSubmitted || unitReport.status !== 'InProgress';

  return (
    <>
      <TopText
        title={t('Excellence Reporting for') + ' ' + period}
        desc={
          t(
            'Please fill the following fields to calculate the actual value for'
          ) +
          ' ' +
          period
        }
        status={unitReport.status}
      />
      <ExcellenceItemTable isReadOnly />
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
