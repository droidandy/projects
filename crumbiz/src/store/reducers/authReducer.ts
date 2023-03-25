import { AuthActionTypes } from '../constants';
import { IUserData } from '../../types/interfaces';

interface IAction {
	type: AuthActionTypes;
	payload: any;
}

interface IAuthInitialState {
	userData: Partial<IUserData>;
	restorePassStepper: number;
	userAuthenticated: boolean | null;
}

export enum RestorePasswordSteps {
	ENTER_EMAIL,
	EMAIL_SENT
}

const initialState: IAuthInitialState = {
	userData: {
		id: ''
	},
	restorePassStepper: RestorePasswordSteps.ENTER_EMAIL,
	userAuthenticated: null
};

const authReducer = (state = initialState, action: IAction) => {
	switch (action.type) {
		case AuthActionTypes.FORGOT_PASSWORD_SENT:
			return {
				...state,
				restorePassStepper: RestorePasswordSteps.EMAIL_SENT
			};
		case AuthActionTypes.SET_USER_DETAILS:
			return {
				...state,
				userData: action.payload,
				userAuthenticated: true
			};
		case AuthActionTypes.CLEAR_USER_DETAILS:
			return {
				...initialState,
				userAuthenticated: false
			};
		case AuthActionTypes.AUTH_SUCCESS:
			return {
				...state,
				userAuthenticated: true
			};
		case AuthActionTypes.UPDATE_USER_DETAILS:
			return {
				...state,
				userData: action.payload
			};
		default:
			return state;
	}
};

export default authReducer;
