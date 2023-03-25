import { EntityTypes } from '../constants';
import { IReduxAction, IEntity } from '../../types/interfaces';

export interface IEntityReducerstate {
	entity: IEntity | null;
	isEntityExist: boolean;
}

const initialState: IEntityReducerstate = {
	entity: null,
	isEntityExist: false
};

const {
	SET_ENTITY,
	TOGGLE_PHONE_PREFERENCE,
	TOGGLE_EMAIL_PREFERENCE,
	CLEAR_ENTITY_STATE,
	SET_ENTITY_EXISTS
} = EntityTypes;

const entityReducer = (
	state = initialState,
	action: IReduxAction<EntityTypes>
) => {
	switch (action.type) {
		case SET_ENTITY:
			return {
				...state,
				entity: action.payload
			};
		case TOGGLE_PHONE_PREFERENCE:
			const userPhones = state.entity?.userPhones;
			const phoneIndex = userPhones?.findIndex(x => x.phone === action.payload);
			const currentPreference = userPhones![phoneIndex!].userPhonePreferences[0]
				.prefer;
			userPhones![
				phoneIndex!
			].userPhonePreferences[0].prefer = !currentPreference;
			return {
				...state,
				entity: {
					...state.entity,
					userPhones
				}
			};

		case TOGGLE_EMAIL_PREFERENCE:
			const userEmails = state.entity?.userEmails;
			const emailIndex = userEmails?.findIndex(x => x.email === action.payload);
			const currPreference = userEmails![emailIndex!].userEmailPreferences[0]
				.prefer;
			userEmails![emailIndex!].userEmailPreferences[0].prefer = !currPreference;
			return {
				...state,
				entity: {
					...state.entity,
					userEmails
				}
			};

		case SET_ENTITY_EXISTS: {
			return {
				...state,
				isEntityExist: true
			};
		}

		case CLEAR_ENTITY_STATE:
			return {
				...initialState
			};
		default:
			return state;
	}
};

export default entityReducer;
