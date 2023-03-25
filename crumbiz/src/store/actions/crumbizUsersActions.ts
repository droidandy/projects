import { CrumbizUsersTypes } from '../constants';
import { createSuccessAction, createErrorAction } from './utils';
import {
	IupdateUserInfoPayload,
	IUpdateUserAdditionalsPayload
} from '../../types/interfaces';
import {
	IUserData,
	IUserExpandedWithRelationships
} from '../../types/interfaces';

export const getCrumbizUsers = () => ({
	type: CrumbizUsersTypes.GET_CRUMBIZ_USERS,
	meta: {
		loading: true
	}
});

export const getCrumbizUsersSuccess = createSuccessAction(
	CrumbizUsersTypes.GET_CRUMBIZ_USERS
);
export const getCrumbizUsersError = createErrorAction(
	CrumbizUsersTypes.GET_CRUMBIZ_USERS
);

export const setCrumbizUsers = (payload: Array<IUserData>) => ({
	type: CrumbizUsersTypes.SET_CRUMBIZ_USERS,
	payload
});

export const getRelationshipsData = () => ({
	type: CrumbizUsersTypes.GET_RELATIONSHIPS_DATA
});

export const setRelationshipsData = (
	users: Array<IUserExpandedWithRelationships>
) => ({
	type: CrumbizUsersTypes.SET_RELATIONSHIPS_DATA,
	payload: users
});

export const updateUserInfo = (payload: Partial<IupdateUserInfoPayload>) => ({
	type: CrumbizUsersTypes.UPDATE_USER_INFO,
	payload
});

export const updateUserAdditionalsInfo = (
	payload: Partial<IUpdateUserAdditionalsPayload>
) => ({
	type: CrumbizUsersTypes.UPDATE_USER_ADDITIONALS_INFO,
	payload,
	meta: {
		loading: true
	}
});

export const updateuserAdditionalInfoSuccess = createSuccessAction(
	CrumbizUsersTypes.UPDATE_USER_ADDITIONALS_INFO
);
export const updateuserAdditionalInfoError = createErrorAction(
	CrumbizUsersTypes.UPDATE_USER_ADDITIONALS_INFO
);

export const resetCrumbizUsersState = () => ({
	type: CrumbizUsersTypes.RESET_CRUMBIZ_USERS_STATE
});
