import { useEffect } from 'react';
import { useNavigation } from 'react-navigation-hooks';
import { PlainFunction } from '../types/interfaces';

const useNavigationFocus = (cb: PlainFunction) => {
	const navigation = useNavigation();

	useEffect(() => {
		const focusListener = navigation.addListener('willFocus', payload => {
			cb(payload);
		});
		return () => focusListener.remove();
	}, []);
};

export default useNavigationFocus;
