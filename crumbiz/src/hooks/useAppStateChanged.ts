import { PlainFunction } from '../types/interfaces';
import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

interface IParams {
	onForeground: PlainFunction;
	onBackground: PlainFunction;
}

const useAppStateChanged = (params: IParams) => {
	useEffect(() => {
		const eventsMapper = {
			background: params.onBackground,
			active: params.onForeground,
			inactive: () => {}
		};

		const handleAppStateChange = (nextAppState: AppStateStatus) => {
			console.log('NEXT APP STATE', { nextAppState });
			const cb = eventsMapper[nextAppState];
			if (cb && typeof cb === 'function') {
				eventsMapper[nextAppState]();
			}
		};

		AppState.addEventListener('change', handleAppStateChange);

		return () => AppState.removeEventListener('change', handleAppStateChange);
	}, []);
};

export default useAppStateChanged;
