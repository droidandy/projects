import React from 'react';
import styled from 'styled-components/native';
import { IColors, IFontSizes } from '../../types/styled';
import { ITheme, ITouchableProps } from '../../types/interfaces';
import { useTheme } from '../../hooks';
import { TextProps, TouchableOpacity, Platform } from 'react-native';
import {
	deviceWidth,
	deviceHeight,
	calcHeight
} from '../../utils/dimensions';

type CustomTextExtendedProps = TextProps & ITouchableProps;
interface IProps extends CustomTextExtendedProps {
	variant?: 'dark' | 'light';
	color?: keyof IColors;
	bold?: boolean;
	size?: keyof IFontSizes;
	light?: boolean;
	text?: string;
	withLeftGap?: boolean;
	withRightGap?: boolean;
	withTopGap?: boolean;
	withBottomGap?: boolean;
	withHorizontalGap?: boolean;
	center?: boolean;
	lineHeight?: number;
}

type fontByPlatformType = { [key: string]: { [key: string]: string } };

export const getFontNameByPlatform = (
	bold: boolean | undefined,
	light: boolean | undefined
) => {
	const fontsByPlatform: fontByPlatformType = {
		ios: {
			POPPINS_REGULAR: 'Poppins-Regular',
			POPPINS_MEDIUM: 'Poppins-Medium',
			POPPINS_LIGHT: 'Poppins-Light'
		},
		android: {
			POPPINS_REGULAR: 'POPPINS_REGULAR',
			POPPINS_MEDIUM: 'POPPINS_MEDIUM',
			POPPINS_LIGHT: 'POPPINS_LIGHT'
		}
	};
	const platform = Platform.OS;

	let fontName;
	if (light) {
		fontName = 'POPPINS_LIGHT';
	} else if (bold) {
		fontName = 'POPPINS_MEDIUM';
	} else {
		fontName = 'POPPINS_REGULAR';
	}

	return fontsByPlatform[platform][fontName];
};

const CustomText: React.FC<IProps> = props => {
	const { text, color, variant, onPress, touchable, style, ...rest } = props;
	const theme = useTheme();

	if (props.withHorizontalGap) {
		rest.withRightGap = true;
		rest.withLeftGap = true;
	}

	const _color =
		theme.colors[color ? color : variant === 'light' ? 'white' : 'black'];
	const textToRender = (
		<S.Text style={[style, { color: _color }]} {...rest}>
			{text}
		</S.Text>
	);

	return touchable ? (
		// Todo Yonatan - please check why it works
		<TouchableOpacity style={style} onPress={onPress}>
			{textToRender}
		</TouchableOpacity>
	) : (
		textToRender
	);
};

CustomText.defaultProps = {
	variant: 'dark',
	size: 's16'
};

const S: any = {};
S.Text = styled.Text(
	({
		theme,
		bold,
		light,
		size,
		withLeftGap,
		withRightGap,
		withTopGap,
		withBottomGap,
		center,
		lineHeight
	}: IProps & ITheme) => `
	font-size: ${theme.fontSizes[size!]};
	font-family: ${getFontNameByPlatform(bold, light)};
	${lineHeight && `line-height:${calcHeight(lineHeight)}`};

	${withLeftGap &&
		`
		margin-left: ${deviceWidth * 0.025};
	`};
	
	${withRightGap &&
		`
		margin-right: ${deviceWidth * 0.025}
	`};

	${withTopGap &&
		`
		margin-top: ${deviceHeight * 0.05}
	`};

	${withBottomGap &&
		`
		margin-bottom: ${deviceHeight * 0.05}
	`};
	
	${center &&
		`
		text-align: center;
	`}
`
);

export default CustomText;
