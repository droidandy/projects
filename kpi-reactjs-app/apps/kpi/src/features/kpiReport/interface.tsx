import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { KpiReportSymbol } from './symbol';
import {
  ObjectPerformance,
  KPIReport,
  UnitReport,
  ReportSaveType,
  KpiEvidence,
} from 'src/types-next';

// --- Actions ---
export const [handle, KpiReportActions, getKpiReportState] = createModule(
  KpiReportSymbol
)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (unitReport: UnitReport, kpiReport: KPIReport) => ({
      payload: { kpiReport, unitReport },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: (saveType: ReportSaveType) => ({ payload: { saveType } }),
    updateValue: (value: number, kpiDataSeriesId: number) => ({
      payload: { value, kpiDataSeriesId },
    }),
    performanceUpdated: (id: number, performance: ObjectPerformance[]) => ({
      payload: { id, performance },
    }),
    setSubmitted: null,
    uploadFile: (id: number, file: File) => ({
      payload: { id, file },
    }),
    evidenceCreated: (evidence: KpiEvidence) => ({
      payload: { evidence },
    }),
  })
  .withState<UnitReportState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const UnitReportRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/kpi-report/:id',
  component: <UnitReportRoute />,
};

// --- Types ---
export interface UnitReportState {
  isLoaded: boolean;
  unitReport: UnitReport;
  kpiReport: KPIReport;
  isSaving: boolean;
  isSubmitted: boolean;
  saveType: ReportSaveType | null;
}
