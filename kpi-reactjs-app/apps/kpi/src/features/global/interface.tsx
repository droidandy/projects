import { Notification, PermissionMap } from 'src/types';
import { createModule } from 'typeless';
import { GlobalSymbol } from './symbol';
import {
  User,
  OrganizationUnit,
  StrategicPlan,
  Lookup,
  Role,
  KPILevel,
  ColorTheme,
  Organization,
} from 'src/types-next';

export const [handle, GlobalActions, getGlobalState] = createModule(
  GlobalSymbol
)
  .withActions({
    $mounted: null,
    logout: null,
    loggedIn: (user: User | null, permissionMap: PermissionMap) => ({
      payload: { user, permissionMap },
    }),
    toggleSidebarExpanded: null,
    refreshStrategicPlans: null,
    refreshScorecardList: null,
    changeLanguage: (language: string) => ({ payload: { language } }),
    showNotification: (
      type: 'error' | 'success',
      text: string,
      id = Date.now()
    ) => ({
      payload: { type, text, id } as Notification,
    }),
    removeNotification: (id: number) => ({ payload: { id } }),
    initialDataLoaded: (
      colorThemes: ColorTheme[],
      currentThemeId: number,
      strategicPlans: StrategicPlan[],
      currentPlanId: number,
      organizations: Organization[],
      organizationId: number,
      organizationUnits: OrganizationUnit[],
      currentUnitId: number,
      lookups: Lookup[],
      roles: Role[],
      kpiLevels: KPILevel[]
    ) => ({
      payload: {
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
      },
    }),
    loadStrategicPlans: (strategicPlans: StrategicPlan[]) => ({
      payload: { strategicPlans },
    }),
    loadOrganizationUnits: (organizationUnits: OrganizationUnit[]) => ({
      payload: { organizationUnits },
    }),
    changeStrategicPlan: (id: number) => ({ payload: { id } }),
    changeUnit: (id: number) => ({ payload: { id } }),
    recalculate: null,
    setIsRecalculating: (isRecalculating: boolean) => ({
      payload: { isRecalculating },
    }),
    changeColorTheme: (id: number) => ({ payload: { id } }),
    changeOrganization: (id: number) => ({ payload: { id } }),
    refreshPage: () => ({}),
  })
  .withState<GlobalState>();

export interface GlobalState {
  isSidebarExpanded: boolean;
  isLoaded: boolean;
  user: User | null;
  language: string;
  notifications: Notification[];
  permissionMap: PermissionMap;
  strategicPlans: StrategicPlan[] | null;
  organizations: Organization[] | null;
  organizationUnits: OrganizationUnit[] | null;
  currentPlanId: number;
  organizationId: number;
  currentUnitId: number;
  lookups: Lookup[];
  roles: Role[];
  kpiLevels: KPILevel[];
  lang: 'en' | 'ar';
  isRecalculating: boolean;
  colorThemes: ColorTheme[];
  currentThemeId: number;
}
