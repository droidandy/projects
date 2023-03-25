import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { DataEntryView } from './components/DataEntryView';
import {
  DataEntryActions,
  DataEntryState,
  handle,
  DataEntryFilter,
  getDataEntryState,
} from './interface';
import {
  updateDataSeriesPerformance,
  submitUnitReport,
  getMyKpiPerformanceReport,
  getUnitReportValidation,
  submitScorecard,
} from 'shared/API';
import { catchErrorAndShowModal } from 'src/common/utils';
import { GlobalActions } from '../global/interface';
import i18n from 'src/i18n';
import { UnreachableCaseError } from 'shared/helper';
import { TransString, UserKpiReport } from 'src/types';
import { SkipConfirmActions } from './components/SkipConfirmModal';
import { CommentActions } from './components/CommentModal';

// --- Epic ---

function submit(report: UserKpiReport, skip: boolean) {
  return submitUnitReport(report.unitReporting.id, {
    skipEvidences: skip,
    skipItems: skip,
  }).pipe(
    Rx.mergeMap(() => {
      return [
        DataEntryActions.setSubmitted(report),
        GlobalActions.showNotification('success', 'Submitted successfully'),
      ];
    })
  );
}

function processReview(
  report: UserKpiReport,
  type: 'reject' | 'approve',
  comment: string
) {
  return submitScorecard(report.unitReporting.id, {
    status: 'Submitted',
    decision: type === 'approve' ? 'Approved' : 'Rejected',
    comments: [
      {
        text: comment,
        type: 'Comment',
      },
    ],
  }).pipe(
    Rx.mergeMap(() => {
      return [
        DataEntryActions.setSubmitted(report),
        GlobalActions.showNotification(
          'success',
          type === 'approve' ? 'Approved successfully' : 'Rejected successfully'
        ),
      ];
    })
  );
}
function _getCriteria() {
  const { period, filter } = getDataEntryState();
  const criteria: any = {
    periodNumber: period.periodNumber,
    year: period.year,
    periodFrequency: period.frequency,
    calculatePerformance: true,
  };
  if (filter.searchTerm) {
    criteria.searchText = filter.searchTerm;
  }
  if (filter.colors?.length) {
    criteria.colors = filter.colors.map(x => x.value);
  }
  if (filter.kpiTypes?.length) {
    criteria.KPITypes = filter.kpiTypes.map(x => x.value);
  }
  if (filter.aggregationTypes?.length) {
    criteria.aggregationTypes = filter.aggregationTypes.map(x => x.value);
  }
  if (filter.frequencies?.length) {
    criteria.frequencies = filter.frequencies.map(x => x.value);
  }

  return criteria;
}

handle
  .epic()
  .on(DataEntryActions.$mounted, () => DataEntryActions.search())
  .on(DataEntryActions.search, (_, { action$ }) => {
    return Rx.concatObs(
      Rx.of(DataEntryActions.setIsLoading(true)),
      getMyKpiPerformanceReport(_getCriteria()).pipe(
        Rx.map(ret => DataEntryActions.loaded(ret)),
        catchErrorAndShowModal()
      ),
      Rx.of(DataEntryActions.setIsLoading(false))
    ).pipe(Rx.takeUntil(action$.pipe(Rx.ofType(DataEntryActions.search))));
  })
  .on(DataEntryActions.clearFilter, () => DataEntryActions.search())
  .on(
    DataEntryActions.updateActualValue,
    ({ dataSeries, value }, { action$ }) => {
      dataSeries.value = value!;
      const values: any = R.omit(dataSeries, ['kpi', 'comments'] as any);
      return updateDataSeriesPerformance(dataSeries.id, values).pipe(
        Rx.mergeMap(result => {
          const performance = result.find(x => !x.progressAggregation)!;
          const yearly = result.find(x => x.progressAggregation)!;
          return [
            GlobalActions.showNotification('success', i18n.t('Value updated')),
            DataEntryActions.performanceUpdated(
              dataSeries.kpiId!,
              yearly,
              performance
            ),
          ];
        }),
        Rx.takeUntil(
          action$.pipe(
            Rx.ofType(DataEntryActions.updateActualValue),
            Rx.filter(x => x.payload.dataSeries.id === dataSeries.id)
          )
        ),
        catchErrorAndShowModal()
      );
    }
  )
  .on(DataEntryActions.save, ({ saveType, report, callback }, { action$ }) => {
    return Rx.defer(() => {
      switch (saveType) {
        case 'approve':
        case 'reject':
          return Rx.concatObs(
            Rx.of(
              CommentActions.show(
                saveType === 'approve' ? 'Approve KPIs' : 'Reject KPIs',
                saveType === 'approve'
                  ? 'Are you sure you want to approve the KPIs?'
                  : 'Are you sure you want to reject the KPIs?'
              )
            ),
            action$.pipe(
              Rx.waitForType(CommentActions.onResult),
              Rx.mergeMap(({ payload: { result } }) => {
                if (result.type === 'close') {
                  callback();
                  return Rx.empty();
                }

                return processReview(report, saveType, result.text).pipe(
                  Rx.tap(callback)
                );
              })
            )
          );
        case 'submit':
          return getUnitReportValidation(report.unitReporting.id).pipe(
            Rx.mergeMap(result => {
              if (result.isValid) {
                return submit(report, false).pipe(Rx.tap(callback));
              }
              const nameMap = report.data.reduce((ret, item) => {
                item.items.forEach(dataEntry => {
                  ret[dataEntry.kpiDataSeries.id] = item.kpi.name;
                });
                return ret;
              }, {} as { [x: number]: TransString });
              return Rx.concatObs(
                Rx.of(
                  SkipConfirmActions.show(report, result.validation, nameMap)
                ),
                action$.pipe(
                  Rx.waitForType(SkipConfirmActions.onResult),
                  Rx.mergeMap(({ payload: { skipResult } }) => {
                    if (skipResult === 'close') {
                      callback();
                      return Rx.empty();
                    }
                    return submit(report, true).pipe(Rx.tap(callback));
                  })
                )
              );
            })
          );
        default:
          throw new UnreachableCaseError(saveType);
      }
    }).pipe(
      Rx.catchError((e: any) => {
        callback();
        throw e;
      }),
      catchErrorAndShowModal()
    );
  });

// --- Reducer ---
const defaultFilter: DataEntryFilter = {
  searchTerm: '',
  colors: [],
  frequencies: [],
  aggregationTypes: [],
  kpiTypes: [],
};

const initialState: DataEntryState = {
  period: {
    frequency: 'Quarterly',
    periodNumber: 1,
    year: new Date().getFullYear(),
  },
  filter: defaultFilter,
  items: [],
  isLoading: false,
  sortType: 'ASC',
  sortBy: 'name',
  isFilterExpanded: false,
  processedMap: {},
};

handle
  .reducer(initialState)
  .on(DataEntryActions.$mounted, () => initialState)
  .on(DataEntryActions.setIsLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(DataEntryActions.loaded, (state, { items }) => {
    state.items = items;
  })
  .on(DataEntryActions.changePeriod, (state, { period }) => {
    state.period = period;
  })
  .on(DataEntryActions.setFilter, (state, { name, value }) => {
    state.filter[name] = value;
  })
  .on(
    DataEntryActions.performanceUpdated,
    (state, { kpiId, yearly, performance }) => {
      state.items.forEach(group => {
        group.data.forEach(item => {
          if (item.kpi.id === kpiId) {
            const first = item.items[0];
            if (first) {
              first.performance = performance;
              first.yearlyProgress = yearly;
            }
          }
        });
      });
    }
  )
  .on(DataEntryActions.clearFilter, state => {
    state.filter = defaultFilter;
    state.period = {
      frequency: 'Quarterly',
      periodNumber: 1,
      year: new Date().getFullYear(),
    };
  })
  .on(DataEntryActions.setIsFilterExpanded, (state, { isFilterExpanded }) => {
    state.isFilterExpanded = isFilterExpanded;
  })
  .on(DataEntryActions.setSubmitted, (state, { report }) => {
    state.processedMap[report.unitReporting.id] = true;
  });

// --- Module ---
export default () => {
  handle();
  return <DataEntryView />;
};
