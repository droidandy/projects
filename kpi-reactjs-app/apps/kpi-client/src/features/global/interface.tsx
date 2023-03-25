import { createModule } from 'typeless';
import { GlobalSymbol } from './symbol';
import {
  User,
  Dashboard,
  Lookup,
  Role,
  Notification,
  KPILevel,
  StrategicPlan,
} from 'src/types';
import { InitiativeSearchFilter } from '../project/shared/type';

export const [handle, GlobalActions, getGlobalState] = createModule(
  GlobalSymbol
)
  .withActions({
    $mounted: null,
    logout: null,
    reset: null,
    loggedIn: (user: User | null) => ({
      payload: { user },
    }),
    initialDataLoaded: (
      currentPlanId: number,
      dashboards: Dashboard[],
      lookups: Lookup[],
      roles: Role[],
      kpiLevels: KPILevel[],
      strategicPlans: StrategicPlan[]
    ) => ({
      payload: {
        currentPlanId,
        dashboards,
        lookups,
        roles,
        kpiLevels,
        strategicPlans,
      },
    }),
    showNotification: (
      type: 'error' | 'success',
      text: string,
      id = Date.now()
    ) => ({
      payload: { type, text, id } as Notification,
    }),
    removeNotification: (id: number) => ({ payload: { id } }),
    downloadFile: (id: number) => ({ payload: { id } }),
    setInitiativeSearchFilter: (filter: InitiativeSearchFilter) => ({
      payload: { filter },
    }),
    changeStrategicPlan: (id: number) => ({ payload: { id } }),
    refreshPage: null,
  })
  .withState<GlobalState>();

export interface GlobalState {
  isLoaded: boolean;
  user: User | null;
  dashboards: Dashboard[];
  lookups: Lookup[];
  roles: Role[];
  kpiLevels: KPILevel[];
  notifications: Notification[];
  initiativeSearchFilter: InitiativeSearchFilter | undefined;
  strategicPlans: StrategicPlan[] | null;
  currentPlanId: number;
}
