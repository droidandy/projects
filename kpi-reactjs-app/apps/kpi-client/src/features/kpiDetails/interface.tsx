import { createModule } from 'typeless';
import { KpiDetailsSymbol } from './symbol';
import {
  Kpi,
  OrganizationUnit,
  FrequencyPeriod,
  KpiDataSeriesPerformance,
} from 'shared/types';

// --- Actions ---
export const [handle, KpiDetailsActions, getKpiDetailsState] = createModule(
  KpiDetailsSymbol
)
  .withActions({
    show: (kpi: Kpi, tab: KpiTab) => ({
      payload: { kpi, tab },
    }),
    loaded: (
      kpi: Kpi,
      unit: OrganizationUnit,
      performance: KpiDataSeriesPerformance[]
    ) => ({ payload: { kpi, unit, performance } }),
    close: null,
    setTab: (tab: KpiTab) => ({ payload: { tab } }),
    changePerformancePeriod: (period: FrequencyPeriod) => ({
      payload: { period },
    }),
    performanceUpdated: (performance: KpiDataSeriesPerformance[]) => ({
      payload: { performance },
    }),
    unitsLoaded: (units: OrganizationUnit[]) => ({ payload: { units } }),
    setSaving: (isSaving: boolean) => ({ payload: { isSaving } }),
    edit: null,
    cancelEdit: null,
    save: null,
    saved: null,
  })
  .withState<KpiDetailsState>();

export type KpiTab = 'history' | 'performance' | 'details' | 'discussion';

// --- Types ---
export interface KpiDetailsState {
  kpi: Kpi;
  tab: KpiTab;
  unit: OrganizationUnit;
  units: OrganizationUnit[] | null;
  performancePeriod: FrequencyPeriod;
  performance: KpiDataSeriesPerformance[];
  isVisible: boolean;
  isEditing: boolean;
  isSaving: boolean;
  isLoading: boolean;
}
