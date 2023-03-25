import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { IChildren } from '../../types/interfaces';

interface IProps extends IChildren {
	visible: boolean;
	duration?: number;
	animationType?: 'spring' | 'timing';
}

const AnimatedOpacityView: React.FC<IProps> = props => {
	const { visible, duration, animationType, children } = props;
	const animated = useRef(new Animated.Value(Number(visible))).current;

	useEffect(() => {
		const animationConfig = {
			toValue: Number(visible)
		};

		if (animationType === 'timing') {
			Object.assign(animationConfig, { duration });
		}

		Animated[animationType!](animated, animationConfig).start();
	}, [visible]);

	return (
		<Animated.View
			pointerEvents={visible ? 'auto' : 'none'}
			style={{ opacity: animated }}
		>
			{children}
		</Animated.View>
	);
};

AnimatedOpacityView.defaultProps = {
	duration: 200,
	animationType: 'spring'
};

export default AnimatedOpacityView;
