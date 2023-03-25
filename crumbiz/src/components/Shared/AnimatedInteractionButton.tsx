import React, { FC, useCallback, useRef } from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';
import useContentExpandContext from '../../hooks/useContentExpandContext';
import useEffectAfterMount from '../../hooks/useEffectAfterMount';
import useInterpolationGroup from '../../hooks/useInterpolationGroup';
import { InteractionMenuOptionsEnum } from '../../types/enums';

interface IProps {
	isVisible: boolean;
	onPress: Function;
	icon: React.ReactElement;
	color: string;
	value: number;
}

const InteractionButton: FC<IProps> = props => {
	const { isVisible, onPress, color, icon, value } = props;
	const animated = useRef(new Animated.Value(0)).current;
	const expandTargetProfile = useContentExpandContext();

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: Number(isVisible),
			useNativeDriver: true
		}).start();
	}, [isVisible]);

	const interpolationGroup = useInterpolationGroup({
		animatedValue: animated,
		inputRange: [0, 1],
		groups: {
			scale: [0, 1],
			opacity: [0, 1]
		}
	});

	const onPressButton = useCallback(() => {
		let targetValue;
		const { toggleExpanded } = expandTargetProfile;
		if (isVisible) {
			targetValue = null;
		} else {
			targetValue = value;
		}
		toggleExpanded(
			value !== null &&
				!isVisible &&
				value !== InteractionMenuOptionsEnum.CALENDAR
		);
		onPress(targetValue);
	}, [isVisible, onPress, expandTargetProfile, value]);

	return (
		<S.InteractionButton onPress={onPressButton}>
			<S.ColoredInteractionView
				pointerEvents='none'
				style={{
					transform: [{ scale: interpolationGroup.scale }],
					opacity: interpolationGroup.opacity,
					backgroundColor: color
				}}
			/>
			<S.IconContainer pointerEvents='none'>{icon}</S.IconContainer>
		</S.InteractionButton>
	);
};

const S: any = {};

S.InteractionButton = styled.TouchableOpacity`
	width: 29%;
	aspect-ratio: 1.266;
	border-radius: 37;
	align-items: center;
	justify-content: center;
	overflow: hidden;
`;

S.ColoredInteractionView = styled(Animated.View)`
	position: absolute;
	width: 100%;
	height: 100%;
`;

S.IconContainer = styled.View`
	justify-content: center;
	align-items: center;
`;

export default InteractionButton;
