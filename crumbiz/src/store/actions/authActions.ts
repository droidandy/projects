import { AuthActionTypes } from '../constants';
import {
	IRegisterPayload,
	IUserData,
	IResetPasswordPayload
} from '../../types/interfaces';
import { ILoginMethodResponse } from '../../services/api/Auth';

import { createErrorAction, createSuccessAction } from './utils';

//------------------------------------//
//  Sagas actions - async             //
//------------------------------------//

export const initAuthenticationFlow = () => ({
	type: AuthActionTypes.INIT_AUTHENTICATION_FLOW,
	meta: {
		loading: true,
		finishOn: [
			AuthActionTypes.SET_USER_DETAILS,
			AuthActionTypes.CLEAR_USER_DETAILS
		]
	}
});

export const getUserDetails = (accessToken: string) => {
	return {
		type: AuthActionTypes.GET_USER_DETAILS,
		payload: accessToken
	};
};

export const updateUserDetails = (payload: IUserData) => ({
	type: AuthActionTypes.UPDATE_USER_DETAILS,
	payload
});

export const login = (payload: Partial<IRegisterPayload>) => {
	return {
		type: AuthActionTypes.LOGIN,
		payload,
		meta: {
			loading: true
		}
	};
};

export const loginSuccess = createSuccessAction(AuthActionTypes.LOGIN);
export const loginError = createErrorAction(AuthActionTypes.LOGIN);

export const register = (payload: Partial<IRegisterPayload>) => {
	return {
		type: AuthActionTypes.REGISTER,
		payload,
		meta: {
			loading: true
		}
	};
};

export const registerSuccess = createSuccessAction(AuthActionTypes.REGISTER);
export const registerError = createErrorAction(AuthActionTypes.REGISTER);

export const refreshToken = (refreshToken: Partial<ILoginMethodResponse>) => {
	return {
		type: AuthActionTypes.REFRESH_TOKEN,
		payload: refreshToken
	};
};

export const forgotPassword = (email: Partial<IRegisterPayload>) => {
	return {
		type: AuthActionTypes.FORGOT_PASSWORD,
		payload: email,
		meta: {
			loading: true
		}
	};
};

export const forgotPasswordSuccess = createSuccessAction(
	AuthActionTypes.FORGOT_PASSWORD
);
export const forgotPasswordError = createErrorAction(
	AuthActionTypes.FORGOT_PASSWORD
);

export const forgotPasswordSent = () => {
	return {
		type: AuthActionTypes.FORGOT_PASSWORD_SENT
	};
};

export const changePassword = (newPassword: string) => {
	return {
		type: AuthActionTypes.CHANGE_PASSWORD,
		payload: { NewPassword: newPassword }
	};
};

export const resetPassword = (params: IResetPasswordPayload) => {
	return {
		type: AuthActionTypes.RESET_PASSWORD,
		payload: params
	};
};

export const confirmRegistration = (email: string, code: string) => {
	return {
		type: AuthActionTypes.CONFIRM_REGISTERATION,
		payload: { email, code }
	};
};

//------------------------------------//
//  Reducer actions - sync            //
//------------------------------------//

export const setUserDetails = (payload: IUserData) => {
	return {
		type: AuthActionTypes.SET_USER_DETAILS,
		payload
	};
};

export const logoutUser = () => {
	return {
		type: AuthActionTypes.LOGOUT_USER
	};
};

export const clearUserDetails = () => {
	return {
		type: AuthActionTypes.CLEAR_USER_DETAILS
	};
};
