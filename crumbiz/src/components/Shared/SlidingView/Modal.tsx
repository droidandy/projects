import React, { useContext } from 'react';
import styled from 'styled-components/native';
import { ISlidingViewContext, SlidingViewContext } from './SlidingView';
import { IChildren } from '../../../types/interfaces';
import { calcHeight, calcWidth, deviceWidth } from '../../../utils/dimensions';
import { Animated, TouchableOpacity } from 'react-native';
import Icons from '../Icons';

interface IProps extends IChildren {}
const Modal: React.FC<IProps> = props => {
	const { animated, setModalOpen } = useContext<ISlidingViewContext>(
		SlidingViewContext
	);
	const translateXInterpolation = animated!.interpolate({
		inputRange: [0, 1],
		outputRange: [deviceWidth, 0]
	});

	const containerStyle = {
		transform: [{ translateX: translateXInterpolation }]
	};

	return (
		<S.Container style={containerStyle}>
			<S.CloseIconContainer onPress={() => setModalOpen!(false)}>
				<Icons.XIcon />
			</S.CloseIconContainer>
			{props.children}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled(Animated.View)`
	flex: 1;
	position: absolute;
	background: white;
	width: 100%;
	height: 100%;
`;

S.CloseIconContainer = styled.TouchableOpacity`
	position: absolute;
	top: ${calcHeight(13)};
	right: ${calcWidth(15)};
	padding: 10px;
	z-index: 3;
`;

export default Modal;
