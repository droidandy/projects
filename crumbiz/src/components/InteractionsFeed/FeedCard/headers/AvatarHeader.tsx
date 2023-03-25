import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import BaseHeader from './BaseHeader';
import { CircleImage } from '../../../Shared';
import { extractAvatarFromUser } from '../../../../utils';
import styled from 'styled-components/native';
import { deviceHeight } from '../../../../utils/dimensions';
import { getUserPortfolio } from '../../utils';

type IDProperty = 'fromUserId' | 'toUserId';
interface IProps {
	interaction: IVInteraction;
	children?: React.ReactNode;
	styles: any,
	idProperty: IDProperty;
	icon?: React.FC<any>;
}

const AvatarHeader: React.FC<IProps> = (props) => {
	const { interaction, idProperty, styles, icon: Icon } = props;
	const { username, avatar, avatarType } = getUserPortfolio(interaction[idProperty]);
	const iconStyles = styles.icon || {};

	return (
		<BaseHeader {...props}>
			<S.Container>
				<CircleImage avatar={avatar} avatarType={avatarType} size={styles.imageSize} username={username} />
				{Icon && (
					<S.IconWrapper>
						<Icon width={23} height={23} styles={iconStyles} />
					</S.IconWrapper>
				)}
			</S.Container>
		</BaseHeader>
	)
}

AvatarHeader.defaultProps = {
	idProperty: 'toUserId'
};

const S: any = {};

S.Container = styled.View`
	flex-direction: row;
	align-items: flex-end;
	margin-bottom: ${deviceHeight * 0.01875};
`;

S.IconWrapper = styled.View`
	position: absolute;
	left: 100%;
	bottom: 0;
	margin-left: -10;
	margin-bottom: -3;
`

export default AvatarHeader
