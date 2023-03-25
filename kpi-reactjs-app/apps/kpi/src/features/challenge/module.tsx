import React from 'react';
import * as Rx from 'src/rx';
import * as R from 'remeda';
import { ChallengeView } from './components/ChallengeView';
import { ChallengeActions, ChallengeState, handle } from './interface';
import {
  useChallengeForm,
  ChallengeFormActions,
  getActionProp,
  getChallengeFormState,
} from './challenge-form';
import { getRouterState, RouterActions } from 'typeless-router';
import {
  catchErrorAndShowModal,
  convertToOption,
  dateToInputFormat,
  focusFormErrorEpic,
} from 'src/common/utils';
import { SelectOption } from 'src/types';
import { GlobalActions, getGlobalState } from '../global/interface';
import {
  getAllOrganizationUnit,
  getAllResources,
  getChallenge,
} from 'src/services/API-next';
import { BalancedScorecardItemType } from 'src/types-next';
import { saveChallenge } from './save';
import { DisplayTransString } from 'src/components/DisplayTransString';
import { ActionDetailsActions } from '../actionDetails/interface';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .on(ChallengeActions.$mounted, () => {
    const id = R.last(getRouterState().location!.pathname.split('/'));
    const { currentPlanId, lookups } = getGlobalState();

    return getAllOrganizationUnit(currentPlanId).pipe(
      Rx.mergeMap(units => {
        if (id === 'new') {
          return Rx.from([
            ChallengeFormActions.reset(),
            ChallengeActions.loaded(null, units, null),
          ]);
        } else {
          return getChallenge(Number(id)).pipe(
            Rx.mergeMap(challenge =>
              getAllResources(
                BalancedScorecardItemType[challenge.itemType]
              ).pipe(
                Rx.mergeMap(resources => {
                  const type = lookups.find(
                    x =>
                      x.category === 'BalancedScorecardItemType' &&
                      x.id === BalancedScorecardItemType[challenge.itemType]
                  );
                  return [
                    BreadcrumbsActions.update({
                      en: challenge.name.en,
                      ar: challenge.name.ar,
                    }),
                    ChallengeFormActions.reset(),
                    ChallengeFormActions.changeMany({
                      name_ar: challenge.name.ar,
                      name_en: challenge.name.en,
                      description_ar: challenge.description.ar,
                      description_en: challenge.description.en,
                      affectedUnit: convertToOption(challenge.affectedUnit),
                      challengedUnit: convertToOption(challenge.challengedUnit),
                      item: convertToOption(challenge.balancedScorecardItem),
                      itemType: {
                        label: <DisplayTransString value={type!} />,
                        value: type!.id,
                      },
                      period_year: challenge.affectedPeriodYear,
                      period_frequency: challenge.affectedPeriodFrequency,
                      period_number: challenge.affectedPeriodNumer,
                      actions: challenge.actions.map(x => x.id),
                      ...challenge.actions.reduce((ret, action) => {
                        ret[getActionProp(action.id, 'name')] = action.name;
                        ret[getActionProp(action.id, 'status')] = action.status;
                        ret[
                          getActionProp(action.id, 'startDate')
                        ] = dateToInputFormat(action.startDate);
                        ret[
                          getActionProp(action.id, 'endDate')
                        ] = dateToInputFormat(action.endDate);
                        return ret;
                      }, {} as any),
                    }),
                    ChallengeActions.loaded(challenge, units, resources),
                  ];
                })
              )
            )
          );
        }
      }),
      catchErrorAndShowModal()
    );
  })
  .on(ChallengeFormActions.change, ({ field, value }) => {
    switch (field) {
      case 'itemType': {
        return Rx.mergeObs(
          Rx.defer(() => {
            const itemType = (value as SelectOption)
              .value as BalancedScorecardItemType;
            return getAllResources(itemType).pipe(
              Rx.map(ret => ChallengeActions.setResources(ret))
            );
          }),
          Rx.of(ChallengeFormActions.change('item', null!))
        );
      }
    }
    return Rx.empty();
  })
  .on(ChallengeActions.save, ({ draft }, { action$ }) => {
    return Rx.concatObs(
      Rx.of(ChallengeFormActions.submit()),
      action$.pipe(
        Rx.waitForType(ChallengeFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(ChallengeActions.setSaving(true)),
            saveChallenge(draft).pipe(
              Rx.mergeMap(() => {
                return [
                  RouterActions.push(`/challenges`),
                  GlobalActions.showNotification(
                    'success',
                    'Saved successfully'
                  ),
                ];
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(ChallengeActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(ChallengeFormActions.setSubmitFailed))
        )
      )
    );
  })
  .on(ChallengeFormActions.setSubmitFailed, focusFormErrorEpic)
  .onMany(
    [ActionDetailsActions.actionCreated, ActionDetailsActions.actionUpdated],
    ({ actionData }) => {
      const { values: formValues } = getChallengeFormState();
      const actions = [...(formValues.actions || [])];
      const id = actionData.id || -Date.now();
      if (!actions.includes(id)) {
        actions.push(id);
      }
      return [
        ChallengeFormActions.changeMany({
          actions,
          [getActionProp(id, 'name')]: actionData.name,
          [getActionProp(id, 'startDate')]: actionData.startDate,
          [getActionProp(id, 'endDate')]: actionData.endDate,
        }),
        ActionDetailsActions.close(),
      ];
    }
  );

// --- Reducer ---
const initialState: ChallengeState = {
  isLoaded: false,
  isSaving: false,
  isDeleting: false,
  challenge: null,
  resources: null,
  units: null,
};

handle
  .reducer(initialState)
  .replace(ChallengeActions.$init, () => initialState)
  .on(ChallengeActions.loaded, (state, { challenge, resources, units }) => {
    state.challenge = challenge;
    state.resources = resources;
    state.units = units;
    state.isLoaded = true;
  })
  .on(ChallengeActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(ChallengeActions.setDeleting, (state, { isDeleting }) => {
    state.isDeleting = isDeleting;
  })
  .on(ChallengeActions.setResources, (state, { resources }) => {
    state.resources = resources;
  });

// --- Module ---
export default () => {
  useChallengeForm();
  handle();
  return <ChallengeView />;
};
