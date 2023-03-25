import { createErrorAction, createSuccessAction } from './utils';
import { EntityTypes } from '../constants';
import { IEntity, IUserData } from '../../types/interfaces';

const {
	SET_ENTITY,
	INIT_ENTITY,
	TOGGLE_PHONE_PREFERENCE,
	TOGGLE_EMAIL_PREFERENCE,
	CLEAR_ENTITY_STATE,
	SET_ENTITY_EXISTS
} = EntityTypes;

export const initEntity = (entity: IEntity, oppId?: string | null) => ({
	type: INIT_ENTITY,
	payload: { entity, oppId },
	meta: {
		loading: true
	}
});
export const initEntitySuccess = createSuccessAction(INIT_ENTITY);
export const initEntityError = createErrorAction(INIT_ENTITY);

export const setEntity = (entity: IUserData) => ({
	type: SET_ENTITY,
	payload: entity
});

export const togglePhonePreference = (phoneNumber: string) => ({
	type: TOGGLE_PHONE_PREFERENCE,
	payload: phoneNumber
});

export const toggleEmailPreference = (email: string) => ({
	type: TOGGLE_EMAIL_PREFERENCE,
	payload: email
});

export const setEntityExist = () => ({
	type: SET_ENTITY_EXISTS
});

export const resetEntityState = () => ({
	type: CLEAR_ENTITY_STATE
});
