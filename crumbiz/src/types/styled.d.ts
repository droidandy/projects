import 'styled-components';

export interface IColors {
	mainBackgroundColor: string;
	linkedInButtonColor: string;
	facebookButtonColor: string;
	gray1: string;
	gray2: string;
	gray3: string;
	gray4: string;
	gray5: string;
	gray6: string;
	gray7: string;
	gray8: string;
	gray9: string;
	gray10: string;
	gray11: string;
	gray12: string;
	gray13: string;
	gray14: string;
	gray15: string;
	gray16: string;
	gray17: string;
	gray18: string;
	gray19: string;
	gray20: string;
	gray21: string;
	gray22: string;
	gray23: string;
	gray24: string;
	gray25: string;
	darkGray: string;
	halfWhite: string;
	black: string;
	blue: string;
	blue2: string;
	blue3: string;
	blue4: string;
	blue5: string;
	blackOpacity: string;
	white: string;
	purple1: string;
	purple2: string;
	yellow: string;
	orange: string;
	orange2: string;
	orange3: string;
	paleBlue1: string;
	paleBlue2: string;
	paleBlue3: string;
	babyBlue1: string;
	opacityPaleBlue1: string;
	lightBlue1: string;
	lightBlue2: string;
	lightBlue3: string;
	darkerBlue1: string;
	darkerBlue2: string;
	opacityDarkerBlue1: string;
	green1: string;
	green2: string;
	green3: string;
	red1: string;
	lightOrange: string;
	lightPurple2: string;
	opacityLightBlue: string;
}

export interface IFontSizes {
	s11: number;
	s12: number;
	s13: number;
	s14: number;
	s15: number;
	s16: number;
	s18: number;
	s20: number;
	s22: number;
	s24: number;
	s26: number;
	s27: number;
	s28: number;
	s32: number;
	s44: number;
	s52: number;
}

export interface IColorAndSize {
	color: keyof IColors;
	size: keyof IFontSizes;
}

type Gradient = Array<string>;
export interface IGradients {
	blue: Gradient;
	blue1: Gradient;
	purple: Gradient;
	orange: Gradient;
	white: Gradient;
	white1: Gradient;
	gray: Gradient;
	gray2: Gradient;
	darkGray: Gradient;
}

declare module 'styled-components' {
	interface IButtonColors {
		textColor: string;
		backgroundColor: string;
	}

	interface IButton {
		button: {
			dark: IButtonColors;
			light: IButtonColors;
		};
	}

	export interface DefaultTheme {
		colors: IColors & IButton;
		fontSizes: IFontSizes;
		gradients: IGradients;
		viewPaddingHorizontal: number;
		actionButtonMarginBottom: number;
	}
}
