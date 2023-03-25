import React from 'react';
import * as R from 'remeda';
import { ReportPage } from './components/ReportPage';
import { ReportPageActions, ReportPageState, handle } from './interface';
import { ReportPageFormActions, useReportPageForm } from './reportPage-form';
import { getRouterState } from 'typeless-router';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';
import { json } from '../reportsPage/components/ReportsPage';

// --- Epic ---
handle.epic().on(ReportPageActions.$mounted, () => {
  const id: any = R.last(getRouterState().location!.pathname.split('/'));
  const { items } = json;
  return [
    BreadcrumbsActions.update({
      en: items[id - 1].name.en,
      ar: items[id - 1].name.ar,
    }),
    ReportPageFormActions.replace({
      name_ar: items[id - 1].name.ar,
      name_en: items[id - 1].name.en,
    }),
    ReportPageActions.loaded(items[id - 1]),
  ];
});

// --- Reducer ---
const initialState: ReportPageState = {
  isLoading: true,
  isSaving: false,
  reportPage: null,
};

handle
  .reducer(initialState)
  .replace(ReportPageActions.$init, () => initialState)
  .on(ReportPageActions.loaded, (state, { reportPage }) => {
    state.reportPage = reportPage;
    state.isLoading = false;
  });

// --- Module ---
export default () => {
  useReportPageForm();
  handle();
  return <ReportPage />;
};
