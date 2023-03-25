import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { ScorecardsView } from './components/ScorecardsView';
import {
  ScorecardsActions,
  ScorecardsState,
  handle,
  getScorecardsState,
} from './interface';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getGlobalState, GlobalActions } from '../global/interface';
import {
  getScorecard,
  getObjectPerformance,
  ObjectPerformanceValues,
  getObjectPerformanceMeasures,
  getKPIPerformance,
  getResource,
} from 'src/services/API-next';
import { CreateScorecardActions } from './components/CreateScorecardModal';
import { RouterActions, getRouterState } from 'typeless-router';
import {
  BalancedScorecardItemType,
  FrequencyPeriod,
  KpiValueType,
  ObjectPerformance,
} from 'src/types-next';
import { getStrategicDocument } from '../global/selectors';
import { getReferencesNextState } from '../referencesNext/interface';
import { loadUsersHandler } from '../referencesNext/module';
import { RelatedItemsActions } from '../relatedItems/interface';
import { SelectOption } from 'src/types';
import { valueTypeOptions } from 'src/common/options';
import { deserializeResource } from '../resource/deserialize';
import { saveResource } from '../resource/save';
import {
  ResourceFormActions,
  getResourceFormState,
} from '../resource/resource-form';
import { ResourceActions } from '../resource/interface';
import { SidebarActions } from './components/ScorecardSidebar';
import { getResourceKey } from 'src/common/sidebar';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

function getDefaultPeriodYear() {
  const doc = getStrategicDocument();
  return Math.min(new Date().getFullYear(), doc!.endYear);
}

function getPerformance(
  period: FrequencyPeriod,
  resourceId: number | null,
  scorecardId: number | null,
  type: BalancedScorecardItemType | null
) {
  const values: ObjectPerformanceValues = {
    periodAggregation: period.frequency,
    year: period.year,
    periodNumber: period.periodNumber,
  };
  if (resourceId) {
    values.objectId = resourceId;
  } else if (scorecardId) {
    values.balancedScorecardId = scorecardId;
  }

  const sortFn = (a: ObjectPerformanceValues, b: ObjectPerformanceValues) => {
    if (a.year === b.year) {
      return a.periodNumber! - b.periodNumber!;
    }
    return a.year! - b.year!;
  };
  return Rx.forkJoin([
    // widget
    getObjectPerformance({
      ...values,
      historyCount: 1,
    }),
    // history
    getObjectPerformance({
      ...values,
      historyCount: 12,
    }),
    // measures
    getObjectPerformanceMeasures({
      objectId: values.objectId,
      balancedScorecardId: values.balancedScorecardId,
      year: period.year,
      periodNumber: values.periodNumber,
      periodAggregation: values.periodAggregation,
    }),
    // status
    Rx.defer(() => {
      if (type !== BalancedScorecardItemType.KPI) {
        return Rx.of([]);
      }
      return getKPIPerformance({
        kpiId: resourceId!,
        year: values.year,
        periodNumber: values.periodNumber,
        periodAggregation: values.periodAggregation,
        isAggregated: false,
      });
    }),
  ]).pipe(
    Rx.map(([widget, history, measures, status]) => ({
      widget: widget.sort(sortFn),
      history: history.sort(sortFn),
      measures,
      status,
    }))
  );
}

function _loadScorecardData() {
  return Rx.concatObs(
    Rx.of(ScorecardsActions.setLoading(true)),
    Rx.of(ScorecardsActions.setResourceId(null)),
    Rx.of(ScorecardsActions.resourceLoaded(null)),
    Rx.defer(() => {
      const { scorecard, period } = getScorecardsState();
      if (!scorecard) {
        return Rx.empty();
      }
      return getPerformance(period, null, scorecard.id, null).pipe(
        Rx.map(performance => ScorecardsActions.performanceLoaded(performance)),
        catchErrorAndShowModal()
      );
    }),
    Rx.of(ScorecardsActions.setLoading(false))
  );
}

function _loadItemData() {
  const location = getRouterState().location!;
  const reg = /scorecards\/(\w+)\/(\d+)/;
  const match = reg.exec(location.pathname);
  if (!match) {
    return Rx.empty();
  }
  if (getScorecardsState().wasCreated) {
    return Rx.from([
      ScorecardsActions.performanceLoaded(initialState.performance),
      ScorecardsActions.setWasCreated(false),
    ]);
  }
  const type =
    BalancedScorecardItemType[
      match[1] as keyof typeof BalancedScorecardItemType
    ];
  if (!type) {
    return Rx.empty();
  }
  const id = Number(match[2]);
  const period = getScorecardsState().period || {
    frequency: 'Annually',
    year: getDefaultPeriodYear(),
    periodNumber: 1,
  };
  return Rx.concatObs(
    Rx.of(ScorecardsActions.setLoading(true)),
    Rx.of(ScorecardsActions.setResourceId(id)),
    Rx.defer(() => {
      if (getReferencesNextState().users.isLoaded) {
        return Rx.empty();
      }
      return loadUsersHandler();
    }),
    Rx.forkJoin(
      Rx.defer(() => getResource(type, id)),
      getPerformance(period, id, null, type)
    ).pipe(
      Rx.mergeMap(([resource, performance]) => [
        BreadcrumbsActions.update({
          en: resource.name.en,
          ar: resource.name.ar,
        }),
        ScorecardsActions.resourceLoaded(resource),
        ScorecardsActions.performanceLoaded(performance),
      ]),
      catchErrorAndShowModal()
    ),
    Rx.of(ScorecardsActions.setLoading(false))
  );
}

// --- Epic ---
handle
  .epic()
  .on(ScorecardsActions.$mounted, () => {
    return ResourceActions.setOptions({
      name: 'scorecard',
      parentRequired: false,
    });
  })
  .onMany(
    [
      ScorecardsActions.$mounted,
      GlobalActions.changeStrategicPlan,
      GlobalActions.changeUnit,
    ],
    () => {
      return ScorecardsActions.load();
    }
  )
  .on(ScorecardsActions.load, () => {
    const { currentPlanId, currentUnitId } = getGlobalState();
    const period: FrequencyPeriod = {
      frequency: 'Annually',
      year: getDefaultPeriodYear(),
      periodNumber: 1,
    };
    return getScorecard(currentPlanId, currentUnitId).pipe(
      Rx.mergeMap(scorecard => {
        return Rx.defer(() => {
          if (!scorecard) {
            return Rx.of(null!);
          } else {
            return getPerformance(period, null, scorecard.id, null);
          }
        }).pipe(
          Rx.map(performance =>
            ScorecardsActions.scorecardLoaded(scorecard, period, performance)
          )
        );
      }),
      catchErrorAndShowModal()
    );
  })
  .onMany(
    [RouterActions.locationChange, ScorecardsActions.load],
    (_, { action$ }) => {
      if (location.pathname === '/scorecards') {
        return _loadScorecardData();
      } else {
        return Rx.defer(() => {
          const { scorecard } = getScorecardsState();
          if (scorecard) {
            return Rx.of(null);
          } else {
            return action$.pipe(
              Rx.waitForType(ScorecardsActions.scorecardLoaded)
            );
          }
        }).pipe(Rx.mergeMap(() => _loadItemData()));
      }
    }
  )
  .onMany(
    [
      ScorecardsActions.resourceLoaded,
      ScorecardsActions.cancelAdd,
      ScorecardsActions.cancelEdit,
    ],
    () => {
      const { resource } = getScorecardsState();
      return [
        ResourceFormActions.reset(),
        ResourceFormActions.changeMany(deserializeResource(resource)),
      ];
    }
  )
  .on(ScorecardsActions.addNewItem, () => {
    return ResourceFormActions.reset();
  })
  .on(ScorecardsActions.save, ({ draft }, { action$ }) => {
    const { resourceId, resource, isAdding, scorecard } = getScorecardsState();
    const { values: formValues } = getResourceFormState();
    return Rx.concatObs(
      Rx.of(ResourceFormActions.submit()),
      action$.pipe(
        Rx.waitForType(ResourceFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(ScorecardsActions.setSaving(true)),
            saveResource({
              scorecardId: scorecard!.id,
              formValues,
              isAdding,
              resource,
              draft,
              parentId: isAdding ? resourceId : resource!.parentId,
            }).pipe(
              Rx.mergeMap(result => {
                if (isAdding) {
                  return R.compact([
                    ScorecardsActions.resourceCreated(result),
                    resource &&
                      SidebarActions.toggleExpanded(getResourceKey(resource)),
                    ScorecardsActions.setSelectedTab('overview'),
                    RouterActions.push(
                      `/scorecards/${
                        BalancedScorecardItemType[result.typeId]
                      }/${result.id}`
                    ),
                    GlobalActions.showNotification(
                      'success',
                      'Saved successfully'
                    ),
                  ]);
                } else {
                  return [
                    ScorecardsActions.resourceUpdated(result),
                    GlobalActions.showNotification(
                      'success',
                      'Updated successfully'
                    ),
                  ];
                }
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(ScorecardsActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(ResourceFormActions.setSubmitFailed))
        )
      )
    );
  })
  .on(ResourceFormActions.setSubmitFailed, () => {
    const errorElement = document.querySelector('[data-error="true"]');
    if (errorElement) {
      errorElement.scrollIntoView();
    }
    return Rx.empty();
  })
  .on(ScorecardsActions.updatePeriod, () => {
    const { resourceId, scorecard, resource } = getScorecardsState();
    return Rx.concatObs(
      getPerformance(
        getScorecardsState().period,
        resourceId,
        scorecard!.id,
        resource ? resource.typeId : null
      ).pipe(
        Rx.map(ret => ScorecardsActions.performanceLoaded(ret)),
        catchErrorAndShowModal()
      )
    );
  })
  .on(ScorecardsActions.resourceLoaded, ({ resource }) => {
    if (!resource) {
      return Rx.empty();
    }
    const type = BalancedScorecardItemType[
      resource.typeId
    ] as keyof typeof BalancedScorecardItemType;

    return RelatedItemsActions.show(
      type === 'Theme' ? 'Mission' : type,
      resource.id
    );
  })
  .on(ResourceFormActions.change, ({ field, value }) => {
    if (field === 'actualValue') {
      if ((value as SelectOption<KpiValueType>).value === 'Index') {
        return ResourceFormActions.change(
          'goal',
          valueTypeOptions.find(x => (x.value as KpiValueType) === 'Manual')
        );
      }
    }
    return Rx.empty();
  });

// --- Reducer ---
const initialState: ScorecardsState = {
  isLoaded: false,
  scorecard: null,
  scorecardItems: [],
  resource: null,
  resourceId: null,
  isLoading: false,
  isSaving: false,
  selectedTab: 'overview',
  isAdding: false,
  isEditing: false,
  period: null!,
  wasCreated: false,
  performance: {
    history: [],
    measures: [],
    status: [],
    widget: [],
  },
};

function getAnnuallyValues(measures: ObjectPerformance[]) {
  const maxValues: { [x: number]: number } = {};
  measures.forEach(item => {
    maxValues[item.year] = maxValues[item.year]
      ? Math.max(item.periodNumber, maxValues[item.year])
      : item.periodNumber;
  });

  return measures.filter(x => maxValues[x.year] === x.periodNumber);
}

handle
  .reducer(initialState)
  .replace(ScorecardsActions.$init, () => initialState)
  .replace(ScorecardsActions.load, () => initialState)
  .on(
    ScorecardsActions.scorecardLoaded,
    (state, { scorecard, period, performance }) => {
      state.scorecard = scorecard;
      state.period = period;
      state.performance = performance || initialState.performance;
      if (scorecard) {
        state.scorecardItems = scorecard.scorecardItems;
      }
      state.isLoaded = true;
    }
  )
  .on(CreateScorecardActions.scorecardCreated, (state, { scorecard }) => {
    state.scorecard = scorecard;
    state.scorecardItems = scorecard.scorecardItems;
  })
  .on(ScorecardsActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(ScorecardsActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ScorecardsActions.resourceLoaded, (state, { resource }) => {
    state.resource = resource;
    state.selectedTab = 'overview';
  })
  .on(ScorecardsActions.performanceLoaded, (state, { performance }) => {
    state.performance = performance;
  })
  .on(ScorecardsActions.setResourceId, (state, { resourceId }) => {
    state.resourceId = resourceId;
    state.isAdding = false;
    state.isEditing = false;
  })
  .on(ScorecardsActions.setSelectedTab, (state, { selectedTab }) => {
    state.selectedTab = selectedTab;
  })
  .on(ScorecardsActions.addNewItem, state => {
    state.isAdding = true;
    state.isEditing = true;
    state.selectedTab = 'info';
  })
  .on(ScorecardsActions.cancelAdd, state => {
    state.isAdding = false;
    state.isEditing = false;
  })
  .on(ScorecardsActions.updatePeriod, (state, { period }) => {
    state.period = period;
  })
  .on(ScorecardsActions.resourceCreated, (state, { resource }) => {
    state.resourceId = resource.id;
    state.resource = resource;
    state.isAdding = false;
    state.isEditing = false;
    state.scorecardItems.unshift(resource);
    state.wasCreated = true;
  })
  .on(ScorecardsActions.setWasCreated, (state, { wasCreated }) => {
    state.wasCreated = wasCreated;
  })
  .on(ScorecardsActions.resourceUpdated, (state, { resource }) => {
    state.resource = resource;
    state.isEditing = false;
  })
  .on(ScorecardsActions.edit, state => {
    state.isEditing = true;
  })
  .on(ScorecardsActions.cancelEdit, state => {
    state.isEditing = false;
  })
  .onMany(
    [ScorecardsActions.scorecardLoaded, ScorecardsActions.performanceLoaded],
    state => {
      if (state.period.frequency === 'Annually') {
        state.performance.history = getAnnuallyValues(
          state.performance.history
        );
        state.performance.widget = getAnnuallyValues(state.performance.widget);
      }
    }
  );

// --- Module ---
export default () => {
  handle();
  return <ScorecardsView />;
};
