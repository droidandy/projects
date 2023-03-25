import crumbizApi from './crumbizInstance';
import authApi from './authInstance';

export const setCrumbizApiAuthorizationHeader = (token: string | null) => {
	crumbizApi.defaults.headers.common.Authorization = token
		? `Bearer ${token}`
		: null;
};

export const setAuthHeaders = (token: string | null) => {
	authApi.defaults.headers.common.Authorization = token
		? `Bearer ${token}`
		: null;
};

/*
 * Display network logs in react-native-devtools
 * */
declare var GLOBAL: any;
XMLHttpRequest = GLOBAL.originalXMLHttpRequest
	? GLOBAL.originalXMLHttpRequest
	: GLOBAL.XMLHttpRequest;
