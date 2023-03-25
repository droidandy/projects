import React from 'react';
import * as Rx from 'src/rx';
import { InitiativesView } from './components/InitiativesView';
import {
  InitiativesActions,
  InitiativesState,
  handle,
  getInitiativesState,
} from './interface';
import { GlobalActions, getGlobalState } from '../global/interface';
import {
  getInitiatives,
  getInitiativeById,
  getInitiativeItems,
  getAllInitiativeItems,
  getSkills,
  searchRiskManagementItem,
  getRelatedItems,
} from 'src/services/API-next';
import { catchErrorAndShowModal, focusFormErrorEpic } from 'src/common/utils';
import { RouterActions, getRouterState } from 'typeless-router';
import { useInfoForm, InfoFormActions, getInfoFormState } from './info-form';
import { saveInitiative } from './save';
import { getReferencesNextState } from '../referencesNext/interface';
import { loadUsersHandler } from '../referencesNext/module';
import { getInitialFormActions } from './getInitialFormActions';
import { RelatedItemsActions } from '../relatedItems/interface';
import { ActivityActions } from './components/ActivityModal';
import { RelatedItemActions } from './components/RelatedItemModal';
import { RiskManagementActions } from './components/RiskManagementModal';
import { BreadcrumbsActions } from 'src/components/Breadcrumbs';

// --- Epic ---
handle
  .epic()
  .onMany(
    [
      InitiativesActions.$mounted,
      GlobalActions.changeStrategicPlan,
      GlobalActions.changeUnit,
    ],
    () => {
      return InitiativesActions.load();
    }
  )
  .on(InitiativesActions.load, () => {
    const { currentPlanId, currentUnitId } = getGlobalState();
    return Rx.forkJoin(
      getInitiatives(currentPlanId, currentUnitId),
      getAllInitiativeItems()
    ).pipe(
      Rx.map(([initiatives, items]) =>
        InitiativesActions.initiativesLoaded(initiatives, items)
      ),
      catchErrorAndShowModal()
    );
  })
  .onMany([RouterActions.locationChange, InitiativesActions.load], () => {
    const location = getRouterState().location!;
    if (location.pathname === '/initiatives-next') {
      return getSkills().pipe(
        Rx.mergeMap(skills => [
          InitiativesActions.setInitiativeId(null),
          InitiativesActions.initiativeLoaded(null, [], skills, [], [], []),
        ])
      );
    }
    const reg = /initiatives-next\/(\d+)/;
    const match = reg.exec(location.pathname);
    if (!match) {
      return Rx.empty();
    }
    if (getInitiativesState().wasCreated) {
      return InitiativesActions.setWasCreated(false);
    }
    const id = Number(match[1]);
    const { currentPlanId, currentUnitId } = getGlobalState();
    return Rx.concatObs(
      Rx.of(InitiativesActions.setLoading(true)),
      Rx.of(InitiativesActions.setInitiativeId(id)),
      Rx.defer(() => {
        if (getReferencesNextState().users.isLoaded) {
          return Rx.empty();
        }
        return loadUsersHandler();
      }),
      Rx.forkJoin([
        getInitiativeById(id),
        getInitiativeItems(id),
        getSkills(),
        searchRiskManagementItem({
          pageSize: 100000,
          initiativeId: id,
        }),
        getInitiatives(currentPlanId, currentUnitId, {
          parentId: id,
        }).pipe(
          Rx.mergeMap(items =>
            Rx.from(items).pipe(
              Rx.mergeMap(item => getInitiativeById(item.id)),
              Rx.toArray()
            )
          )
        ),
        getRelatedItems('InitiativeItem', id),
      ]).pipe(
        Rx.mergeMap(
          ([initiatives, items, skills, risks, activities, relatedItems]) => [
            BreadcrumbsActions.update({
              en: initiatives.name.en,
              ar: initiatives.name.ar,
            }),
            InitiativesActions.initiativeLoaded(
              initiatives,
              items,
              skills,
              risks.items,
              activities,
              relatedItems
            ),
          ]
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(InitiativesActions.setLoading(false))
    );
  })
  .on(InitiativesActions.edit, () => {
    return getInitialFormActions();
  })
  .on(ActivityActions.activityCreated, ({ activity }) => {
    const { isEditing } = getInitiativesState();
    if (!isEditing) {
      return Rx.empty();
    }
    const {
      values: { activities = [] },
    } = getInfoFormState();
    return InfoFormActions.change('activities', [...activities, activity]);
  })
  .on(ActivityActions.activityUpdated, ({ activity }) => {
    const { isEditing } = getInitiativesState();
    if (!isEditing) {
      return Rx.empty();
    }
    const {
      values: { activities = [] },
    } = getInfoFormState();
    return InfoFormActions.change(
      'activities',
      activities.map(item => (item.id === activity.id ? activity : item))
    );
  })
  .on(RiskManagementActions.riskCreated, ({ risk }) => {
    const { isEditing } = getInitiativesState();
    if (!isEditing) {
      return Rx.empty();
    }
    const {
      values: { risks = [] },
    } = getInfoFormState();
    return InfoFormActions.change('risks', [...risks, risk]);
  })
  .on(RiskManagementActions.riskUpdated, ({ risk }) => {
    const { isEditing } = getInitiativesState();
    if (!isEditing) {
      return Rx.empty();
    }
    const {
      values: { risks = [] },
    } = getInfoFormState();
    return InfoFormActions.change(
      'risks',
      risks.map(item => (item.id === risk.id ? risk : item))
    );
  })
  .on(RelatedItemActions.itemCreated, ({ item }) => {
    const { isEditing } = getInitiativesState();
    if (!isEditing) {
      return Rx.empty();
    }
    const {
      values: { relatedItems = [] },
    } = getInfoFormState();
    return InfoFormActions.change('relatedItems', [...relatedItems, item]);
  })
  .on(InitiativesActions.save, ({ draft }, { action$ }) => {
    const { isAdding } = getInitiativesState();
    return Rx.concatObs(
      Rx.of(InfoFormActions.submit()),
      action$.pipe(
        Rx.waitForType(InfoFormActions.setSubmitSucceeded),
        Rx.mergeMap(() => {
          return Rx.concatObs(
            Rx.of(InitiativesActions.setSaving(true)),
            saveInitiative(draft).pipe(
              Rx.mergeMap(result => {
                if (isAdding) {
                  return [
                    InitiativesActions.initiativeCreated(result),
                    RouterActions.push(
                      `/initiatives-next/${result.initiative.id}`
                    ),
                    GlobalActions.showNotification(
                      'success',
                      'Saved successfully'
                    ),
                  ];
                } else {
                  return [
                    InitiativesActions.initiativeUpdated(result),
                    GlobalActions.showNotification(
                      'success',
                      'Updated successfully'
                    ),
                  ];
                }
              }),
              catchErrorAndShowModal()
            ),
            Rx.of(InitiativesActions.setSaving(false))
          );
        }),
        Rx.takeUntil(
          action$.pipe(Rx.waitForType(InfoFormActions.setSubmitFailed))
        )
      )
    );
  })
  .on(InfoFormActions.setSubmitFailed, focusFormErrorEpic)
  .on(InitiativesActions.addNewItem, () => {
    return InfoFormActions.reset();
  })
  .on(InitiativesActions.initiativeLoaded, ({ initiative }) => {
    if (!initiative) {
      return Rx.empty();
    }
    return RelatedItemsActions.show('InitiativeItem', initiative.id);
  });

// --- Reducer ---
const initialState: InitiativesState = {
  isLoaded: false,
  initiatives: [],
  isLoading: false,
  isSaving: false,
  isAdding: false,
  wasCreated: false,
  initiativeId: null,
  initiative: null,
  items: [],
  isEditing: false,
  skills: [],
  risks: [],
  activities: [],
  relatedItems: [],
};

handle
  .reducer(initialState)
  .replace(InitiativesActions.$init, () => initialState)
  .replace(InitiativesActions.load, () => initialState)
  .on(InitiativesActions.initiativesLoaded, (state, { initiatives, items }) => {
    state.initiatives = initiatives;
    state.items = items;
    state.isLoaded = true;
  })
  .on(InitiativesActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(InitiativesActions.setSaving, (state, { isSaving }) => {
    state.isSaving = isSaving;
  })
  .on(InitiativesActions.setInitiativeId, (state, { initiativeId }) => {
    state.initiativeId = initiativeId;
    state.isAdding = false;
    state.isEditing = false;
  })
  .on(
    InitiativesActions.initiativeLoaded,
    (state, { initiative, items, skills, risks, activities, relatedItems }) => {
      state.initiative = initiative;
      state.skills = skills;
      state.risks = risks;
      state.activities = activities;
      state.relatedItems = relatedItems;
      state.items = items;
    }
  )
  .on(InitiativesActions.setWasCreated, (state, { wasCreated }) => {
    state.wasCreated = wasCreated;
  })
  .on(InitiativesActions.addNewItem, state => {
    state.isAdding = true;
    state.isEditing = true;
  })
  .on(InitiativesActions.cancelAdd, state => {
    state.isAdding = false;
    state.isEditing = false;
  })
  .on(InitiativesActions.initiativeUpdated, (state, data) => {
    const {
      initiative,
      activityList,
      riskManagementList,
      relatedItemList,
    } = data;
    state.initiatives = state.initiatives.map(item => {
      if (item.id === initiative.id) {
        return initiative;
      }
      return item;
    });
    if (state.initiative && state.initiative.id === initiative.id) {
      state.initiative = initiative;
    }
    state.isEditing = false;
    state.activities = activityList;
    state.risks = riskManagementList;
    state.relatedItems = relatedItemList;
  })
  .on(InitiativesActions.initiativeCreated, (state, data) => {
    const {
      initiative,
      activityList,
      riskManagementList,
      relatedItemList,
    } = data;

    state.initiativeId = initiative.id;
    state.initiative = initiative;
    state.isAdding = false;
    state.isEditing = false;
    state.initiatives.unshift(initiative);
    state.wasCreated = true;
    state.activities = activityList;
    state.risks = riskManagementList;
    state.relatedItems = relatedItemList;
  })
  .on(InitiativesActions.edit, state => {
    state.isEditing = true;
  })
  .on(InitiativesActions.cancelEdit, state => {
    state.isEditing = false;
  })
  .on(InitiativesActions.skillCreated, (state, { skill }) => {
    state.skills.push(skill);
  })
  .on(RelatedItemActions.itemCreated, (state, { item }) => {
    if (!state.isEditing) {
      state.relatedItems.push(item);
    }
  })
  .on(RiskManagementActions.riskUpdated, (state, { risk }) => {
    if (!state.isEditing) {
      state.risks = state.risks.map(item =>
        item.id === risk.id ? risk : item
      );
    }
  })
  .on(RiskManagementActions.riskCreated, (state, { risk }) => {
    if (!state.isEditing) {
      state.risks.push(risk);
    }
  })
  .on(ActivityActions.activityUpdated, (state, { activity }) => {
    if (!state.isEditing) {
      state.activities = state.activities.map(item =>
        item.id === activity.id ? activity : item
      );
    }
  })
  .on(ActivityActions.activityDeleted, (state, { activity }) => {
    if (!state.isEditing) {
      state.activities = state.activities.filter(
        item => item.id !== activity.id
      );
    }
  })
  .on(ActivityActions.activityCreated, (state, { activity }) => {
    if (!state.isEditing) {
      state.activities.push(activity);
    }
  });

// --- Module ---
export default () => {
  useInfoForm();
  handle();
  return <InitiativesView />;
};
