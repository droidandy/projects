import React from 'react';
import * as R from 'remeda';
import * as Rx from 'src/rx';
import { DataSourceView } from './components/DataSourceView';
import {
  DataSourceActions,
  DataSourceState,
  handle,
  getDataSourceState,
} from './interface';
import { getRouterState, RouterActions } from 'typeless-router';
import { BalancedScorecardItemType } from 'src/types-next';
import { getResource } from 'src/services/API-next';
import { catchErrorAndShowModal, convertToOption } from 'src/common/utils';
import { ResourceActions } from '../resource/interface';
import {
  ResourceFormActions,
  getResourceFormState,
} from '../resource/resource-form';
import { saveResource } from '../resource/save';
import { GlobalActions, getGlobalState } from '../global/interface';
import {
  getReferencesNextState,
  ReferencesNextActions,
} from '../referencesNext/interface';
import { deserializeResource } from '../resource/deserialize';

function _getScorecardItem(id: number) {
  const { scorecards } = getReferencesNextState();
  return R.pipe(
    scorecards.scorecards || [],
    R.flatMap(x => x.scorecardItems),
    R.find(x => x.id === id)
  );
}

// --- Epic ---
handle
  .epic()
  .on(DataSourceActions.$mounted, () => {
    return [
      ReferencesNextActions.reset(),
      ResourceActions.setOptions({ name: 'dataSource', parentRequired: true }),
    ];
  })
  .on(DataSourceActions.$mounted, () => {
    const split = getRouterState()
      .location!.pathname.split('/')
      .reverse();
    const id = split[0];
    const type =
      BalancedScorecardItemType[
        split[1] as keyof typeof BalancedScorecardItemType
      ];

    return Rx.defer(() => {
      if (id === 'new') {
        return Rx.of(null);
      } else {
        return getResource(type, Number(id));
      }
    }).pipe(
      Rx.mergeMap(resource => [
        ResourceFormActions.reset(),
        ResourceFormActions.changeMany({
          ...deserializeResource(resource),
          type: {
            label: '',
            value: type,
          },
        }),
        DataSourceActions.loaded(type, resource),
      ]),
      catchErrorAndShowModal()
    );
  })
  .on(ReferencesNextActions.usersLoaded, () => {
    const { resource } = getDataSourceState();
    return [
      ResourceFormActions.reset(),
      ResourceFormActions.changeMany(deserializeResource(resource)),
    ];
  })
  .onMany(
    [DataSourceActions.loaded, ReferencesNextActions.scorecardsLoaded],
    () => {
      const { scorecards } = getReferencesNextState();
      const { resource } = getDataSourceState();
      const { lang } = getGlobalState();
      if (!resource || !scorecards.isLoaded) {
        return Rx.empty();
      }

      const scorecard = scorecards.scorecards.find(
        x => x.id === resource.balancedScorecardId
      )!;

      const scorecardOption = {
        label: scorecard.name[lang],
        value: scorecard.id,
      };
      if (!resource.parentId) {
        return ResourceFormActions.changeMany({
          parent: undefined,
          scorecard: scorecardOption,
        });
      }
      const item = _getScorecardItem(resource.parentId)!;
      return ResourceFormActions.changeMany({
        parent: convertToOption(item)!,
        scorecard: scorecardOption,
      });
    }
  )
  .on(DataSourceActions.save, ({ draft }, { action$ }) => {
    const { resource, type } = getDataSourceState();
    const { values: formValues } = getResourceFormState();

    const parentId = (formValues.parent ? formValues.parent.value : null) as
      | number
      | string
      | null;
    const scorecardId = formValues.scorecard.value;
    const getRefIds = () => {
      if (
        !parentId ||
        (typeof parentId === 'string' && parentId.startsWith('root'))
      ) {
        return {
          scorecardId,
          parentId: null,
        };
      }

      const id = parentId as number;
      return {
        scorecardId,
        parentId: id,
      };
    };

    return Rx.concatObs(
      Rx.of(ResourceFormActions.submit()),
      action$.pipe(
        Rx.waitForType(ResourceFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(DataSourceActions.setSaving(true)),
            saveResource({
              ...getRefIds(),
              type,
              formValues,
              isAdding: !resource,
              resource,
              draft,
            }).pipe(
              Rx.mergeMap(result => {
                return [
                  RouterActions.push(
                    `/settings/strategy-items/${
                      BalancedScorecardItemType[result.typeId]
                    }`
                  ),
                  GlobalActions.showNotification(
                    'success',
                    resource ? 'Updated successfully' : 'Saved successfully'
                  ),
                ];
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(DataSourceActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(ResourceFormActions.setSubmitFailed))
        )
      )
    );
  });

// --- Reducer ---
const initialState: DataSourceState = {
  type: null!,
  isDeleting: false,
  isLoaded: false,
  isSaving: false,
  resource: null,
};

handle
  .reducer(initialState)
  .on(DataSourceActions.$init, state => {
    Object.assign(state, initialState);
  })
  .on(DataSourceActions.loaded, (state, { type, resource }) => {
    state.resource = resource;
    state.type = type;
    state.isLoaded = false;
  })
  .on(DataSourceActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(DataSourceActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  });

// --- Module ---
export default () => {
  handle();
  return <DataSourceView />;
};
