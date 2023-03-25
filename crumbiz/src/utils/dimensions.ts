import { Dimensions, PixelRatio } from 'react-native';

export const deviceWidth = Dimensions.get('window').width;
export const deviceHeight = Dimensions.get('window').height;

export const heightPixelRatio = (amount: number) =>
	PixelRatio.roundToNearestPixel(deviceHeight * amount);
export const widthPixelRatio = (amount: number) =>
	PixelRatio.roundToNearestPixel(deviceWidth * amount);

// Takes pixel of design and converts them to percents.
export const convertHeightPixelsToPercent = (heightInPx: number) =>
	heightInPx / 640;
export const convertWidthPixelsToPercent = (widthInPx: number) =>
	widthInPx / 360;

// Combine the above functions to use in styles

export const calcHeight = (px: number) => {
	return heightPixelRatio(convertHeightPixelsToPercent(px));
};

export const calcWidth = (px: number) =>
	widthPixelRatio(convertWidthPixelsToPercent(px));

const baseWidth = 360;
const baseHeight = 640;

const scaleWidth = deviceWidth / baseWidth;
const scaleHeight = deviceHeight / baseHeight;
let scale = Math.min(scaleWidth, scaleHeight);

const { width, height } = Dimensions.get('window');
const [shortDimension, longDimension] =
	width < height ? [width, height] : [height, width];

//Default guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 360;
const guidelineBaseHeight = 640;

export const scale1 = (size: number) =>
	(shortDimension / guidelineBaseWidth) * size;
export const verticalScale = (size: number) =>
	(longDimension / guidelineBaseHeight) * size;
export const moderateScale = (size: number, factor = 0.5) =>
	size + (scale1(size) - size) * factor;

const fontScale = Math.min(scaleWidth, scaleHeight);
export const calcFontSize = (size: number) => size * fontScale;
export const headerMenuHeight = deviceHeight * 0.0921;
