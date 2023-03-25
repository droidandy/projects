import React from 'react';
import { UserKpiReport } from 'src/types';
import { useTranslation } from 'react-i18next';
import { CheckIcon } from 'src/icons/CheckIcon';
import { Button } from 'src/components/Button';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { DataEntryActions } from '../interface';
import { ClockIcon } from 'src/icons/ClockIcon';
import { Status } from 'src/components/Status';
import { FeedbackActions } from './FeedbackSidePanel';
import { HourGlass } from 'src/icons/HourGlass';
import { InfoIcon } from 'src/icons/InfoIcon';

export interface SubmissionButtonsProps {
  report: UserKpiReport;
  className?: string;
  isProcessed: boolean;
}

const _SubmissionButtons = (props: SubmissionButtonsProps) => {
  const { className, report, isProcessed } = props;
  const { t } = useTranslation();
  const { save } = useActions(DataEntryActions);
  const { show: showFeedback } = useActions(FeedbackActions);
  const [isSaving, setIsSaving] = React.useState(false);
  const { phase } = report.unitReporting.currentPhase;

  const renderStatus = () => {
    if (phase === 'Submission') {
      return (
        <Status status="info" large>
          <HourGlass />
          {t('Not Yet Submitted')}
        </Status>
      );
    }
    if (phase === 'PendingSubmissionFixes') {
      return (
        <Status status="error" large>
          <ClockIcon />
          {t('Revision Required')}
        </Status>
      );
    }
    return (
      <Status status="warning" large>
        <InfoIcon />
        {t('Pending Approval')}
      </Status>
    );
  };

  return (
    <div className={className}>
      {(phase === 'Submission' || phase === 'PendingSubmissionFixes') && (
        <Button
          loading={isSaving}
          disabled={isProcessed}
          onClick={() => {
            setIsSaving(true);
            save('submit', report, () => setIsSaving(false));
          }}
        >
          <CheckIcon />
          {t(
            phase === 'PendingSubmissionFixes'
              ? 'Resubmit for Approval'
              : 'Submit for Approval'
          )}
        </Button>
      )}
      {renderStatus()}
      {phase !== 'Submission' && (
        <Button
          styling="secondary"
          onClick={() => {
            showFeedback(report);
          }}
        >
          {t('Reviewers/Feedback')}
        </Button>
      )}
    </div>
  );
};

export const SubmissionButtons = styled(_SubmissionButtons)`
  display: flex;
  & > * + * {
    margin-right: 10px;
  }
  svg {
    margin-left: 3px;
  }
`;
