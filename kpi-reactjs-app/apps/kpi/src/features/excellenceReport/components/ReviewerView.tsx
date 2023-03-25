import React from 'react';
import { TopText } from '../../../components/TopText';
import {
  getExcellenceReportState,
  ExcellenceReportActions,
} from '../interface';
import { useTranslation } from 'react-i18next';
import { formatCalendarPeriod } from 'src/common/utils';
import { useActions } from 'typeless';
import { UnitReportComments } from 'src/features/unitReport/components/UnitReportComments';
import { UnitSaveButtons } from 'src/features/unitReport/components/UnitSaveButtons';
import { AddUnitComment } from 'src/features/unitReport/components/AddUnitComment';
import { ExcellenceItemTable } from './ExcellenceItemTable';

export function ReviewerView() {
  const {
    excellenceReport,
    isSaving,
    saveType,
    isSubmitted,
    unitReport,
  } = getExcellenceReportState.useState();
  const { t } = useTranslation();
  const period = formatCalendarPeriod(
    excellenceReport.unitReport.reportingCycle
  );
  const { save } = useActions(ExcellenceReportActions);
  const isDone = isSubmitted || unitReport.status !== 'Submitted';

  return (
    <>
      <TopText
        title={t('Excellence Reporting for') + ' ' + period}
        desc={t('Please review the following fields')}
        status={unitReport.status}
      />
      <ExcellenceItemTable isReadOnly={isDone} />
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
