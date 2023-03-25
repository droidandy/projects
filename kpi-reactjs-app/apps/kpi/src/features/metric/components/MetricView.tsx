import React from 'react';
import { getMetricState, MetricActions } from '../interface';
import { Page } from 'src/components/Page';
import { Portlet } from 'src/components/Portlet';
import { DetailsSkeleton } from 'src/components/DetailsSkeleton';
import { MetricFormProvider, MetricFormActions } from '../metric-form';
import { FormItem } from 'src/components/FormItem';
import { FormInput } from 'src/components/ReduxInput';
import { RequiredNote } from 'src/components/RequiredNote';
import { BackButton } from 'src/components/BackButton';
import { useActions } from 'typeless';
import { SaveButtons } from 'src/components/SaveButtons';
import { FormSelect } from 'src/components/FormSelect';
import { booleanOptions } from 'src/common/options';

export const MetricView = () => {
  const { isLoading, metric, isSaving, isDeleting } = getMetricState.useState();
  const { submit } = useActions(MetricFormActions);
  const { remove } = useActions(MetricActions);

  const renderDetails = () => {
    if (isLoading) {
      return <DetailsSkeleton />;
    }
    return (
      <MetricFormProvider>
        <form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <BackButton href="/settings/metrics" />
          <RequiredNote />
          <FormItem label="Name - En" required>
            <FormInput name="name_en" />
          </FormItem>
          <FormItem label="Name - Ar" required>
            <FormInput name="name_ar" />
          </FormItem>
          <FormItem label="Metric Type" required>
            <FormInput name="metricType" />
          </FormItem>
          <FormItem label="Data Type" required>
            <FormInput name="dataType" />
          </FormItem>
          <FormItem label="Data Source" required>
            <FormInput name="dataSource" />
          </FormItem>
          <FormItem label="Enabled" required>
            <FormSelect name="enabled" options={booleanOptions} />
          </FormItem>
          <button type="submit" style={{ display: 'none' }} />
        </form>
        {
          <SaveButtons
            showDelete={!!metric}
            onCancel="/settings/metrics"
            onSave={submit}
            isSaving={isSaving}
            isDeleting={isDeleting}
            onDelete={remove}
            deletePermission="metric:delete"
            savePermission={metric ? 'metric:update' : 'metric:add'}
          />
        }
      </MetricFormProvider>
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
