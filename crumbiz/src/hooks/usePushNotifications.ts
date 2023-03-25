import { useSelector } from 'react-redux';
import {
	getUserDataSelector,
	userAuthenticatedSelector
} from '../store/selectors/authSelector';
import { useCallback, useEffect } from 'react';
import OneSignal from 'react-native-onesignal';
import { Keys } from '../services';
import { parseQueryParams } from '../utils';
import { redirectHandler } from '../navigation/branchDeeplinkHandler';

const usePushNotifications = () => {
	const userData = useSelector(getUserDataSelector);
	const userAuthenticationStatus = useSelector(userAuthenticatedSelector);

	const handleOpen = useCallback(
		(openResult: any) => {
			const { dl } = openResult.notification.payload.additionalData;

			const parsedDeepLink = parseQueryParams(dl);
			console.log(parsedDeepLink);
			redirectHandler(parsedDeepLink as any);
			if (dl && !openResult.notification.isAppInFocus) {
				// If disable is needed put the redirectHandler here
			}
		},
		[userAuthenticationStatus]
	);

	useEffect(() => {
		const removeHandlers = () => {
			OneSignal.removeEventListener('opened', handleOpen);
			OneSignal.deleteTag('id');
			console.log(`Removed user from OneSignal - { id: ${userData.id} }`);
		};

		if (userData.id) {
			OneSignal.init(Keys.ONE_SIGNAL_API_KEY);
			OneSignal.addEventListener('opened', handleOpen);
			OneSignal.sendTag('id', userData.id);
			console.log(`Added user to OneSignal - { id: ${userData.id} }`);
		} else {
			removeHandlers();
		}

		return removeHandlers;
	}, [userData.id]);
};

export default usePushNotifications;
