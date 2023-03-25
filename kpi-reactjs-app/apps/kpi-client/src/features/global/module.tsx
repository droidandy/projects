import * as Rx from 'src/rx';
import {
  clearStorage,
  getAccessToken,
  getSelectedStrategicPlan,
  setSelectedStrategicPlan,
} from 'src/services/Storage';
import {
  GlobalActions,
  GlobalState,
  handle,
  getGlobalState,
} from './interface';
import { RouterActions } from 'typeless-router';
import {
  getLoggedUser,
  getLookups,
  getAllRoles,
  getAllDashboard,
  getDocument,
  API_BASE_URL,
  getKPILevels,
  getAllStrategicPlans,
} from 'shared/API';
import { initEnums } from 'shared/init-enums';
import { catchErrorAndShowModal } from 'src/common/utils';

function _getStoredId(
  getter: () => number,
  setter: (id: number) => void,
  allItems: Array<{ id: number }>
) {
  let id = getter();
  if (allItems.length && !allItems.some(x => x.id === id)) {
    id = allItems[0].id;
    setter(id);
  }
  return id;
}

// --- Epic ---
handle
  .epic()
  .on(GlobalActions.$mounted, () => {
    if (getAccessToken()) {
      return getLoggedUser().pipe(
        Rx.catchError(() => {
          clearStorage();
          return Rx.of(null);
        }),
        Rx.map(user => GlobalActions.loggedIn(user)),
        catchErrorAndShowModal()
      );
    }

    return GlobalActions.loggedIn(null);
  })
  .on(GlobalActions.logout, () => {
    clearStorage();
    return RouterActions.push('/login');
  })
  .on(GlobalActions.loggedIn, ({ user }) => {
    if (!user) {
      return Rx.empty();
    }
    return Rx.forkJoin([
      getAllDashboard(),
      getLookups(),
      getAllRoles(),
      getKPILevels(),
      getAllStrategicPlans(),
    ]).pipe(
      Rx.map(([dashboards, lookups, roles, kpiLevels, strategicPlans]) => {
        const currentPlanId = _getStoredId(
          getSelectedStrategicPlan,
          setSelectedStrategicPlan,
          strategicPlans
        );
        initEnums(lookups, roles);
        return GlobalActions.initialDataLoaded(
          currentPlanId,
          dashboards,
          lookups,
          roles,
          kpiLevels,
          strategicPlans
        );
      }),
      catchErrorAndShowModal()
    );
  })
  .on(GlobalActions.showNotification, ({ id }) => {
    return Rx.of(GlobalActions.removeNotification(id)).pipe(Rx.delay(5000));
  })
  .on(GlobalActions.changeStrategicPlan, ({ id }) => {
    setSelectedStrategicPlan(id);
    return GlobalActions.refreshPage();
  })
  .on(GlobalActions.refreshPage, () => {
    window.location!.reload();
    return Rx.empty();
  })
  .on(GlobalActions.downloadFile, ({ id }) => {
    return getDocument(id).pipe(
      Rx.mergeMap(file => {
        window.location.href = `${API_BASE_URL}/api/documents/files?token=${file.downloadToken}`;
        return Rx.empty();
      })
    );
  });

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
  dashboards: null!,
  lookups: null!,
  roles: null!,
  kpiLevels: null!,
  notifications: [],
  initiativeSearchFilter: undefined,
  strategicPlans: null,
  currentPlanId: null!,
};

export const reducer = handle
  .reducer(initialState)
  .on(GlobalActions.reset, state => {
    Object.assign(state, initialState);
    state.isLoaded = true;
  })
  .on(GlobalActions.loggedIn, (state, { user }) => {
    state.isLoaded = true;
    state.user = user;
  })
  .on(GlobalActions.logout, state => {
    state.user = null;
  })
  .on(
    GlobalActions.initialDataLoaded,
    (
      state,
      { currentPlanId, strategicPlans, dashboards, lookups, roles, kpiLevels }
    ) => {
      state.currentPlanId = currentPlanId;
      state.strategicPlans = strategicPlans;
      state.dashboards = dashboards;
      state.lookups = lookups;
      state.roles = roles;
      state.kpiLevels = kpiLevels;
    }
  )
  .on(GlobalActions.showNotification, (state, notification) => {
    state.notifications.push(notification);
  })
  .on(GlobalActions.removeNotification, (state, { id }) => {
    state.notifications = state.notifications.filter(x => x.id !== id);
  })
  .on(GlobalActions.setInitiativeSearchFilter, (state, { filter }) => {
    state.initiativeSearchFilter = filter;
  });

if (module.hot) {
  const { lookups, roles } = getGlobalState() || {};
  if (lookups && roles) {
    initEnums(lookups, roles);
  }
}

// --- Module ---
export const useGlobalModule = handle;
