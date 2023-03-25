import createAuthRefreshInterceptor from 'axios-auth-refresh';
import store from '../../store/store';
import AsyncStorage from '@react-native-community/async-storage';
import Auth from './Auth';
import { clearUserDetails } from '../../store/actions/authActions';
import authApi from './authInstance';
import crumbizApi from './crumbizInstance';

// This is the login if we get error code 401, it try to refresh the token and send the original request again.
// @ts-ignore
const refreshAuthLogic = failedRequest =>
	AsyncStorage.getItem('refreshToken')
		.then(refreshToken => Auth.refreshToken(refreshToken!))
		.then(refreshTokenResponse => {
			AsyncStorage.setItem('accessToken', refreshTokenResponse.accessToken);
			AsyncStorage.setItem('refreshToken', refreshTokenResponse.refreshToken);
			failedRequest.response.config.headers['Authorization'] =
				'Bearer ' + refreshTokenResponse.accessToken;
			return Promise.resolve();
		})
		.catch(e => {
			store.dispatch(clearUserDetails());
			return Promise.reject(e);
		});

// @ts-ignore
createAuthRefreshInterceptor(crumbizApi, refreshAuthLogic);

/*
 * Instead of throwing JS error object, throw the server error response.
 * */
[authApi, crumbizApi].forEach(api => {
	api.interceptors.response.use(
		response => {
			return response;
		},
		function(ex) {
			// This check for 404 and Utils/exists made for a second api call to check if the phone exists (we dont want reject if its a 404 code).
			const statusCodeIs404 = ex.response.status === 404;
			const isUtilExistsPath = ex.response.config.url
				.toLowerCase()
				.includes('utils/exists');

			if (statusCodeIs404 && isUtilExistsPath) {
				return Promise.resolve(false);
			}
			return Promise.reject(ex.response);
		}
	);
});
