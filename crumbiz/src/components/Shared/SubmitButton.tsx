import React from 'react';
import styled from 'styled-components/native';
import LinearGradient, { LinearGradientProps } from 'react-native-linear-gradient';
import { calcHeight, calcWidth } from '../../utils/dimensions';
import CustomText from './CustomText';
import { IStyle, ITheme, PlainFunction } from '../../types/interfaces';
import { useTranslation } from 'react-i18next';
import { IColors, IFontSizes, IGradients } from '../../types/styled';
import { useTheme } from '../../hooks';

const linearGradientProps = {
	start: { x: 0, y: 0 },
	end: { x: 1, y: 1 },
	angle: 255
};

interface IProps extends IStyle {
	backgroundColor?: string | keyof IColors;
	textColor?: string;
	text?: string;
	disabled?: boolean;
	icon?: React.StatelessComponent;
	height?: number;
	width?: number | string;
	upperCase?: boolean;
	onPress: PlainFunction;
	variant?: 'dark' | 'light';
	withBottomGap?: boolean;
	rounded?: boolean;
	gradientBackground?: keyof IGradients;
	gradientProps?: Partial<LinearGradientProps>;
	textSize?: keyof IFontSizes;
	applyRatio?: boolean;
}

const Button: React.FC<IProps> = props => {
	const {
		text,
		icon: Icon,
		onPress,
		style,
		gradientBackground,
		gradientProps,
		disabled,
		...rest
	} = props;
	const { t } = useTranslation();
	const theme = useTheme();

	const children = (
		<>
			{Icon && (
				<S.IconContainer>
					<Icon />
				</S.IconContainer>
			)}
			<S.Text color='white' bold text={text} />
		</>
	);
	const gradientSettings = { ...linearGradientProps, ...gradientProps };
	return (
		<S.Touchable {...rest} onPress={onPress} style={style} disabled={disabled}>
			{gradientBackground ? (
				<S.Gradient
					{...gradientSettings}
					colors={
						disabled
							? theme.gradients.gray2
							: theme.gradients[gradientBackground]
					}
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
	withBottomGap: false
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
		applyRatio
	}: IProps & ITheme) => `
	${sharedStyles};
	width: ${width}; 
	max-width: 100%;
	background-color: ${backgroundColor ||
		theme!.colors.button[variant!].backgroundColor};
	border-radius: 5px;
	align-self: center;
	margin-top: auto;
	overflow: hidden;
	
	

	${withBottomGap &&
		`
		margin-bottom: ${theme.actionButtonMarginBottom};
	`};
	
	${rounded &&
		`
		border-radius: 30;
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
	left: 29px;
`;

export default Button;

S.Text = styled(CustomText)`
	color: white;
`;
