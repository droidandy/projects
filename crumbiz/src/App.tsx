import React, { useEffect, useMemo } from 'react';
import './locale/i18n';
import { useDispatch, useSelector } from 'react-redux';
import { usePushNotifications } from './hooks';
import { createRootNavigator } from './navigation';
import SplashScreen from 'react-native-splash-screen';
import { StatusBar } from 'react-native';
import { navigationService } from './services';
import { initAuthenticationFlow } from './store/actions/authActions';
import { createAppContainer, SafeAreaView } from 'react-navigation';
import { useDeepLinking } from './hooks/setup';
import { userAuthenticatedSelector } from './store/selectors/authSelector';

const App: React.FC = () => {
	const userAuthenticationStatus = useSelector(userAuthenticatedSelector);

	const dispatch = useDispatch();
	usePushNotifications();
	useDeepLinking();

	useEffect(() => {
		dispatch(initAuthenticationFlow());
	}, []);

	useEffect(() => {
		if (userAuthenticationStatus === null) return;
		SplashScreen.hide();
	}, [userAuthenticationStatus]);

	const Navigator = useMemo(() => {
		return createAppContainer(createRootNavigator(userAuthenticationStatus));
	}, [userAuthenticationStatus]);

	return (
		<>
			<StatusBar backgroundColor='#F2F2F2' barStyle='dark-content' />
			<SafeAreaView
				style={{ flex: 1 }}
				forceInset={{ bottom: 'never', horizontal: 'never' }}
			>
				{userAuthenticationStatus !== null && (
					<Navigator
						ref={navigatorRef => navigationService.setNavigator(navigatorRef)}
					/>
				)}
			</SafeAreaView>
		</>
	);
};

export default App;
