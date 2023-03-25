import React from 'react';
import { IStyle } from '../../types/interfaces';
import LinearGradient from 'react-native-linear-gradient';
import styled from 'styled-components/native';
import { useTheme } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';

interface IProps extends IStyle {}

const FadedWhiteGradient: React.FC<IProps> = props => {
	const theme = useTheme();

	return (
		<S.Gradient
			colors={theme.gradients.white1}
		/>
	);
};

const S: any = {};
S.Gradient = styled(LinearGradient)`
	width: ${deviceWidth};
	height: ${deviceHeight * 0.0890625};
	position: absolute;
	left: 0;
	bottom: 0;
	border-top-left-radius: 10;
	border-top-right-radius: 10;
`;

export default FadedWhiteGradient;
