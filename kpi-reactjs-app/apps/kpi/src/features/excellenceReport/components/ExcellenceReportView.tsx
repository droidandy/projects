import React from 'react';
import { getExcellenceReportState } from '../interface';
import { Portlet } from 'src/components/Portlet';
import { Page } from 'src/components/Page';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { SubmitterView } from './SubmitterView';
import { ReviewerView } from './ReviewerView';
import { useTranslation } from 'react-i18next';
import { getUserPermissions } from 'src/features/global/selectors';
import { useSelector } from 'typeless';
import { ReportCommentsModal } from 'src/features/unitReport/components/ReportCommentsModal';
import { SkipConfirmModal } from 'src/features/unitReport/components/SkipConfirmModal';

export function ExcellenceReportView() {
  const { isLoaded } = getExcellenceReportState.useState();
  const { t } = useTranslation();
  const permissions = useSelector(getUserPermissions);

  const { isSubmitter, isReviewer } = React.useMemo(() => {
    return {
      isSubmitter: permissions.some(
        x => x === 'excellence-reporting:submit-report'
      ),
      isReviewer: permissions.some(
        x => x === 'excellence-reporting:accept-report'
      ),
    };
  }, [permissions]);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }

    return (
      <>
        {isReviewer ? (
          <ReviewerView />
        ) : isSubmitter ? (
          <SubmitterView />
        ) : (
          t('No permission')
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
