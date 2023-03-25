import React, { useMemo } from 'react';
import styled from 'styled-components/native';
import { Image } from 'react-native';
import {
	ConnectionStatusEnum,
	OpportunityConnectorStatusesEnum
} from '../../../types/enums';
import { CircleImage, CustomText } from '../../Shared';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../hooks';
import { createCircle } from '../../../utils';
import { IConnectorDetails } from './Tabs/ConnectorsTab';

interface IProps {
	connectorDetails: IConnectorDetails;
}

const ProfileRowItem: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const theme = useTheme();
	const {
		connectorAvatar,
		connectorAvatarType,
		username,
		targetsLength,
		status
	} = props.connectorDetails;

	const introStatusMapper = useMemo(
		() => ({
			[OpportunityConnectorStatusesEnum.APPROVED]: {
				text: t('oppOverview.oppOverview.introStatus.approved'),
				color: theme.colors.green1
			},
			[OpportunityConnectorStatusesEnum.PENDING_APPROVAL]: {
				text: t('oppOverview.oppOverview.introStatus.pending'),
				color: theme.colors.orange2
			},
			[OpportunityConnectorStatusesEnum.DECLINED]: {
				text: t('oppOverview.oppOverview.introStatus.declined'),
				color: theme.colors.red1
			}
		}),
		[]
	);

	return (
		<S.Container>
			<S.ImageContainer>
				<CircleImage
					avatar={connectorAvatar}
					avatarType={connectorAvatarType}
					username={username}
					size={deviceWidth * 0.181}
				/>
			</S.ImageContainer>

			<S.DetailsContainer>
				<CustomText text={username} bold size='s16' />
				<S.StatusContainer>
					<S.StatusIndicatorBall color={introStatusMapper[status].color} />
					<CustomText text={introStatusMapper[status].text} size='s12' />
					{targetsLength ? (
						<>
							<S.TargetsSperator size='s12' text='|' />
							<CustomText
								text={`${targetsLength} ${t(
									'oppOverview.oppOverview.targets'
								)}`}
								size='s12'
							/>
						</>
					) : null}
				</S.StatusContainer>
			</S.DetailsContainer>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	aspect-ratio: 2.87;
	background-color: ${({ theme }) => theme.colors.gray12};
	border-radius: 18px;
	justify-content: center;
	flex-direction: row;
	margin-bottom: ${deviceHeight * 0.0239};
	align-items: center;
`;

S.ImageContainer = styled.View`
	align-items: center;
	justify-content: center;
	padding-horizontal: ${deviceWidth * 0.042};
`;

S.Image = styled(Image)`
	width: ${deviceWidth * 0.181};
	aspect-ratio: 1;
	border-radius: 200px;
`;

S.DetailsContainer = styled.View`
	flex: 1;
`;

S.StatusContainer = styled.View`
	flex-direction: row;
	align-items: center;
	margin-top: ${deviceHeight * 0.006};
`;

S.StatusIndicatorBall = styled.View`
	${createCircle(10)};
	background: ${({ color }: { color: string }) => color};
	margin-right: ${deviceWidth * 0.016};
`;

S.TargetsSperator = styled(CustomText)`
	margin-horizontal: ${deviceWidth * 0.026};
`;

export default ProfileRowItem;
