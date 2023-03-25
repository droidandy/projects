import { DefaultTheme } from 'styled-components';
import { calcFontSize } from '../utils/dimensions';

const colors = {
	mainBackgroundColor: '#F2F2F2',
	linkedInButtonColor: '#0274B3',
	facebookButtonColor: '#1976D2',
	gray1: '#8E8E8E',
	gray2: '#D8D8D8',
	gray3: '#A1A1A1',
	gray4: '#D6D6D6',
	gray5: '#E5E5E5',
	gray6: '#555555',
	gray7: '#AAAAAA',
	gray8: '#D5D5D5',
	gray9: '#8E8E8E',
	gray10: '#E6E6E6',
	gray11: '#EEEEEE',
	gray12: '#F1F3F8',
	gray13: '#A0A2A4',
	gray14: '#E8EBF1',
	gray15: '#808385',
	gray16: '#DFE0E1',
	gray17: '#C0C1C2',
	gray18: '#D6DDE9',
	gray19: '#CED4E0',
	gray20: '#4b4b4b',
	gray21: '#f5f5f5',
	gray22: '#9b9b9b',
	gray23: '#4a4a4a',
	gray24: '#e5e5e6',
	gray25: '#252525',
	darkGray: '#4E4E4E',
	yellow: '#fbc638',
	orange: '#F89D1F',
	orange2: '#FFB822',
	orange3: '#f5a623',
	lightOrange: 'rgba(248, 157, 31, 0.2)',
	blue: '#3C9CF0',
	blue2: '#076eff',
	blue3: '#c7daff',
	blue4: '#e6f0ff',
	blue5: '#2e8ae6',
	halfWhite: 'rgba(255, 255, 255, 0.5)',
	black: 'rgb(0, 0, 0)',
	blackOpacity: 'rgba(0, 0, 0, 0.5)',
	darkerBlackOpacity: 'rgba(0, 0, 0, 0.8)',
	white: 'rgb(255, 255, 255)',
	paleBlue1: '#A0B2D1',
	paleBlue2: '#8296B7',
	paleBlue3: '#CED4E1',
	babyBlue1: '#03A9F4',
	opacityPaleBlue1: 'rgba(160, 178, 209, 0.2)',
	purple1: '#3C56F0',
	purple2: '#6A80F7',
	lightPurple2: 'rgba(106, 128, 247, 0.2)',
	lightBlue1: '#03A1FD',
	lightBlue2: '#5AB7F6',
	lightBlue3: '#639AF3',
	opacityLightBlue: 'rgba(90, 183, 246, 0.2)',
	darkerBlue1: '#465D84',
	darkerBlue2: '#264594',
	opacityDarkerBlue1: 'rgba(70, 93, 132, 0.2)',
	green1: '#0ABB87',
	green2: '#7ed321',
	green3: '#24ad1c',
	red1: '#FD394D'
};

const defaultTheme: DefaultTheme = {
	colors: {
		...colors,
		button: {
			dark: {
				textColor: 'white',
				backgroundColor: colors.darkGray
			},
			light: {
				textColor: colors.darkGray,
				backgroundColor: colors.gray4
			}
		}
	},
	fontSizes: {
		s11: calcFontSize(11),
		s12: calcFontSize(12),
		s13: calcFontSize(13),
		s14: calcFontSize(14),
		s15: calcFontSize(15),
		s16: calcFontSize(16),
		s18: calcFontSize(18),
		s20: calcFontSize(20),
		s22: calcFontSize(22),
		s24: calcFontSize(24),
		s26: calcFontSize(26),
		s27: calcFontSize(27),
		s28: calcFontSize(28),
		s32: calcFontSize(32),
		s44: calcFontSize(44),
		s52: calcFontSize(52)
	},
	gradients: {
		blue: ['#3C56F0', '#3C9CF0'],
		blue1: ['#03A1FD', '#6AB9FF'],
		purple: ['#6D82FF', '#3C56F0'],
		orange: ['#FBC638', '#F77D0C'],
		white: ['#ffffff', '#ffffff'],
		white1: [
			'rgba(255, 255, 255, 0.1)',
			'rgba(255, 255, 255, 0.5)',
			'rgba(255, 255, 255, 0.8)',
			'rgba(255, 255, 255, 1)'
		],
		gray: ['#F3F3F3', '#EBEBEB'],
		gray2: ['#ECECEC', '#CCCCCC'],
		darkGray: ['#A0B2D1', '#465D84']
	},
	viewPaddingHorizontal: 25,
	actionButtonMarginBottom: 35
};

export default defaultTheme;
