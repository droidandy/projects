import React from 'react';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { RouterActions } from 'typeless-router';
import { getChallengeTaskState, ChallengeTaskActions } from '../interface';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { ActionDetailsModal } from 'src/features/actionDetails/components/ActionDetailsView';
import { ActionDetailsActions } from 'src/features/actionDetails/interface';
import styled from 'styled-components';
import {
  ChallengeTaskFormProvider,
  ChallengeTaskFormActions,
} from '../challengeTask-form';
import { CardTitle } from 'src/components/CardTitle';
import { Card } from 'src/components/Card';
import { ActionDetails } from './ActionDetails';
import { OverallComment } from './OverralComment';

const AddWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: 15px;
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 15px;
`;

export const ChallengeTaskView = () => {
  const {
    isLoaded,
    isSaving,
    challenge,
    actions,
    taskType,
  } = getChallengeTaskState.useState();
  const { push } = useActions(RouterActions);
  const { save } = useActions(ChallengeTaskActions);
  const { submit } = useActions(ChallengeTaskFormActions);
  const { t } = useTranslation();
  const { show: showAddAction } = useActions(ActionDetailsActions);

  const renderDetails = () => {
    if (isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <ChallengeTaskFormProvider>
        <ActionDetailsModal />
        <BackButton href="/my-tasks" />
        <h2>
          <DisplayTransString value={challenge.name} />
        </h2>
        <AddWrapper>
          <Button onClick={() => showAddAction(null)}>{t('Add Action')}</Button>
        </AddWrapper>
        <Card style={{ padding: 0 }}>
          <Top>
            <CardTitle>{t('Actions')}</CardTitle>
            {taskType === 'ChallengeResponseReview' && (
              <CardTitle>{t('Response')}</CardTitle>
            )}
          </Top>
          {actions.map((action, i) => (
            <ActionDetails key={action.id} action={action} index={i} />
          ))}
        </Card>
        {taskType === 'ChallengeResponseReview' && <OverallComment />}

        <SaveButtonsNext
          topMargin
          isSaving={isSaving}
          cancelAdd={() => {
            push('/my-tasks');
          }}
          save={() => {
            if (taskType === 'ChallengeResponseReview') {
              submit();
            } else {
              save();
            }
          }}
          hideDraft
          saveText="Submit"
        />
      </ChallengeTaskFormProvider>
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
