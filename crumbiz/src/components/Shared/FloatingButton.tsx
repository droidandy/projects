import React from 'react';
import styled from 'styled-components/native';
import { calcHeight, calcWidth, deviceWidth } from '../../utils/dimensions';
import { createCircle, createShadow } from '../../utils';
import { IColors, IGradients } from '../../types/styled';
import LinearGradient, {
	LinearGradientProps
} from 'react-native-linear-gradient';
import { useTheme } from '../../hooks';
import { PlainFunction } from '../../types/interfaces';
import Icons from './Icons';

interface IProps {
	onPress: PlainFunction;
	gradientBackground?: keyof IGradients;
	backgroundColor?: keyof IColors;
	distanceFromBottom?: number;
	isActive?: boolean;
	gradientProps?: Partial<LinearGradientProps>;
}
const FloatingButton: React.FC<IProps> = props => {
	const theme = useTheme();
	const {
		backgroundColor,
		gradientBackground,
		distanceFromBottom = 50,
		isActive,
		gradientProps,
		children,
		...rest
	} = props;
	return (
		<S.Container
			backgroundColor={theme.colors[backgroundColor!]}
			distanceFromBottom={distanceFromBottom}
			onPress={props.onPress}
			{...rest}
		>
			{gradientBackground && (
				<S.Gradient
					colors={theme.gradients[props.gradientBackground!]}
					{...gradientProps}
				>
					{children || <S.PlusIcon active={isActive} fill='white' />}
				</S.Gradient>
			)}
			{!gradientBackground &&
				(children || <S.PlusIcon active={isActive} fill='white' />)}
		</S.Container>
	);
};

type containerType = { distanceFromBottom: number; backgroundColor?: string };
type iconType = { active?: boolean };

const S: any = {};
S.Container = styled.TouchableOpacity<containerType>`
	position: absolute;
	right: ${calcWidth(25)};
	transform: translateY(
		-${({ distanceFromBottom }) => calcHeight(distanceFromBottom)}px
	);
	bottom: 0;
	${({ backgroundColor }) =>
		backgroundColor && `background-color: ${backgroundColor}`};
	align-items: center;
	justify-content: center;
	${createCircle(deviceWidth * 0.16666666666)};
	overflow: hidden;
	${createShadow()};
`;

S.Gradient = styled(LinearGradient)`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

S.PlusIcon = styled(Icons.PlusStrippedIcon)<iconType>`
	${({ active }) => active && `transform: rotate(45deg)`};
`;

export default FloatingButton;
