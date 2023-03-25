import React from 'react';
import { getKpiReportState } from '../interface';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { SkipConfirmModal } from '../../unitReport/components/SkipConfirmModal';
import { SubmitterView } from './SubmitterView';
import { ReviewerView } from './ReviewerView';
import { ExcellenceView } from './ExcellenceView';
import { getUserPermissions } from 'src/features/global/selectors';
import { useSelector } from 'typeless';
import { ReportCommentsModal } from 'src/features/unitReport/components/ReportCommentsModal';
import { ReadOnlyView } from './ReadOnlyView';

export function KpiReportView() {
  const { isLoaded } = getKpiReportState.useState();
  const permissions = useSelector(getUserPermissions);

  const {
    isSubmitter,
    isReviewer,
    isExcellenceReviewer,
  } = React.useMemo(() => {
    return {
      isSubmitter: permissions.some(x => x === 'kpi-reporting:submit-report'),
      isReviewer: permissions.some(x => x === 'kpi-reporting:review-report'),
      isExcellenceReviewer: permissions.some(
        x => x === 'kpi-reporting:accept-report'
      ),
    };
  }, [permissions]);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }

    return (
      <>
        {isExcellenceReviewer ? (
          <ExcellenceView />
        ) : isReviewer ? (
          <ReviewerView />
        ) : isSubmitter ? (
          <SubmitterView />
        ) : (
          <ReadOnlyView />
        )}
      </>
    );
  };

  return (
    <>
      <ReportCommentsModal />
      <SkipConfirmModal />
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
}
