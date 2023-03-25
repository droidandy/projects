import React from 'react';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../../../../../utils/dimensions';
import { IOppTargetDetails } from '../../../../../../types/interfaces';
import ProfileImageWithIntroStatusIndicator from '../../../../ProfileImageWithIntroStatusIndicator';
import { CustomText } from '../../../../../Shared';
import { navigationService } from '../../../../../../services';
import IntroStatusCrumb from '../../../IntroStatusCrumb';
import { TouchableWithoutFeedback } from 'react-native';
import { ScreensEnum } from '../../../../../../navigation/screens';

interface IProps {
	targetData: IOppTargetDetails;
}

const TargetProfileRow: React.FC<IProps> = props => {
	const {
		statusId,
		oppTargetAvatar,
		oppTargetAvatarType,
		oppTargetUsername
	} = props.targetData;
	return (
		<TouchableWithoutFeedback
			onPress={() =>
				navigationService.navigate(ScreensEnum.TARGET_PROFILE, {
					profile: {
						...props.targetData
					}
				})
			}
		>
			<S.Container>
				<S.ImageContainer>
					<ProfileImageWithIntroStatusIndicator
						size={deviceWidth * 0.15}
						status={statusId}
						avatar={oppTargetAvatar}
						avatarType={oppTargetAvatarType}
						username={oppTargetUsername}
					/>
				</S.ImageContainer>

				<S.NameAndCrumbContainer>
					<CustomText text={oppTargetUsername} bold size='s16' />
					<S.StatusCrumb status={statusId} />
				</S.NameAndCrumbContainer>
			</S.Container>
		</TouchableWithoutFeedback>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	aspect-ratio: 2.87;
	background-color: ${({ theme }) => theme.colors.gray12};
	border-radius: 18px;
	flex-direction: row;
	margin-bottom: ${deviceHeight * 0.0239};
	align-items: center;
`;

S.ImageContainer = styled.View`
	align-items: center;
	justify-content: center;
	padding-horizontal: ${deviceWidth * 0.042};
`;

S.NameAndCrumbContainer = styled.View``;

S.StatusCrumb = styled(IntroStatusCrumb)`
	margin-top: ${deviceHeight * 0.02};
	align-self: flex-start;
`;

export default TargetProfileRow;
