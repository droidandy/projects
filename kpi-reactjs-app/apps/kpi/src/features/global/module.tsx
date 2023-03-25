import * as Rx from 'src/rx';
import {
  clearStorage,
  getAccessToken,
  getSelectedStrategicPlan,
  setSelectedStrategicPlan,
  setSelectedOrganization,
  getSelectedUnit,
  setSelectedUnit,
  getThemeColor,
  setThemeColor,
  getSelectedOrganization,
} from 'src/services/Storage';
import {
  GlobalActions,
  GlobalState,
  handle,
  getGlobalState,
} from './interface';
import { RouterActions, getRouterState } from 'typeless-router';
import i18n from 'src/i18n';
import {
  getLoggedUser,
  getAllOrganizationUnit,
  getAllStrategicPlans,
  getLookups,
  getAllRoles,
  getKPILevels,
  recalculatePerformance,
  searchOrganizations,
} from 'src/services/API-next';
import { allPermissionMap } from 'src/const';
import { initEnums } from 'shared/init-enums';
import { catchErrorAndShowModal } from 'src/common/utils';
import { getAllColorThemes } from 'src/services/API';

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
        Rx.map(user =>
          // todo: permission map
          GlobalActions.loggedIn(user, allPermissionMap)
        )
      );
    }

    return GlobalActions.loggedIn(null, {});
  })
  .on(GlobalActions.logout, () => {
    clearStorage();
    return RouterActions.push('/login');
  })
  .on(GlobalActions.changeLanguage, ({ language }) => {
    i18n.changeLanguage(language);
    return Rx.empty();
  })
  .on(GlobalActions.showNotification, ({ id }) => {
    return Rx.of(GlobalActions.removeNotification(id)).pipe(Rx.delay(5000));
  })
  .on(GlobalActions.refreshStrategicPlans, () => {
    return getAllStrategicPlans()
      .pipe(
        Rx.mergeMap(ret => {
          return [GlobalActions.loadStrategicPlans(ret)];
        })
      )
      .pipe(catchErrorAndShowModal());
  })
  .on(GlobalActions.loggedIn, ({ user }) => {
    if (!user) {
      return Rx.empty();
    }
    const { organizationId } = getGlobalState();
    return Rx.forkJoin([
      Rx.forkJoin([
        getAllColorThemes(),
        getAllStrategicPlans(),
        searchOrganizations({}),
        getAllOrganizationUnit(organizationId),
        getLookups(),
        getAllRoles(),
      ]),
      Rx.forkJoin([getKPILevels()]),
    ]).pipe(
      Rx.map(
        ([
          [
            colorThemes,
            strategicPlans,
            { items: organizations },
            organizationUnits,
            lookups,
            roles,
          ],
          [kpiLevels],
        ]) => {
          const currentPlanId = _getStoredId(
            getSelectedStrategicPlan,
            setSelectedStrategicPlan,
            strategicPlans
          );
          const organizationId = _getStoredId(
            getSelectedOrganization,
            setSelectedOrganization,
            organizations
          );
          const currentUnitId = _getStoredId(
            getSelectedUnit,
            setSelectedUnit,
            organizationUnits
          );
          const currentThemeId = _getStoredId(
            getThemeColor,
            setThemeColor,
            colorThemes
          );
          initEnums(lookups, roles);
          return GlobalActions.initialDataLoaded(
            colorThemes,
            currentThemeId,
            strategicPlans,
            currentPlanId,
            organizations,
            organizationId,
            organizationUnits,
            currentUnitId,
            lookups,
            roles,
            kpiLevels
          );
        }
      )
    );
  })
  .on(GlobalActions.changeStrategicPlan, () => {
    const { location } = getRouterState();
    if (/\/settings\/strategy-items\/.+/.test(location!.pathname)) {
      return RouterActions.push(location!.pathname);
    }
    return Rx.empty();
  })
  .on(GlobalActions.changeStrategicPlan, ({ id }) => {
    setSelectedStrategicPlan(id);
    return GlobalActions.refreshPage();
  })

  .on(GlobalActions.refreshPage, () => {
    window.location!.reload();
    return Rx.empty();
  })
  .on(GlobalActions.changeOrganization, ({ id }) => {
    setSelectedOrganization(id);
    return GlobalActions.refreshPage();
  })
  .on(GlobalActions.changeUnit, ({ id }) => {
    setSelectedUnit(id);
    return RouterActions.push(location!.pathname);
  })
  .on(GlobalActions.changeColorTheme, ({ id }) => {
    setThemeColor(id);
    return Rx.empty();
  })
  .on(GlobalActions.recalculate, () => {
    return Rx.concatObs(
      Rx.of(GlobalActions.setIsRecalculating(true)),
      recalculatePerformance().pipe(
        Rx.map(() =>
          GlobalActions.showNotification('success', 'Recalculation complete')
        ),
        catchErrorAndShowModal()
      ),
      Rx.of(GlobalActions.setIsRecalculating(false))
    );
  });

// --- Reducer ---
const initialState: GlobalState = {
  isLoaded: false,
  user: null,
  isSidebarExpanded: true,
  language: i18n.language,
  notifications: [],
  permissionMap: {},
  strategicPlans: null,
  currentPlanId: null!,
  organizations: null,
  organizationUnits: null,
  currentUnitId: null!,
  organizationId: 1,
  lookups: null!,
  roles: null!,
  kpiLevels: null!,
  lang: i18n.language as any,
  isRecalculating: false,
  colorThemes: [],
  currentThemeId: null!,
};

const getInitialState = () => {
  const organizationIdFromStorage = getSelectedOrganization();
  return {
    ...initialState,
    organizationId: organizationIdFromStorage || initialState.organizationId,
  };
};

export const reducer = handle
  .reducer(getInitialState())
  .on(GlobalActions.loggedIn, (state, { user, permissionMap }) => {
    state.isLoaded = true;
    state.user = user;
    state.permissionMap = permissionMap;
  })
  .on(GlobalActions.logout, state => {
    state.user = null;
  })
  .on(GlobalActions.toggleSidebarExpanded, state => {
    state.isSidebarExpanded = !state.isSidebarExpanded;
  })
  .on(GlobalActions.changeLanguage, (state, { language }) => {
    state.language = language;
  })
  .on(GlobalActions.loadStrategicPlans, (state, { strategicPlans }) => {
    state.strategicPlans = strategicPlans;
  })
  .on(GlobalActions.loadOrganizationUnits, (state, { organizationUnits }) => {
    state.organizationUnits = organizationUnits;
  })
  .on(GlobalActions.showNotification, (state, notification) => {
    state.notifications.push(notification);
  })
  .on(GlobalActions.removeNotification, (state, { id }) => {
    state.notifications = state.notifications.filter(x => x.id !== id);
  })
  .on(
    GlobalActions.initialDataLoaded,
    (
      state,
      {
        colorThemes,
        currentThemeId,
        strategicPlans,
        currentPlanId,
        organizations,
        organizationId,
        organizationUnits,
        currentUnitId,
        lookups,
        roles,
        kpiLevels,
      }
    ) => {
      state.colorThemes = colorThemes;
      state.currentThemeId = currentThemeId;
      state.strategicPlans = strategicPlans;
      state.currentPlanId = currentPlanId;
      state.organizations = organizations;
      state.organizationId = organizationId;
      state.organizationUnits = organizationUnits;
      state.currentUnitId = currentUnitId;
      state.lookups = lookups;
      state.roles = roles;
      state.kpiLevels = kpiLevels;
    }
  )
  .on(GlobalActions.changeStrategicPlan, (state, { id }) => {
    state.currentPlanId = id;
  })
  .on(GlobalActions.changeOrganization, (state, { id }) => {
    state.organizationId = id;
  })
  .on(GlobalActions.changeUnit, (state, { id }) => {
    state.currentUnitId = id;
  })
  .on(GlobalActions.changeColorTheme, (state, { id }) => {
    state.currentThemeId = id;
  })
  .on(GlobalActions.changeLanguage, (state, { language }) => {
    state.lang = language as any;
  })
  .on(GlobalActions.setIsRecalculating, (state, { isRecalculating }) => {
    state.isRecalculating = isRecalculating;
  });

if (module.hot) {
  const { lookups, roles } = getGlobalState() || {};
  if (lookups && roles) {
    initEnums(lookups, roles);
  }
}

// --- Module ---
export const useGlobalModule = handle;
