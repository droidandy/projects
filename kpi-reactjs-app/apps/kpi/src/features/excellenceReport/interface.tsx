import React from 'react';
import { DashboardSuspense } from 'src/components/DashboardSuspense';
import { RouteConfig } from 'src/types';
import { createModule } from 'typeless';
import { ExcellenceReportSymbol } from './symbol';
import {
  UnitReport,
  ExcellenceReport,
  ExcellenceRequirementStatus,
  ReportSaveType,
  ExcellenceEvidence,
} from 'src/types-next';

// --- Actions ---
export const [
  handle,
  ExcellenceReportActions,
  getExcellenceReportState,
] = createModule(ExcellenceReportSymbol)
  .withActions({
    $mounted: null,
    $init: null,
    loaded: (unitReport: UnitReport, excellenceReport: ExcellenceReport) => ({
      payload: { excellenceReport, unitReport },
    }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    save: (saveType: ReportSaveType) => ({ payload: { saveType } }),
    setSubmitted: null,
    updateExcellenceItem: (id: number, values: UpdateExcellenceItemValues) => ({
      payload: { id, values },
    }),
    uploadFile: (id: number, file: File) => ({
      payload: { id, file },
    }),
    evidenceCreated: (evidence: ExcellenceEvidence) => ({
      payload: { evidence },
    }),
  })
  .withState<ExcellenceReportState>();

// --- Routing ---
const ModuleLoader = React.lazy(() => import('./module'));

const ExcellenceReportRoute = () => (
  <DashboardSuspense>
    <ModuleLoader />
  </DashboardSuspense>
);

export const routeConfig: RouteConfig = {
  type: 'route',
  auth: true,
  path: '/excellence-report/:id',
  component: <ExcellenceReportRoute />,
};

// --- Types ---
export interface ExcellenceReportState {
  isLoaded: boolean;
  unitReport: UnitReport;
  excellenceReport: ExcellenceReport;
  isSaving: boolean;
  isSubmitted: boolean;
  saveType: ReportSaveType | null;
}

export interface UpdateExcellenceItemValues {
  requirementStatus?: ExcellenceRequirementStatus;
  isCompleted?: boolean;
  isEnabled?: boolean;
}
