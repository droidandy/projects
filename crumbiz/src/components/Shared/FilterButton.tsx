import React, { FC, useRef, useEffect, useState } from 'react';
import { TouchableOpacity, Animated } from 'react-native';
import { CustomText, Icons } from '../../components/Shared';
import { calcWidth } from '../../utils/dimensions';
import styled from 'styled-components/native';

interface IProps {
	isActive: boolean;
	onPress: () => void;
}
const FilterButton: FC<IProps> = props => {
	const { isActive, onPress } = props;
	const animated = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		Animated.spring(animated, {
			toValue: isActive ? 1 : 0,
			useNativeDriver: true
		}).start();
	}, [isActive]);

	const scaleX = animated.interpolate({
		inputRange: [0, 1],
		outputRange: [1, 1.2]
	});

	return (
		<S.Container style={{ transform: [{ scaleX }] }}>
			<S.FilterButton onPress={onPress}>
				<S.FilterIcon />
				<S.FilterButtonText text='Filter' />
			</S.FilterButton>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled(Animated.View)`
	width: ${calcWidth(85)};
	aspect-ratio: 2.42;
	border-radius: 18;
	overflow: hidden;
`;
S.FilterButton = styled(TouchableOpacity)`
	flex-direction: row;
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
	color: ${({ theme }) => theme.colors.black};
	background-color: ${({ theme }) => theme.colors.gray14};
`;
S.FilterIcon = styled(Icons.FilterIcon).attrs({
	width: calcWidth(10)
})`
	aspect-ratio: 1;
`;
S.FilterButtonText = styled(CustomText).attrs({
	size: 's13',
	lineHeight: 20
})`
	margin-left: ${calcWidth(4)};
`;

export default FilterButton;
