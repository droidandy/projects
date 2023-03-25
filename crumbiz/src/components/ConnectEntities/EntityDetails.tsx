import React from 'react';
import styled from 'styled-components/native';

import { CircleImage, CustomText } from '../Shared';
import { useTheme } from '../../hooks';
import { EntityEnum } from '../../types/enums';
import { View } from 'react-native';
import {
	deviceWidth,
	calcWidth,
	deviceHeight,
	calcHeight
} from '../../utils/dimensions';
import { entityNameMapper } from '../../components/Shared/ModalAndDropdownContents/Mappers';

interface IProps {
	name: string;
	type: EntityEnum;
	size?: number;
	avatar: string;
	avatarType: string;
}
const EntityDetails: React.FC<IProps> = props => {
	const theme = useTheme();
	const { name, type, size, avatar, avatarType } = props;
	return (
		<S.Container>
			<View>
				<S.CircleImage
					size={size ? calcWidth(size) : calcWidth(100)}
					avatar={avatar}
					avatarType={avatarType}
					username={name}
				/>
			</View>
			<S.EntityTypeContainer>
				<S.EntityTypeLabel
					text={entityNameMapper[type]}
					color='white'
					size='s12'
					capitalize
				/>
			</S.EntityTypeContainer>
			<CustomText
				text={name}
				size='s14'
				style={{ maxWidth: deviceWidth * 0.3, marginTop: calcHeight(-5.1) }}
				center
				lineHeight={20}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	align-self: flex-start;
	justify-content: center;
	align-items: center;
`;

S.EntityTypeContainer = styled.View`
	background-color: ${({ theme }) => theme.colors.blue};
	align-items: center;
	justify-content: center;
	border-radius: 4;
	transform: translateY(-${deviceHeight * 0.015}px);
`;

S.CircleImage = styled(CircleImage)`
	border-color: white;
	border-width: 5;
`;

S.EntityTypeLabel = styled(CustomText)`
	text-transform: capitalize;
	line-height: 18;
	padding-horizontal: ${calcWidth(13)};
	padding-vertical: ${calcHeight(5)};
`;

export default EntityDetails;
