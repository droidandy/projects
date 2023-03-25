import React from 'react';
import { getTaskState, TaskActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { TaskFormProvider } from '../task-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { Col, Row } from 'src/components/Grid';
import { RouterActions } from 'typeless-router';
import { Button } from 'src/components/Button';
import { useTranslation } from 'react-i18next';
import { SaveButtonsWrapper } from 'src/components/SaveButtonsWrapper';

export const TaskView = () => {
  const { isLoaded, isSaving, saveType } = getTaskState.useState();
  const { push } = useActions(RouterActions);
  const { save } = useActions(TaskActions);
  const { t } = useTranslation();

  const renderDetails = () => {
    if (isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <TaskFormProvider>
        <BackButton href="/my-tasks" />
        <RequiredNote />
        <Row>
          <Col>
            <FormItem label="Start Date" required>
              <FormInput name="startDate" type="date" />
            </FormItem>
          </Col>
          <Col>
            <FormItem label="End Date" required>
              <FormInput name="endDate" type="date" />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col>
            <FormItem label="Notes">
              <FormInput multiline name="comment" />
            </FormItem>
          </Col>
        </Row>
        <SaveButtonsWrapper>
          <div>
            <Button
              styling="brand"
              onClick={() => {
                push('/my-tasks');
              }}
            >
              {t('Cancel')}
            </Button>
            <Button
              onClick={() => {
                save('cancel');
              }}
              loading={isSaving && saveType === 'cancel'}
            >
              {t('Cancel report for this period')}
            </Button>
          </div>
          <div>
            <Button
              onClick={() => save('save')}
              loading={isSaving && saveType === 'save'}
            >
              {t('Save')}
            </Button>
          </div>
        </SaveButtonsWrapper>
      </TaskFormProvider>
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
