import { EntityTypes, CrumbizUsersTypes, OppOverviewTypes } from '../constants';
export const loadingSelector = (state: any) => state.pending;
export const isLoading = (state: any) =>
	Object.values(loadingSelector(state).loadings).some(loading => loading);

export const loadingsSelector = (state: any) => loadingSelector(state).loadings;

export const createLoadingSelector = (actionType: string) => (state: any) =>
	loadingsSelector(state)[actionType];

export const initEntityLoadingSelector = (state: any) =>
	loadingsSelector(state)[EntityTypes.INIT_ENTITY];

export const getCrumbizUsersLoadingSelector = (state: any) =>
	loadingsSelector(state)[CrumbizUsersTypes.GET_CRUMBIZ_USERS];

export const oppoverviewLoadingSelector = (state: any) =>
	loadingsSelector(state)[
		OppOverviewTypes.GET_OPP_DETAILS_TARGETS_AND_CONNECTORS
	];
