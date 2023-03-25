import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import BaseHeader from './BaseHeader';
import { CircleImage } from '../../../Shared';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../../../utils/dimensions';
import { useTheme } from '../../../../hooks';
import { getUserPortfolio } from '../../utils';

interface IProps {
	interaction: IVInteraction;
	children?: React.ReactNode;
	styles: any,
	idProperty: string;
	icon: React.FC<any>;
}

const imageSize = deviceWidth * 0.16944;
const GoodToGoHeader: React.FC<IProps> = (props) => {
	const { interaction, styles, icon: Icon } = props;
	const theme = useTheme();
	const fromUserData = getUserPortfolio(interaction.ownerUserId);
	const toUserData = getUserPortfolio(interaction.targetUserId);

	return (
		<BaseHeader {...props}>
			<S.Container>
				<S.CircleImageWrapper>
					<CircleImage size={imageSize} {...toUserData} />
				</S.CircleImageWrapper>
				<S.IconWrapper>
					<Icon width={23} height={23} backgroundColor={theme.gradients.blue[0]} />
				</S.IconWrapper>
				<S.CircleImageWrapper>
					<CircleImage size={imageSize} {...fromUserData} />
				</S.CircleImageWrapper>
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
	display: flex;
	align-items: center;
	justify-content: center;
	margin-left: -10;
	margin-right: -10;
	width: ${deviceWidth * 0.1};
	height: ${deviceWidth * 0.1};
	padding-horizontal: 5;
	padding-vertical: 5;
	transform: rotate(90deg);
	z-index: 2;
`;

S.CircleImageWrapper = styled.View`
	border-radius: 200px;
	border: 2px solid ${({ theme }) => theme.colors.white};
`

export default GoodToGoHeader;
