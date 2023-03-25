import React from 'react';
import styled, { css } from 'styled-components/native';
import { IStyle, ITheme, ITouchableProps } from '../../types/interfaces';
import { createCircle } from '../../utils';
import { moderateScale } from '../../utils/dimensions';
import { IColors, IGradients } from '../../types/styled';
import { useTheme } from '../../hooks';

import LinearGradient from 'react-native-linear-gradient';

const linearGradientProps = {
	start: { x: 1, y: 0 },
	end: { x: 0, y: 1 },
	angle: 255
};

interface IProps extends IStyle, ITouchableProps {
	size: number;
	icon: React.StatelessComponent | string;
	backgroundColor?: string;
	gradientColor?: keyof IGradients;
	fill?: keyof IColors;
	iconSize?: number;
	borderRadius?: number;
}
const RoundedIcon: React.FC<IProps> = props => {
	const theme = useTheme();
	const {
		size,
		iconSize,
		style = {},
		icon: Icon,
		fill,
		backgroundColor,
		touchable,
		onPress,
		gradientColor,
		borderRadius
	} = props;
	const _iconSize = iconSize ? iconSize : size / 2;

	// @ts-ignore
	const icon = (
		// @ts-ignore
		<Icon fill={theme.colors[fill]} height={_iconSize} width={_iconSize} />
	);
	const containerProps = {
		style: [style, { backgroundColor }],
		size,
		borderRadius
	};

	const iconWithGradient = props.gradientColor ? (
		<S.Gradient
			{...linearGradientProps}
			colors={theme.gradients[gradientColor!]}
		>
			{icon}
		</S.Gradient>
	) : (
		icon
	);

	return touchable ? (
		<S.TouchableContainer onPress={onPress} {...containerProps}>
			{iconWithGradient}
		</S.TouchableContainer>
	) : (
		<S.Container {...containerProps}>{iconWithGradient}</S.Container>
	);
};

const S: any = {};
type Props = Partial<IProps> & ITheme;
/*
 * For some odd reason, using { css } from styled-components/native will add
 * "," before and after border-radius value.
 * */
const sharedContainerStyles = ({ size, borderRadius }: Props) => `
	display: flex;
	justify-content: center;
	align-items: center;
	width: ${moderateScale(size!)};
	height: ${moderateScale(size!)};
	border-radius: ${borderRadius ? borderRadius : moderateScale(size! / 2)};
	overflow: hidden;
`;

S.Container = styled.View(
	props => `
	${sharedContainerStyles(props as Props)}
`
);

S.TouchableContainer = styled.TouchableOpacity(
	props => `
	${sharedContainerStyles(props as Props)}
`
);

S.Gradient = styled(LinearGradient)`
	align-items: center;
	justify-content: center;
	width: 100%;
	height: 100%;
`;

export default RoundedIcon;
