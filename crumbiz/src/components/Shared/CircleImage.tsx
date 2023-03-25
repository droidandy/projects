import React from 'react';
import styled from 'styled-components/native';
import { IStyle } from '../../types/interfaces';

import extractInitials from '../../utils/extractInitials';

interface IProps extends IStyle {
	avatar?: string;
	avatarType?: string;
	size?: number;
	username?: string;
}

const CircleImage: React.FC<IProps> = props => {
	const { avatar, avatarType, size, style, username } = props;
	const base64Image = `data:${avatarType};base64,${avatar}`;

	if (avatar && avatarType) {
		return <S.Image size={size} source={{ uri: base64Image }} style={style} />;
	}
	return (
		<S.DefaultAvatar size={size} style={style}>
			<S.Text size={size}>{extractInitials(username)}</S.Text>
		</S.DefaultAvatar>
	);
};

const S: any = {};
S.Image = styled.Image`
	width: ${({ size }: Partial<IProps>) => size};
	aspect-ratio: 1;
	border-radius: 200px;
`;

S.DefaultAvatar = styled.View`
	width: ${({ size }: Partial<IProps>) => size};
	aspect-ratio: 1;
	border-radius: 200px;
	background: ${({ theme }) => theme.colors.gray7};
	justify-content: center;
	align-items: center;
`;

S.Text = styled.Text`
	color: ${({ theme }) => theme.colors.white};
	font-size: ${({ size }: Partial<IProps>) => size! * 0.3};
`;

export default CircleImage;
