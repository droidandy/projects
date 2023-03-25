import React from 'react';
import { getSubmitTaskState, SubmitTaskActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { SubmitTaskFormProvider } from '../submitTask-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { Col, Row } from 'src/components/Grid';
import { SaveButtonsNext } from 'src/components/SaveButtonsNext';
import { RouterActions } from 'typeless-router';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'src/hooks/useLanguage';
import { Card } from 'src/components/Card';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { formatDate } from 'src/common/utils';

export const SubmitTaskView = () => {
  const { isLoaded, isSaving, kpi } = getSubmitTaskState.useState();
  const { push } = useActions(RouterActions);
  const { save } = useActions(SubmitTaskActions);
  const { t } = useTranslation();
  const lang = useLanguage();

  const renderDetails = () => {
    if (isLoaded) {
      return <DetailsSkeleton />;
    }
    return (
      <SubmitTaskFormProvider>
        <BackButton href="/my-tasks" />
        <h2>
          {t('Data entry for {{name}}', {
            name: kpi.name[lang],
          })}
        </h2>
        <RequiredNote />
        <Row>
          <Col>
            <h3>{t('KPI Values')}</h3>
            <Card style={{ minHeight: 130 }}>
              <FormItem label="Value" required>
                <FormInput name="value" />
              </FormItem>
            </Card>
          </Col>
          <Col>
            <h3>{t('KPI Card')}</h3>
            <Card style={{ minHeight: 130 }}>
              <div>
                {t('Measure Freq')}: <strong>{t(kpi.periodFrequency)}</strong>
              </div>
              <div>
                {t('Measure Unit')}:{' '}
                <strong>
                  <DisplayTransString value={kpi.dataType}></DisplayTransString>
                </strong>
              </div>
              <div>
                {t('Measure Desc')}: <strong>{kpi.dataTypeDesc}</strong>
              </div>
              <div>
                {t('Measure Start Date')}:{' '}
                <strong>{formatDate(kpi.startDate)}</strong>
              </div>
              <div>
                {t('Measure End Date')}:{' '}
                <strong>{formatDate(kpi.endDate)}</strong>
              </div>
            </Card>
          </Col>
        </Row>
        <SaveButtonsNext
          topMargin
          isSaving={isSaving}
          cancelAdd={() => {
            push('/my-tasks');
          }}
          save={save}
          hideDraft
        />
      </SubmitTaskFormProvider>
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
