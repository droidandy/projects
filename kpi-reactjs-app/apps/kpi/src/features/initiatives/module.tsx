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
} from 'src/services/API-next';
import { catchErrorAndShowModal } from 'src/common/utils';
import { RouterActions, getRouterState } from 'typeless-router';
import { useInfoForm, InfoFormActions } from './info-form';
import { saveInitiative } from './save';
import { getReferencesNextState } from '../referencesNext/interface';
import { loadUsersHandler } from '../referencesNext/module';
import { getInitialFormActions } from './getInitialFormActions';
import { ItemActions } from './components/ItemModal';
import { RelatedItemsActions } from '../relatedItems/interface';
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
    if (location.pathname === '/initiatives') {
      return getSkills().pipe(
        Rx.mergeMap(skills => [
          InitiativesActions.setInitiativeId(null),
          InitiativesActions.initiativeLoaded(null, [], skills, []),
        ])
      );
    }
    const reg = /initiatives\/(\d+)/;
    const match = reg.exec(location.pathname);
    if (!match) {
      return Rx.empty();
    }
    if (getInitiativesState().wasCreated) {
      return InitiativesActions.setWasCreated(false);
    }
    const id = Number(match[1]);
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
      ]).pipe(
        Rx.map(([initiatives, items, skills, risks]) => {
          InitiativesActions.initiativeLoaded(
            initiatives,
            items,
            skills,
            risks.items
          ),
            BreadcrumbsActions.update({
              en: initiatives.name.en,
              ar: initiatives.name.ar,
            });
        }),
        catchErrorAndShowModal()
      ),
      Rx.of(InitiativesActions.setLoading(false))
    );
  })
  .onMany(
    [
      InitiativesActions.cancelAdd,
      InitiativesActions.cancelEdit,
      InitiativesActions.initiativeLoaded,
    ],
    () => {
      const { initiative } = getInitiativesState();
      return getInitialFormActions(initiative);
    }
  )
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
              Rx.mergeMap(initiative => {
                if (isAdding) {
                  return [
                    InitiativesActions.initiativeCreated(initiative),
                    InitiativesActions.setSelectedTab('overview'),
                    RouterActions.push(`/initiatives/${initiative.id}`),
                    GlobalActions.showNotification(
                      'success',
                      'Saved successfully'
                    ),
                  ];
                } else {
                  return [
                    InitiativesActions.initiativeUpdated(initiative),
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
  selectedTab: 'overview',
  isAdding: false,
  wasCreated: false,
  initiativeId: null,
  initiative: null,
  items: [],
  isEditing: false,
  skills: [],
  risks: [],
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
    (state, { initiative, items, skills, risks }) => {
      state.initiative = initiative;
      state.selectedTab = 'overview';
      state.skills = skills;
      state.risks = risks;
      if (initiative) {
        state.items = [
          ...items,
          ...state.items.filter(x => x.initiativeItemId !== initiative.id),
        ];
      }
    }
  )
  .on(InitiativesActions.setSelectedTab, (state, { selectedTab }) => {
    state.selectedTab = selectedTab;
  })
  .on(InitiativesActions.setWasCreated, (state, { wasCreated }) => {
    state.wasCreated = wasCreated;
  })
  .on(InitiativesActions.addNewItem, state => {
    state.isAdding = true;
    state.isEditing = true;
    state.selectedTab = 'info';
  })
  .on(InitiativesActions.cancelAdd, state => {
    state.isAdding = false;
    state.isEditing = false;
    state.selectedTab = 'overview';
  })
  .on(InitiativesActions.initiativeUpdated, (state, { initiative }) => {
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
  })
  .on(InitiativesActions.initiativeCreated, (state, { initiative }) => {
    state.initiativeId = initiative.id;
    state.initiative = initiative;
    state.isAdding = false;
    state.isEditing = false;
    state.initiatives.unshift(initiative);
    state.wasCreated = true;
  })
  .on(ItemActions.itemCreated, (state, { item }) => {
    state.items.push(item);
  })
  .on(ItemActions.itemUpdated, (state, { item }) => {
    state.items = state.items.map(existing =>
      existing.id === item.id ? item : existing
    );
  })
  .on(RiskManagementActions.riskCreated, (state, { risk }) => {
    state.risks.push(risk);
  })
  .on(RiskManagementActions.riskUpdated, (state, { risk }) => {
    state.risks = state.risks.map(existing =>
      existing.id === risk.id ? risk : existing
    );
  })
  .on(InitiativesActions.edit, state => {
    state.isEditing = true;
  })
  .on(InitiativesActions.cancelEdit, state => {
    state.isEditing = false;
  })
  .on(InitiativesActions.skillCreated, (state, { skill }) => {
    state.skills.push(skill);
  });

// --- Module ---
export default () => {
  useInfoForm();
  handle();
  return <InitiativesView />;
};
