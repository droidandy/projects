import React from 'react';
import { IUserData, IVInteraction } from '../../../../types/interfaces';
import BaseHeader from './BaseHeader';
import { CircleImage } from '../../../Shared';
import { extractAvatarFromUser } from '../../../../utils';
import styled from 'styled-components/native';
import { deviceHeight } from '../../../../utils/dimensions';
import { getUserPortfolio } from '../../utils';

interface IProps {
	interaction: IVInteraction;
	children?: React.ReactNode;
	styles: any,
	idProperty: string;
	icon: React.FC<any>;
}

const ConnectionHeader: React.FC<IProps> = (props) => {
	const { interaction, styles, icon: Icon } = props;
	const fromUserData = getUserPortfolio(interaction.fromUserId);
	const toUserData = getUserPortfolio(interaction.toUserId);

	return (
		<BaseHeader {...props}>
			<S.Container>
				<CircleImage size={styles.imageSize} {...toUserData} />
				<S.IconWrapper>
					<Icon width={16} height={16} style={{ marginLeft: -1 }} />
				</S.IconWrapper>
				<CircleImage size={styles.imageSize} {...fromUserData} />
			</S.Container>
		</BaseHeader>
	)
}

const S: any = {};

S.Container = styled.View`
	flex-direction: row;
	align-items: center;
	margin-bottom: ${deviceHeight * 0.01875};
`;

S.IconWrapper = styled.View`
	margin-left: 10;
	margin-right: 10;
	display: flex;
	justify-content: center;
	align-items: center;
`;

export default ConnectionHeader;
