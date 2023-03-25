import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { IOppTargetDetails, IStackNavigation } from '../../types/interfaces';
import {
	CancelButton,
	ProfileImageWithIntroStatusIndicator
} from '../../components/OppOverview';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { useTranslation } from 'react-i18next';
import { TargetStatusesEnum } from '../../types/enums';
import { CustomText, StatusBar, HeaderMenu } from '../../components/Shared';
import { useTheme } from '../../hooks';
import { useDispatch, useSelector } from 'react-redux';
import { oppTargetsSelector } from '../../store/selectors/oppOverviewSelector';
import { revertTargetStatus } from '../../mappers';
import { changeTargetStatus } from '../../store/actions/oppOverviewActions';

interface IProps extends IStackNavigation {}

// Todo All - find a better name for this component
const OhYes: React.FC<IProps> = ({ navigation }) => {
	const { oppTargetId }: IOppTargetDetails = navigation.getParam('profile');
	const { t } = useTranslation();
	const theme = useTheme();
	const targetData: IOppTargetDetails = useSelector(oppTargetsSelector).find(
		// Todo Sason - extract to util
		(target: IOppTargetDetails) => target.oppTargetId === oppTargetId
	)!;
	const dispatch = useDispatch();

	useEffect(() => {
		// In order to clear the screen after few seconds
		const timeout = setTimeout(() => {
			navigation.goBack();
		}, 5000);

		return () => {
			clearTimeout(timeout);
		};
	}, []);

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.gray14} />
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />

			<S.ProfileImage
				size={deviceWidth * 0.3694}
				status={targetData.statusId}
				avatar={targetData.oppTargetAvatar}
				avatarType={targetData.oppTargetAvatarType}
				username={targetData.oppTargetUsername}
				showCrumb
			/>

			<S.TextContainer>
				<CustomText
					text={t('oppOverview.targetProfile.ohYes')}
					size='s32'
					bold
				/>
				{/*
        //  @ts-ignore */}
				<CustomText
					text={t('oppOverview.targetProfile.fullScreenOHYesMsg')}
					size='s20'
				/>
			</S.TextContainer>

			<S.CancelButton
				onCancel={() => {
					const prevStatus = revertTargetStatus[targetData.statusId];
					dispatch(
						changeTargetStatus({
							targetId: oppTargetId,
							newStatus: prevStatus
						})
					);
					navigation.goBack();
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray14};
	align-items: center;
`;

S.ProfileImage = styled(ProfileImageWithIntroStatusIndicator)`
	margin-top: ${deviceHeight * 0.0859375};
`;

S.TextContainer = styled.View`
	margin-top: ${deviceHeight * 0.2796875};
	align-items: center;
`;

S.CancelButton = styled(CancelButton)`
	width: ${deviceWidth * 0.2972};
	aspect-ratio: 3.057;
`;

export default OhYes;
