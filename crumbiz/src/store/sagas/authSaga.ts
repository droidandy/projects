import { put, all, takeLatest, call } from 'redux-saga/effects';
import { AuthActionTypes } from '../constants';
import {
	forgotPasswordSent,
	setUserDetails,
	clearUserDetails,
	registerSuccess,
	registerError,
	forgotPasswordSuccess,
	forgotPasswordError,
	loginSuccess,
	loginError
} from '../actions/authActions';
import { Auth, navigationService } from '../../services';
import { UsersEP } from '../../services/api/routes';
import jwtDecode from 'jwt-decode';
import {
	IRegisterParams,
	IRegisterMethodResponse
} from '../../services/api/Auth';
import { IDecodedAccessToken } from '../../services/api/Auth';
import { IResetPasswordPayload } from '../../types/interfaces';
import i18n from '../../locale/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import { resetCreateOppState } from '../actions/createOpportunityActions';
import { resetOppOverviewState } from '../actions/oppOverviewActions';
import { sendIntroResetState } from '../actions/sendIntroActions';
import { clearInteractionState } from '../actions/interactionsActions';
import { ScreensEnum } from '../../navigation/screens';
import {
	setAuthHeaders,
	setCrumbizApiAuthorizationHeader
} from '../../services/api/utils';
import { resetMyOppsState } from '../actions/myOppsActions';
import { resetCrumbizUsersState } from '../actions/crumbizUsersActions';

interface ILoginPayload {
	payload: {
		email: string;
		password: string;
	};
}

interface IRegisterPayload {
	payload: IRegisterParams;
}

interface IForgotPasswordPayload {
	payload: string;
}

interface IChangePasswordPayload {
	payload: {
		NewPassword: string;
	};
}

interface IResetPasswordPayL {
	payload: IResetPasswordPayload;
}

interface IRefreshTokenPayload {
	payload: {
		refreshToken: string;
	};
}

interface IConfirmRegPayload {
	payload: {
		email: string;
		code: string;
	};
}

interface IGetUserDataPayload {
	payload: string;
}

//------------------------------------//
//  Watched Sagas                     //
//------------------------------------//
function* getUserDetailsSaga({ payload }: IGetUserDataPayload) {
	try {
		const authId = jwtDecode<IDecodedAccessToken>(payload!).sub;
		const userDetailsKey = `userDetails-${authId}`;
		const cachedUserDetails = yield AsyncStorage.getItem(userDetailsKey);
		if (cachedUserDetails) {
			yield put(setUserDetails(JSON.parse(cachedUserDetails)));
		}
		const data = yield UsersEP.getUserIdByAuthId(authId);
		yield AsyncStorage.setItem(userDetailsKey, JSON.stringify(data.value[0]));
		yield put(setUserDetails(data.value[0]));
	} catch (ex) {
		throw new Error(ex);
	}
}

function* loginSaga({ payload }: ILoginPayload) {
	try {
		const { accessToken, refreshToken } = yield Auth.login(
			payload.email.trim(),
			payload.password.trim()
		);
		yield setTokenLocally(accessToken!, refreshToken!);
		yield initAuthenticationFlowSaga();

		yield put(loginSuccess());
	} catch (ex) {
		yield put(loginError());
		navigationService.navigate(ScreensEnum.TRY_AGAIN_OR_SIGN_UP_MODAL);
		setCrumbizApiAuthorizationHeader(null);
	}
}

function* registerSaga({ payload }: IRegisterPayload) {
	try {
		const {
			accessToken,
			refreshToken
		}: IRegisterMethodResponse = yield Auth.register(payload);
		yield setTokenLocally(accessToken!, refreshToken!);
		yield call(initAuthenticationFlowSaga);
		yield put(registerSuccess());
	} catch (ex) {
		yield put(registerError());
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: i18n.t('register.failedAuthModal.headerText'),
			message: i18n.t('register.failedAuthModal.message')
		});
	}
}

function* logoutUserSaga() {
	yield AsyncStorage.clear();
	yield all([
		put(clearUserDetails()),
		put(resetCreateOppState()),
		put(resetOppOverviewState()),
		put(sendIntroResetState()),
		put(clearInteractionState()),
		put(resetMyOppsState()),
		put(resetCrumbizUsersState())
	]);
}

function* forgotPasswordSaga({ payload }: IForgotPasswordPayload) {
	try {
		yield Auth.forgotPassword(payload);
		yield put(forgotPasswordSent());
		yield put(forgotPasswordSuccess());
	} catch (ex) {
		yield put(forgotPasswordError());
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: i18n.t('restorePassword.error.errorHeader'),
			message: i18n.t('restorePassword.error.errorText')
		});
	}
}

function* changePasswordSaga({
	payload: { NewPassword }
}: IChangePasswordPayload) {
	try {
		yield Auth.changePassword(NewPassword);
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: i18n.t('createNewPassword.doneStep.headerText'),
			message: i18n.t('createNewPassword.doneStep.fieldsDescription'),
			actionButtonText: i18n.t('createNewPassword.doneStep.actionButtonText'),
			onActionButtonPress: () =>
				navigationService.navigate(ScreensEnum.NEW_DASHBOARD)
		});
	} catch (ex) {
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: 'Error occurred',
			message: 'Please try again in few minutes'
		});
		throw new Error(ex);
	}
}

function* resetPasswordSaga({ payload }: IResetPasswordPayL) {
	try {
		const { password, code, email } = payload;
		const { succeeded } = yield Auth.resetPassword({ password, code, email });
		// if change password succeed the succeeded will return undefined - no response from db
		if (succeeded === false) {
			navigationService.navigate(ScreensEnum.MODAL, {
				headerText: 'Cannot create new password',
				message: 'Your credentials are not valid',
				onActionButtonPress: () => navigationService.navigate(ScreensEnum.LOGIN)
			});
			return;
		}
		navigationService.navigate(ScreensEnum.NEW_PASSWORD_ALL_SET);
	} catch (ex) {
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: 'Error occurred',
			message: 'Please try again in few minutes'
		});
		throw new Error(ex);
	}
}

function* refreshTokenSaga({ payload }: IRefreshTokenPayload) {
	try {
		// @ts-ignore
		const { accessToken, refreshToken } = Auth.refreshToken(
			payload.refreshToken
		);
		setTokenLocally(accessToken, refreshToken);
	} catch (ex) {
		navigationService.navigate(ScreensEnum.MODAL, {
			headerText: 'Error occurred',
			message: 'Please try again in few minutes'
		});
		throw new Error(ex);
	}
}

function* confirmRegisterationSaga({ payload }: IConfirmRegPayload) {
	const { email, code } = payload;
	try {
		// @ts-ignore
		const { succeeded, errors } = Auth.confirmRegisteration(email, code);
		// Need to build logic and connect to UI
		if (!succeeded) {
			//TODO Yaron - Failed to confirm registeration - need to check what we tell the user if there`s no success
		} else {
		}
	} catch (ex) {
		throw new Error(ex);
	}
}

export function* initAuthenticationFlowSaga() {
	try {
		const accessToken = yield AsyncStorage.getItem('accessToken');

		if (!accessToken) {
			yield put(clearUserDetails());

			return;
		}

		setCrumbizApiAuthorizationHeader(accessToken!);
		setAuthHeaders(accessToken!);
		yield getUserDetailsSaga({ payload: accessToken });
	} catch (ex) {
		yield put(clearUserDetails());
	}
}

//------------------------------------//
//  Helpers Sagas                     //
//------------------------------------//
function* setTokenLocally(accessToken: string, refreshToken: string) {
	try {
		setCrumbizApiAuthorizationHeader(accessToken);
		yield AsyncStorage.setItem('accessToken', accessToken);
		yield AsyncStorage.setItem('refreshToken', refreshToken);
	} catch (ex) {
		throw new Error(ex);
	}
}

export function* watchAuthSaga() {
	yield all([
		takeLatest(AuthActionTypes.LOGIN as any, loginSaga),
		takeLatest(AuthActionTypes.REGISTER as any, registerSaga),
		takeLatest(AuthActionTypes.REFRESH_TOKEN as any, refreshTokenSaga),
		takeLatest(AuthActionTypes.FORGOT_PASSWORD as any, forgotPasswordSaga),
		takeLatest(AuthActionTypes.CHANGE_PASSWORD as any, changePasswordSaga),
		takeLatest(AuthActionTypes.GET_USER_DETAILS as any, getUserDetailsSaga),
		takeLatest(AuthActionTypes.LOGOUT_USER as any, logoutUserSaga),
		takeLatest(AuthActionTypes.RESET_PASSWORD as any, resetPasswordSaga),
		takeLatest(
			AuthActionTypes.INIT_AUTHENTICATION_FLOW as any,
			initAuthenticationFlowSaga
		),
		takeLatest(
			AuthActionTypes.CONFIRM_REGISTERATION as any,
			confirmRegisterationSaga
		)
	]);
}
