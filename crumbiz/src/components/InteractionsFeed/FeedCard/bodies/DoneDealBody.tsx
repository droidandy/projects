import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import styled from 'styled-components/native';
import { extractAvatarFromUser, removeHTMLTags } from '../../../../utils';
import { CircleImage, CustomText } from '../../../Shared';
import { deviceHeight, deviceWidth } from '../../../../utils/dimensions';
import { IBodyStyles } from './BaseBody';

interface IProps {
	interaction: IVInteraction;
	styles?: IBodyStyles;
};

const DoneDealBody: React.FC<IProps> = (props) => {
	const { interaction, styles = {} } = props;

	const userData: any = interaction.fromUserId;
	const username = `${userData.firstName || 'N'} ${userData.lastName || 'A'}`;
	const [avatar, avatarType] = extractAvatarFromUser(userData);

	return (
		<S.Container>
			{interaction.subject && (
				<S.Jumbotron>
					<S.CircleImageWrapper>
						<CircleImage avatar={avatar} avatarType={avatarType} size={61} username={username} />
					</S.CircleImageWrapper>
					<S.TextWrapper>
						<CustomText
							text={removeHTMLTags(interaction.subject)}
							color={styles.color}
							size="s14"
							bold={styles.fontWeight === 'bold'}
						/>
					</S.TextWrapper>
				</S.Jumbotron>
			)}
		</S.Container>
	)
}

const S: any = {};
S.Container = styled.View`
	flex: 1;
	margin-top: ${deviceHeight * 0.028125};
`;

S.Jumbotron = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	margin-bottom: ${deviceHeight * 0.034375};
`;

S.CircleImageWrapper = styled.View`
	border-radius: 200px;
	border: 2px solid ${({ theme }) => theme.colors.white};
`

S.TextWrapper = styled.View`
 padding-left: ${deviceWidth * 0.05555555555};
 padding-right: 100;
`

export default DoneDealBody;
