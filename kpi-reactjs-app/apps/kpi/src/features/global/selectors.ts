import { createSelector } from 'typeless';
import * as R from 'remeda';
import { getGlobalState } from './interface';

export const getStrategicDocument = createSelector(
  [getGlobalState, state => state.currentPlanId],
  [getGlobalState, state => state.strategicPlans],
  (currentPlanId, strategicPlans) => {
    if (!strategicPlans) {
      return null;
    }
    return strategicPlans.find(x => x.id === currentPlanId);
  }
);

export const getUserPermissions = createSelector(
  [getGlobalState, state => state.user],
  user => {
    if (!user) {
      return [];
    }
    return R.pipe(
      user.orgUsers,
      R.flatMap(x => x.orgUserRoles),
      R.flatMap(x => x.role.rolePermissions),
      R.map(x => x.permission.name)
    );
  }
);
