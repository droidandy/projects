import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { MetricView } from './components/MetricView';
import {
  getMetric,
  createMetric,
  updateMetric,
  deleteMetric,
} from 'src/services/API';
import {
  MetricActions,
  MetricState,
  handle,
  getMetricState,
} from './interface';
import {
  useMetricForm,
  MetricFormActions,
  getMetricFormState,
} from './metric-form';
import { getRouterState, RouterActions } from 'typeless-router';
import { catchErrorAndShowModal } from 'src/common/utils';
import { Metric } from 'src/types';
import { GlobalActions } from '../global/interface';
import { booleanOptions } from 'src/common/options';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(MetricActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    if (id === 'new') {
      return Rx.from([MetricFormActions.reset(), MetricActions.loaded(null)]);
    }
    return getMetric(id).pipe(
      Rx.mergeMap(ret => [
        BreadcrumbsActions.update({
          en: ret.name.en,
          ar: ret.name.ar,
        }),
        MetricFormActions.replace({
          ...R.pick(ret, ['dataType', 'dataSource', 'metricType']),
          enabled: booleanOptions.find(x => x.value === ret.enabled)!,
          name_en: ret.name.en,
          name_ar: ret.name.ar,
        }),
        MetricActions.loaded(ret),
      ]),
      catchErrorAndShowModal()
    );
  })

  .on(MetricFormActions.setSubmitSucceeded, () => {
    const { metric } = getMetricState();
    const { values } = getMetricFormState();
    const mapped: Omit<Metric, 'id'> = {
      ...R.pick(values, ['dataType', 'dataSource', 'metricType']),
      name: {
        ar: values.name_ar,
        en: values.name_en,
      },
      enabled: values.enabled.value,
    };
    return Rx.concatObs(
      Rx.of(MetricActions.setSaving(true)),
      Rx.defer(() => {
        if (metric) {
          return updateMetric(metric.id, {
            id: metric.id,
            ...mapped,
          });
        }
        return createMetric(mapped);
      }).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              metric
                ? 'Metric updated successfully'
                : 'Metric created successfully'
            ),
            RouterActions.push('/settings/metrics'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(MetricActions.setSaving(false))
    );
  })
  .on(MetricActions.remove, () => {
    return Rx.concatObs(
      Rx.of(MetricActions.setDeleting(true)),
      deleteMetric(getMetricState().metric!.id).pipe(
        Rx.mergeMap(() => {
          return [
            GlobalActions.showNotification(
              'success',
              'Metric deleted successfully'
            ),
            RouterActions.push('/settings/metrics'),
          ];
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(MetricActions.setDeleting(false))
    );
  });

// --- Reducer ---
const initialState: MetricState = {
  id: '',
  isLoading: true,
  isSaving: false,
  isDeleting: false,
  metric: null,
};

handle
  .reducer(initialState)
  .replace(MetricActions.$init, () => initialState)
  .on(MetricActions.loaded, (state, { metric }) => {
    state.metric = metric;
    state.isLoading = false;
  })
  .on(MetricActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(MetricActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  useMetricForm();
  handle();
  return <MetricView />;
};
