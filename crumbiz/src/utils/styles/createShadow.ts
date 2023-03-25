import { Platform } from 'react-native';

interface ICreateShadowArgs {
	color?: string;
	opacity?: number;
	radius?: number;
	offsetWidth?: number;
	offsetHeight?: number;
	elevation?: number;
}

const createShadow = ({
	color = 'rgba(0, 0, 0, .3)',
	opacity = 0.15,
	radius = 2,
	offsetWidth = 0,
	offsetHeight = 0,
	elevation = 2
}: ICreateShadowArgs = {}) => {
	return Platform.select({
		ios: {
			shadowColor: color,
			shadowOpacity: opacity,
			shadowRadius: radius,
			shadowOffset: {
				width: offsetWidth,
				height: offsetHeight
			}
		},
		android: {
			elevation
		}
	});
};

export default createShadow;
