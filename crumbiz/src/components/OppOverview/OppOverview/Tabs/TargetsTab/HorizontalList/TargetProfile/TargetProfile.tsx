import React, { useCallback, useContext, useMemo, useState } from 'react';
import styled from 'styled-components/native';
import {
	deviceHeight,
	deviceWidth
} from '../../../../../../../utils/dimensions';
import { TargetStatusesEnum } from '../../../../../../../types/enums';
import { CustomText, Icons } from '../../../../../../Shared';
import { TouchableWithoutFeedback, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createCircle } from '../../../../../../../utils';
import { useTheme } from '../../../../../../../hooks';
import {
	IOppTargetDetails,
	PlainFunction
} from '../../../../../../../types/interfaces';
import ProfileImageWithIntroStatusIndicator from '../../../../../ProfileImageWithIntroStatusIndicator';
import { useNavigation } from 'react-navigation-hooks';
import { ConnectedBy } from '../../../../../index';
import InlineOhYes from './InlineOhYes';
import { changeTargetStatus } from '../../../../../../../store/actions/oppOverviewActions';
import { useDispatch } from 'react-redux';
import { oppTargetsSelector } from '../../../../../../../store/selectors/oppOverviewSelector';
import ChangeIntroStatusButton from '../../../../ChangeIntroStatusButton';
import { useShallowEqualSelector } from '../../../../../../../hooks/useShallowEqualSelector';
import { ScreensEnum } from '../../../../../../../navigation/screens';
import { OppOverviewContext } from '../../../../../../../screens/OppOverview/oppOverviewContext';

interface IProps {
	targetData: IOppTargetDetails;
	singleCard: boolean;
	handleOppOverviewRefresh: PlainFunction;
}

const TargetProfile: React.FC<IProps> = ({
	targetData,
	singleCard,
	handleOppOverviewRefresh
}) => {
	const {
		statusId,
		oppTargetAvatar,
		oppTargetAvatarType,
		oppTargetUsername,
		oppConnectorUsername,
		oppConnectorAvatar,
		oppConnectorAvatarType
	} = targetData;
	const prevStatus = useMemo(() => statusId, []);
	const theme = useTheme();
	const navigation = useNavigation();
	const [shouldShowOhYes, setShowYes] = useState(false);
	const [loading, setLoading] = useState(false);
	const dispatch = useDispatch();
	const { oppCompleteModalRef } = useContext(OppOverviewContext);
	const oppTargets = useShallowEqualSelector(oppTargetsSelector);

	const handleOhYesCancel = useCallback(() => {
		setShowYes(false);
		setLoading(true);
		dispatch(
			changeTargetStatus({
				targetId: targetData.oppTargetId,
				newStatus: prevStatus,
				cb: () => {
					setLoading(false);
				}
			})
		);
	}, [prevStatus]);

	const handleSuccess = useCallback(() => {
		setShowYes(true);
		setLoading(false);
		setTimeout(() => {
			setShowYes(false);
		}, 3500);
		handleOppOverviewRefresh();
	}, []);

	return (
		<TouchableWithoutFeedback
			disabled={shouldShowOhYes}
			onPress={() =>
				navigation.navigate(ScreensEnum.TARGET_PROFILE, {
					profile: {
						...targetData
					}
				})
			}
		>
			<View>
				<S.Container singleCard={singleCard}>
					<S.ProfileImage
						size={deviceWidth * 0.244}
						status={statusId}
						avatar={oppTargetAvatar}
						avatarType={oppTargetAvatarType}
						username={oppTargetUsername}
						showCrumb
					/>

					{shouldShowOhYes ? (
						<InlineOhYes onCancel={handleOhYesCancel} />
					) : (
						<S.TextAndButtonContainer>
							<S.UsernameAndConnectedByContainer>
								<CustomText text={oppTargetUsername} size='s16' />

								<ConnectedBy
									connectorProfile={{
										connectorUsername: oppConnectorUsername,
										avatar: oppConnectorAvatar,
										avatarType: oppConnectorAvatarType
									}}
									avatarSize={0.097}
								/>
							</S.UsernameAndConnectedByContainer>

							{statusId === TargetStatusesEnum.DONE_DEAL ? (
								<S.DoneDealHandsCircle colors={theme.gradients.orange}>
									<Icons.ShakingHandsIcon />
								</S.DoneDealHandsCircle>
							) : (
								<S.ActionButton
									targetId={targetData.oppTargetId}
									statusId={statusId}
									onPress={() => {
										setLoading(true);
									}}
									callback={handleSuccess}
									loading={loading}
								/>
							)}
						</S.TextAndButtonContainer>
					)}
				</S.Container>
			</View>
		</TouchableWithoutFeedback>
	);
};

const S: any = {};
S.Container = styled.View`
	background-color: ${({ theme }) => theme.colors.gray12};
	width: ${deviceWidth * 0.77};
	height: ${deviceHeight * 0.32};
	border-radius: 18px;
	align-items: center;
	justify-content: center;
	overflow: visible;
	margin-top: ${deviceHeight * 0.084};
	margin-right: ${deviceWidth * 0.055};
	/* this margin left made in order to center a single card */
	margin-left: ${({ singleCard }: Partial<IProps>) =>
		singleCard ? deviceWidth * 0.05 : 0};
`;

S.ProfileImage = styled(ProfileImageWithIntroStatusIndicator)`
	top: ${-((deviceWidth * 0.244) / 2)};
	position: absolute;
	align-self: center;
`;

S.TextAndButtonContainer = styled.View`
	align-items: center;
	justify-content: center;
	margin-top: ${deviceHeight * 0.03125};
`;

S.UsernameAndConnectedByContainer = styled.View`
	align-items: center;
`;

S.ActionButton = styled(ChangeIntroStatusButton)`
	width: ${deviceWidth * 0.57};
	aspect-ratio: 4.62;
	bottom: ${-(deviceHeight * 0.046875)};
`;

S.DoneDealHandsCircle = styled(LinearGradient)`
	${createCircle(45)};
	bottom: ${-(deviceHeight * 0.046875)};
	align-items: center;
	justify-content: center;
`;

export default TargetProfile;
