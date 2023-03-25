import React from 'react';
import styled, { css } from 'styled-components/native';
import {
	calcFontSize,
	calcHeight,
	calcWidth,
	deviceWidth
} from '../../utils/dimensions';
import { IStyle, ITheme, PlainFunction } from '../../types/interfaces';
import { useTranslation } from 'react-i18next';
import LinearGradient, {
	LinearGradientProps
} from 'react-native-linear-gradient';
import { IColors, IFontSizes, IGradients } from '../../types/styled';
import { useTheme } from '../../hooks';
import { SvgProps } from 'react-native-svg';

interface IProps extends IStyle {
	backgroundColor?: string | keyof IColors;
	textColor?: string;
	text?: string;
	disabled?: boolean;
	icon?: React.StatelessComponent;
	height?: number;
	width?: number;
	upperCase?: boolean;
	onPress: PlainFunction;
	variant?: 'dark' | 'light';
	withBottomGap?: boolean;
	rounded?: boolean;
	gradientBackground?: keyof IGradients;
	textSize?: number;
	applyRatio?: boolean;
	borderRadius?: string;
	alignSelf?: string;
	textAlign?: string;
	textWeight?: string;
	gradientProps?: Partial<LinearGradientProps>;
	iconProps?: SvgProps;
}

const Button: React.FC<IProps> = props => {
	const {
		text,
		icon: Icon,
		onPress,
		style,
		gradientBackground,
		gradientProps,
		iconProps,
		...rest
	} = props;
	const { t } = useTranslation();
	const theme = useTheme();

	const children = (
		<>
			{Icon && (
				<S.IconContainer>
					<Icon {...iconProps} />
				</S.IconContainer>
			)}
			<S.Text {...rest}>{text}</S.Text>
		</>
	);

	return (
		<S.Touchable {...rest} onPress={onPress} style={style}>
			{gradientBackground ? (
				<S.Gradient
					colors={theme.gradients[gradientBackground]}
					{...gradientProps}
				>
					{children}
				</S.Gradient>
			) : (
				children
			)}
		</S.Touchable>
	);
};

Button.defaultProps = {
	height: calcHeight(60),
	width: calcWidth(310),
	variant: 'dark',
	upperCase: false,
	withBottomGap: false,
	borderRadius: '5px',
	textSize: 16,
	alignSelf: 'center',
	textAlign: 'center',
	gradientProps: {
		useAngle: true,
		angle: 270
	}
};

const S: any = {};
const sharedStyles = `
	align-items: center;
	justify-content: center;
	flex-direction: row;
`;

S.Touchable = styled.TouchableOpacity(
	({
		width,
		height,
		variant,
		backgroundColor,
		theme,
		withBottomGap,
		rounded,
		applyRatio,
		borderRadius,
		alignSelf
	}: IProps & ITheme) => `
	${sharedStyles};
	width: ${width}; 
	max-width: 100%;
	background-color: ${backgroundColor ||
		theme!.colors.button[variant!].backgroundColor};
	border-radius: ${borderRadius};
	align-self: ${alignSelf};
	margin-top: auto;
	overflow: hidden;

	${withBottomGap &&
		`
		margin-bottom: ${theme.actionButtonMarginBottom};
	`};
	
	${rounded &&
		`
		border-radius: 60px;
	`};
	
	${!applyRatio &&
		`
		height: ${height};
	`}; 
`
);

S.Gradient = styled(LinearGradient)`
	${sharedStyles};
	width: 100%;
	height: 100%;
`;

S.IconContainer = styled.View`
	position: absolute;
	left: ${deviceWidth * 0.1};
`;

S.Text = styled.Text(
	({
		textColor,
		upperCase,
		variant,
		disabled,
		theme,
		textSize,
		textAlign,
		textWeight
	}: IProps & ITheme) => `
	font-size: ${calcFontSize(textSize!)};
	text-align: ${textAlign};
	font-weight: ${textWeight || 'bold'};
	text-transform: ${upperCase ? 'uppercase' : 'none'};
	color: ${textColor || theme.colors.button[variant!].textColor};
	flex: 1;
	
	${disabled &&
		css`
			color: ${theme!.colors.halfWhite};
		`}
`
);

export default Button;
