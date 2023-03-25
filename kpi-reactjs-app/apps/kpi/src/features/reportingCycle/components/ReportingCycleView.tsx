import React from 'react';
import { Page } from 'src/components/Page';
import { getReportingCycleState, ReportingCycleActions } from '../interface';
import { useTranslation } from 'react-i18next';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import styled from 'styled-components';
import { Portlet } from 'src/components/Portlet';
import { formatCalendarPeriod } from 'src/common/utils';
import { FormInput } from 'src/components/ReduxInput';
import { RouterActions } from 'typeless-router';
import { ReportingCycleFormProvider } from '../reportingCycle-form';
import { SaveButtonsWrapper } from 'src/components/SaveButtonsWrapper';
import { useActions } from 'typeless';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/FormInput';

const Title = styled.h2`
  margin-top: 0;
`;

const Para = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;

  ${Input} {
    width: 170px;
    margin-left: 20px;
  }
`;

export const ReportingCycleView = () => {
  const {
    isLoaded,
    reportingCycle,
    isSaving,
    isSubmitted,
    saveType,
  } = getReportingCycleState.useState();
  const { t } = useTranslation();
  const { push } = useActions(RouterActions);
  const { save } = useActions(ReportingCycleActions);

  const renderDetails = () => {
    if (!isLoaded) {
      return <DetailsSkeleton />;
    }
    const period = formatCalendarPeriod(reportingCycle);
    const isDone = isSubmitted;

    return (
      <ReportingCycleFormProvider>
        <Title>
          {t('Reporting KPI Cycle')} - {period}
        </Title>
        {t("It's time to submit the reports to the top management!")}
        <Para>
          {t(
            'What to hold submission? Please set the next time reminder you about the reports'
          )}
          <FormInput name="date" type="date" />
        </Para>
        {t('Notes')}:
        <FormInput multiline name="notes" />
        <SaveButtonsWrapper>
          <div>
            <Button
              styling="brand"
              onClick={() => {
                push('/');
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={() => save('hold')}
              loading={isSaving && saveType === 'hold'}
              disabled={isDone}
            >
              {t('Put It On Hold!')}
            </Button>
          </div>
          <div>
            <Button
              onClick={() => save('submit')}
              loading={isSaving && saveType === 'submit'}
              disabled={isDone}
            >
              {t('Submit')}
            </Button>
          </div>
        </SaveButtonsWrapper>
      </ReportingCycleFormProvider>
    );
  };

  return (
    <>
      <Page>
        <Portlet padding>{renderDetails()}</Portlet>
      </Page>
    </>
  );
};
