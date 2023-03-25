import {
  KpiDetailsActions,
  KpiDetailsState,
  handle,
  getKpiDetailsState,
} from './interface';
import * as Rx from 'src/rx';
import {
  getKpi,
  getOrganizationUnitById,
  getKPIPerformance,
  getAllOrganizationUnit,
} from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { defaultPeriod } from '../dashboard/utils';
import { CommentsActions } from '../comments/interface';
import { getGlobalState } from '../global/interface';
import { KpiFormActions } from './kpi-form';
import { deserializeResource } from './deserialize';
import { saveKpi } from './save';

// --- Epic ---
handle
  .epic()
  .on(KpiDetailsActions.show, ({ kpi }) => {
    return Rx.forkJoin([
      getKpi(kpi.id),
      getOrganizationUnitById(kpi.responsibleUnitId),
      getKPIPerformance({
        kpiId: kpi.id!,
        year: defaultPeriod.year,
        periodNumber: defaultPeriod.periodNumber,
        periodAggregation: defaultPeriod.frequency,
        isAggregated: false,
      }),
    ]).pipe(
      Rx.mergeMap(([latestKpi, unit, performance]) => [
        KpiDetailsActions.loaded(latestKpi, unit, performance),
        KpiFormActions.reset(),
        KpiFormActions.changeMany(deserializeResource(latestKpi, unit)),
      ]),
      catchErrorAndShowModal()
    );
  })
  .on(KpiDetailsActions.show, ({ kpi }) => {
    return CommentsActions.show(kpi, {
      kpiId: kpi.id,
    });
  })
  .on(KpiDetailsActions.changePerformancePeriod, ({ period }) => {
    return getKPIPerformance({
      kpiId: getKpiDetailsState().kpi.id,
      year: period.year,
      periodNumber: period.periodNumber,
      periodAggregation: period.frequency,
      isAggregated: false,
    }).pipe(
      Rx.map(performance => KpiDetailsActions.performanceUpdated(performance)),
      catchErrorAndShowModal()
    );
  })
  .on(KpiDetailsActions.edit, () => {
    return getAllOrganizationUnit(getGlobalState().user!.orgId).pipe(
      Rx.map(ret => KpiDetailsActions.unitsLoaded(ret))
    );
  })
  .on(KpiDetailsActions.cancelEdit, () => {
    const { kpi, unit } = getKpiDetailsState();
    return [
      KpiFormActions.reset(),
      KpiFormActions.changeMany(deserializeResource(kpi, unit)),
    ];
  })
  .on(KpiDetailsActions.save, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(KpiFormActions.submit()),
      action$.pipe(
        Rx.waitForType(KpiFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(KpiDetailsActions.setSaving(true)),
            saveKpi().pipe(
              Rx.map(() => KpiDetailsActions.saved()),
              catchErrorAndShowModal()
            ),
            Rx.of(KpiDetailsActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(KpiFormActions.setSubmitFailed))
        )
      )
    );
  });

// --- Reducer ---
const initialState: KpiDetailsState = {
  isVisible: false,
  isLoading: true,
  kpi: null!,
  unit: null!,
  tab: 'details',
  performancePeriod: defaultPeriod,
  performance: [],
  units: null,
  isEditing: false,
  isSaving: false,
};

handle
  .reducer(initialState)
  .on(KpiDetailsActions.show, (state, { kpi, tab }) => {
    Object.assign(state, initialState);
    state.kpi = kpi;
    state.isVisible = true;
    state.tab = tab;
  })
  .on(KpiDetailsActions.loaded, (state, { kpi, unit, performance }) => {
    state.kpi = kpi;
    state.unit = unit;
    state.performance = performance;
    state.isLoading = false;
  })
  .on(KpiDetailsActions.close, state => {
    state.isVisible = false;
  })
  .on(KpiDetailsActions.setTab, (state, { tab }) => {
    state.tab = tab;
  })
  .on(KpiDetailsActions.changePerformancePeriod, (state, { period }) => {
    state.performancePeriod = period;
  })
  .on(KpiDetailsActions.performanceUpdated, (state, { performance }) => {
    state.performance = performance;
  })
  .on(KpiDetailsActions.unitsLoaded, (state, { units }) => {
    state.units = units;
  })
  .on(KpiDetailsActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(KpiDetailsActions.edit, state => {
    state.isEditing = true;
  })
  .on(KpiDetailsActions.cancelEdit, state => {
    state.isEditing = false;
  })
  .on(KpiDetailsActions.saved, state => {
    state.isEditing = false;
  });

export const useKpiDetails = () => handle();
