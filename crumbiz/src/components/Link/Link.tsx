import React, { FC } from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../Shared';
import { IColors, IFontSizes } from '../../types/styled';

interface IProps {
	text: string;
	onPress?: () => void;
	textSize?: keyof IFontSizes;
	textColor?: keyof IColors;
}

const Link: FC<IProps> = props => {
	const { text, onPress, textSize } = props;
	return (
		<S.Button onPress={onPress}>
			<CustomText text={text} size={textSize ? textSize : 's15'} />
		</S.Button>
	);
};

const S: any = {};
Link.defaultProps = {
	textColor: 'black'
}

S.Button = styled.TouchableOpacity``;

export default Link;
