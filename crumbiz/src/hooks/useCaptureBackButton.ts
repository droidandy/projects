import { BackHandler } from 'react-native';
import { PlainFunction } from '../types/interfaces';
import { useCallback, useEffect, useRef } from 'react';

const useCaptureBackButton = (_shouldHandle: boolean, cb: PlainFunction) => {
	const shouldHandle = useRef(_shouldHandle);
	shouldHandle.current = _shouldHandle;

	const handleBackButton = useCallback(() => {
		if (shouldHandle.current) {
			cb();
			return true;
		}

		return false;
	}, []);

	useEffect(() => {
		BackHandler.addEventListener('hardwareBackPress', handleBackButton);
		return () =>
			BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
	}, []);
};

export default useCaptureBackButton;
