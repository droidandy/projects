import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated } from 'react-native';
import { AnimatedValue } from 'react-navigation';
import { useCaptureBackButton, useEffectAfterMount } from '../../../hooks';
import { StateUpdaterFunction } from '../../../types/interfaces';

export interface ISlidingViewContext {
	animated?: AnimatedValue;
	setModalOpen?: StateUpdaterFunction<boolean>;
	isModalOpen?: boolean;
}

export const SlidingViewContext = React.createContext<ISlidingViewContext>({});

interface IProps {}
const SlidingView: React.FC<IProps> = props => {
	const [isModalOpen, setModalOpen] = useState(false);
	const animated = useRef(new Animated.Value(0)).current;
	const _setModalOpen = useCallback(bool => setModalOpen(bool), []);
	useCaptureBackButton(isModalOpen, () => {
		setModalOpen(false);
	});

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: isModalOpen ? 1 : 0,
			useNativeDriver: true
		}).start();
	}, [isModalOpen]);

	return (
		<SlidingViewContext.Provider
			value={{
				animated,
				setModalOpen: _setModalOpen,
				isModalOpen
			}}
		>
			{props.children}
		</SlidingViewContext.Provider>
	);
};

export default SlidingView;
