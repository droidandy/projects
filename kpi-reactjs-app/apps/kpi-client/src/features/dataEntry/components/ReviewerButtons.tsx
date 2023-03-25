import React from 'react';
import { UserKpiReport } from 'src/types';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from 'src/icons/CheckIcon';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { DataEntryActions } from '../interface';
import { CancelIcon } from 'src/icons/CancelIcon';
import { FeedbackActions } from './FeedbackSidePanel';
import { getGlobalState } from 'src/features/global/interface';
import { checkIsReviewer } from './DataEntryView';

export interface ReviewerButtonsProps {
  report: UserKpiReport;
  className?: string;
  isProcessed: boolean;
}

const LongButton = styled(Button)`
  min-width: 190px;
`;

const _ReviewerButtons = (props: ReviewerButtonsProps) => {
  const { className, report, isProcessed } = props;
  const { user } = getGlobalState.useState();
  const { t } = useTranslation();
  const { save } = useActions(DataEntryActions);
  const { show: showFeedback } = useActions(FeedbackActions);
  const [isSaving, setIsSaving] = React.useState<'reject' | 'approve' | null>(
    null
  );
  const showButtons =
    checkIsReviewer(report, user, true) &&
    report.unitReporting.status !== 'PendingOthers';
  return (
    <div className={className}>
      {showButtons && (
        <>
          <LongButton
            styling="danger"
            loading={isSaving === 'reject'}
            disabled={isProcessed}
            onClick={() => {
              setIsSaving('reject');
              save('reject', report, () => setIsSaving(null));
            }}
          >
            <CancelIcon />
            {t('Reject')}
          </LongButton>
          <LongButton
            loading={isSaving === 'approve'}
            disabled={isProcessed}
            onClick={() => {
              setIsSaving('approve');
              save('approve', report, () => setIsSaving(null));
            }}
          >
            <CheckIcon />
            {t('Approve')}
          </LongButton>
        </>
      )}
      <Button
        styling="secondary"
        onClick={() => {
          showFeedback(report);
        }}
      >
        {t('Reviewers/Feedback')}
      </Button>
    </div>
  );
};

export const ReviewerButtons = styled(_ReviewerButtons)`
  display: flex;
  & > * + * {
    margin-right: 10px;
  }
  svg {
    margin-left: 3px;
  }
`;
