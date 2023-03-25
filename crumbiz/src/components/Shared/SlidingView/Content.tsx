import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { ISlidingViewContext, SlidingViewContext } from './SlidingView';
import { IFunctionChildren } from '../../../types/interfaces';
import { Animated } from 'react-native';
import { deviceWidth } from '../../../utils/dimensions';

interface IProps extends IFunctionChildren<Partial<ISlidingViewContext>> {}
const Content: React.FC<IProps> = props => {
	const { animated, setModalOpen } = useContext<ISlidingViewContext>(
		SlidingViewContext
	);

	const translateXInterpolation = animated!.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -(deviceWidth / 3)]
	});

	const containerStyle = {
		transform: [{ translateX: translateXInterpolation }]
	};

	return (
		<S.Container style={containerStyle}>
			{props.children({ setModalOpen })}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(Animated.View)`
	flex: 1;
`;

export default Content;
