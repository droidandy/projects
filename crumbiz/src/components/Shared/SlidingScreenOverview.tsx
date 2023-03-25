import React, { useRef } from 'react';
import styled from 'styled-components/native';
import { Animated } from 'react-native';
import { useEffectAfterMount, useTheme } from '../../hooks';
import { IGradients } from '../../types/styled';
import CustomText from './CustomText';
import LinearGradient from 'react-native-linear-gradient';
import { deviceWidth } from '../../utils/dimensions';
import { IChildren } from '../../types/interfaces';
import { createShadow } from '../../utils';

interface IProps extends IChildren {
	visible: boolean;
	gradientBackground?: keyof IGradients;
	text?: string;
	textVariant?: 'light' | 'dark';
}

const SlidingScreenOverview: React.FC<IProps> = props => {
	const {
		visible,
		text,
		gradientBackground = 'white',
		textVariant = 'dark'
	} = props;
	const animated = useRef(new Animated.Value(0)).current;
	const theme = useTheme();

	const translateYInterpolation = animated.interpolate({
		inputRange: [0, 1],
		outputRange: [-100, 0]
	});

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: Number(visible),
			useNativeDriver: true,
			bounciness: 2
		}).start();
	}, [visible]);

	return (
		<S.Container
			style={{ transform: [{ translateY: translateYInterpolation }] }}
		>
			<S.Content colors={theme.gradients[gradientBackground]}>
				{props.children ? (
					props.children
				) : (
					<CustomText
						text={text}
						size='s16'
						variant={textVariant}
						numberOfLines={1}
					/>
				)}
			</S.Content>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(Animated.View)`
	aspect-ratio: 6;
	z-index: 20;
	width: 100%;
	border-bottom-left-radius: 20;
	position: absolute;
	top: 0;
	overflow: hidden;
	${createShadow()};
`;

S.Content = styled(LinearGradient)`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	padding-horizontal: ${deviceWidth * 0.036};
`;

export default SlidingScreenOverview;
