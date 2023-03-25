import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { Report } from './components/Report';
import { ReportActions, ReportState, handle } from './interface';
import { useReportForm, ReportFormActions } from './report-form';
import { getRouterState } from 'typeless-router';
import { getReports } from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';

// --- Epic ---
handle.epic().on(ReportActions.$mounted, () => {
  const id: any = R.last(getRouterState().location!.pathname.split('/'));

  return getReports(Number(id))
    .pipe(
      Rx.mergeMap((item: any) => [
        ReportFormActions.replace({
          name_ar: item.name.ar,
          name_en: item.name.en,
        }),
        ReportActions.loaded(item),
      ])
    )
    .pipe(catchErrorAndShowModal());
});

// --- Reducer ---
const initialState: ReportState = {
  isLoading: true,
  isSaving: false,
  report: null,
};

handle
  .reducer(initialState)
  .replace(ReportActions.$init, () => initialState)
  .on(ReportActions.loaded, (state, { report }) => {
    state.report = report;
    state.isLoading = false;
  });

// --- Module ---
export default () => {
  useReportForm();
  handle();
  return <Report />;
};
