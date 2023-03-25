import React, { FC } from 'react';
import { View, Text } from 'react-native';
import styled from 'styled-components/native';
import { RoundedIcon, CustomText } from '../Shared';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { PlainFunction } from '../../types/interfaces';

interface IProps {
	title: string;
	icon: React.StatelessComponent;
	backgroundColor: string;
	size: number;
	iconSize: number;
	onPress: PlainFunction;
}

const ChoosePhotoMenuItem: FC<IProps> = ({ title, ...roundedIconProps }) => {
	return (
		<S.MenuItemContainer>
			<S.RoundedContainer
				{...roundedIconProps}
				fill='white'
				borderRadius={18}
				touchable
			/>
			<CustomText text={title} color='white' size='s11' />
		</S.MenuItemContainer>
	);
};

const S: any = {};

S.MenuItemContainer = styled.View`
	align-items: center;
	margin-top: ${deviceHeight * 0.04};
	flex: 1;
	width: ${deviceWidth * 0.045};
`;

S.RoundedContainer = styled(RoundedIcon)`
	margin-bottom: ${deviceHeight * 0.0125};
`;

export default ChoosePhotoMenuItem;
