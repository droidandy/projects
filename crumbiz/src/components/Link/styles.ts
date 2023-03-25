import styled from 'styled-components/native';
import { calcFontSize } from '../../utils/dimensions';

export const Button = styled.TouchableOpacity``;

export const Text = styled.Text`
	color: black;
	font-size: ${calcFontSize(15)};
	text-decoration: none;
`;
