import React from 'react';
import { useTranslation } from 'react-i18next';
import { DataEntryFilter } from './DataEntryFilter';
import { KpiTableColumns } from './KpiTableColumns';
import { getDataEntryState, DataEntryActions } from '../interface';
import { CommentsSidePanel } from '../../comments/components/CommentsSidePanel';
import { AttachmentsSidePanel } from '../../attachments/components/AttachmentsSidePanel';
import { TableView } from 'src/components/TableView';
import { UnitAccordion } from 'src/components/UnitAccordion';
import { KpiRow } from './KpiRow';
import { useActions } from 'typeless';
import { FilterToggle } from 'src/components/FilterToggle';
import { getGlobalState } from 'src/features/global/interface';
import { SubmissionButtons } from './SubmissionButtons';
import { SkipConfirmModal } from './SkipConfirmModal';
import { ReviewerButtons } from './ReviewerButtons';
import { CommentModal } from './CommentModal';
import { FeedbackSidePanel } from './FeedbackSidePanel';
import { AlertBox } from 'src/components/AlertBox';
import { Container } from 'src/components/Container';
import styled from 'styled-components';
import { UnitReportingPhaseType, User, UserKpiReport } from 'src/types';

const BoxWrapper = styled.div`
  margin-bottom: -20px;
  margin-top: 30px;
`;

function isAnySubmissionPhase(phase: UnitReportingPhaseType) {
  return phase === 'Submission' || phase === 'PendingSubmissionFixes';
}

function isAnyReviewPhase(phase: UnitReportingPhaseType) {
  return (
    phase === 'DGMApproval' ||
    phase === 'GMApproval' ||
    phase === 'Excellence' ||
    phase === 'Review'
  );
}

function checkIsSubmitter(report: UserKpiReport, user: User | null) {
  const orgUser = user?.orgUsers[0];
  return (
    report.unitReporting &&
    report.unitReporting.phases.some(
      phase =>
        isAnySubmissionPhase(phase.phase) &&
        phase.members.some(
          x => x.role === 'FocalPoint' && x.orgUserId === orgUser?.id
        )
    )
  );
}
export function checkIsReviewer(
  report: UserKpiReport,
  user: User | null,
  currentPhase: boolean
) {
  if (!report.unitReporting) {
    return false;
  }
  const orgUser = user?.orgUsers[0];
  if (currentPhase) {
    return (
      isAnyReviewPhase(report.unitReporting.currentPhase.phase) &&
      report.unitReporting.currentPhase.members.some(
        x => x.orgUserId === orgUser?.id
      )
    );
  }
  return report.unitReporting.phases.some(
    phase =>
      isAnyReviewPhase(phase.phase) &&
      phase.members.some(x => x.orgUserId === orgUser?.id)
  );
}

export const DataEntryView = () => {
  const { t } = useTranslation();
  const {
    items,
    isLoading,
    isFilterExpanded,
    processedMap,
  } = getDataEntryState.useState();
  const { setIsFilterExpanded } = useActions(DataEntryActions);
  const { user } = getGlobalState.useState();
  const orgUser = user?.orgUsers[0];

  const isReportActive = React.useMemo(() => {
    return items.some(item => item.unitReporting);
  }, [items, orgUser]);

  const showSubmitterBanner = React.useMemo(() => {
    return items.some(report => checkIsSubmitter(report, user));
  }, [items, orgUser]);

  const showReviewerBanner = React.useMemo(() => {
    return items.some(report => checkIsReviewer(report, user, true));
  }, [items, orgUser]);

  return (
    <>
      <SkipConfirmModal />
      <CommentsSidePanel />
      <AttachmentsSidePanel />
      <CommentModal />
      <FeedbackSidePanel />
      <Container>
        {showSubmitterBanner && (
          <BoxWrapper>
            <AlertBox
              title={t('Time To Send in Your KPIs for Approval!')}
              description={t(
                'Take the time to review the data for your kpis, and click "Submit For Approval" when done.'
              )}
            />
          </BoxWrapper>
        )}
        {showReviewerBanner && (
          <BoxWrapper>
            <AlertBox
              title={t('There are Excellences requiring your approval!')}
              description={t(
                'Please review these Excellences to ensure the data is correct.'
              )}
            />
          </BoxWrapper>
        )}
      </Container>
      <TableView
        title={t('KPI Reports')}
        titleAppend={
          <FilterToggle
            isFilterExpanded={isFilterExpanded}
            setIsFilterExpanded={setIsFilterExpanded}
          />
        }
        header={
          <>
            <DataEntryFilter />
            <KpiTableColumns showStatus={isReportActive} />
          </>
        }
        isLoading={isLoading}
      >
        {items.map(report => {
          const isSubmitter = checkIsSubmitter(report, user);
          const isReviewer = checkIsReviewer(report, user, false);

          return (
            <UnitAccordion
              buttons={
                report.unitReporting && (
                  <>
                    {isSubmitter && (
                      <SubmissionButtons
                        report={report}
                        isProcessed={processedMap[report.unitReporting.id]}
                      />
                    )}
                    {isReviewer && (
                      <ReviewerButtons
                        report={report}
                        isProcessed={processedMap[report.unitReporting.id]}
                      />
                    )}
                  </>
                )
              }
              unit={report.unit}
              key={report.unit.id}
            >
              {report.data.map((item, i) => (
                <KpiRow
                  key={i}
                  item={item}
                  isSubmitter={isSubmitter}
                  isReportActive={isReportActive}
                />
              ))}
            </UnitAccordion>
          );
        })}
      </TableView>
    </>
  );
};
