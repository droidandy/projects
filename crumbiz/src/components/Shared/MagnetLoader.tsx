import React, { FC, useRef, useEffect } from 'react';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { Animated } from 'react-native';
import { useInterpolationGroup } from '../../hooks';
import { useEffectAfterMount } from '../../hooks';
import { IStyle } from '../../types/interfaces';

interface IProps extends IStyle {}

const MagnetLoader: FC<IProps> = ({ style }) => {
	const animated = useRef(new Animated.Value(0)).current;

	const interpolationGroup = useInterpolationGroup(
		{
			animatedValue: animated,
			inputRange: [0, 1, 2, 3],
			groups: {
				rotate: ['0deg', '360deg', '360deg', '720deg'],
				scale: [0, 1, 1, 0],
				opacity: [0, 1, 1, 0]
			}
		},
		[]
	);

	useEffect(() => {
		runAnimation();
	}, []);

	const runAnimation = () => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(animated, {
					toValue: 1,
					duration: 500,
					useNativeDriver: true
				}),
				Animated.timing(animated, {
					toValue: 2,
					duration: 350,
					useNativeDriver: true
				}),
				Animated.timing(animated, {
					toValue: 3,
					duration: 500,
					useNativeDriver: true
				})
			])
		).start();
	};

	return (
		<S.LoaderContainer style={{ ...style }}>
			<Animated.Image
				style={{
					height: deviceHeight * 0.08,
					width: deviceWidth * 0.145,
					opacity: interpolationGroup.opacity,
					transform: [
						{ rotate: interpolationGroup.rotate },
						{ scale: interpolationGroup.scale }
					]
				}}
				source={require('../../assets/images/magnet.png')}
			/>
		</S.LoaderContainer>
	);
};

const S: any = {};

S.LoaderContainer = styled.View`
	align-items: center;
`;

export default MagnetLoader;
