import React from 'react';
import { getReportState } from '../interface';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { ReportFormProvider, ReportFormActions } from '../report-form';
import { FormInput } from 'src/components/ReduxInput';
import { useActions } from 'typeless';
import { FormItem } from 'src/components/FormItem';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { Link } from 'src/components/Link';

export const Report = () => {
  const { t } = useTranslation();
  const { isLoading } = getReportState.useState();
  const { submit } = useActions(ReportFormActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <ReportFormProvider>
        <WrapperForm
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <BackButton href="/reports">{t('Back')}</BackButton>
          </div>
          <div style={{ margin: '50px 0' }}>
            <FormItem label="En" required>
              <FormInput name="name_en" />
            </FormItem>
            <FormItem label="Ar" required>
              <FormInput name="name_ar" />
            </FormItem>
            <button type="submit" style={{ display: 'none' }} />
          </div>
        </WrapperForm>
      </ReportFormProvider>
    );
  };

  return <>{renderDetails()}</>;
};

const BackButton = styled(Link)`
  background: #066a99;
  color: #fff;
  font-weight: 600;
  padding: 5px 15px;
  border-radius: 5px;
`;

const WrapperForm = styled.form`
  margin: 50px 15% 0 15%;
  background: #fff;
  padding: 50px 10%;
  height: 100%;
`;
