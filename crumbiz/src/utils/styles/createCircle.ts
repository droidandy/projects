import { css } from 'styled-components/native';
import { moderateScale } from '../dimensions';

const createCircle = (radius: number) => {
	return css`
		width: ${moderateScale(radius)};
		height: ${moderateScale(radius)};
		border-radius: ${moderateScale(radius) / 2};
	`;
};

export default createCircle;
