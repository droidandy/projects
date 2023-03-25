import React from 'react';
import { StatusBar, Animated } from 'react-native';
import { useTheme } from '../../hooks';
import { useSelector, useDispatch } from 'react-redux';
import ProfileSummary from './ProfileSummary';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { deviceWidth, deviceHeight, calcWidth } from '../../utils/dimensions';
import extractAvatarFromUser from '../../utils/extractAvatarFromUser';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import { ImagePickerResponse } from 'react-native-image-picker';
import useCamera from '../../hooks/useCamera/useCamera';
import { updateUserAdditionalsInfo } from '../../store/actions/crumbizUsersActions';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { CrumbizUsersTypes } from '../../store/constants';
import {
	Icons,
	CustomText,
	HeaderMenu,
	CircleImage,
	RoundedIcon
} from '../../components/Shared';
import ChooseProfilePhoto from '../../components/ChooseProfilePhoto/ChooseProfilePhoto';
import { ScreensEnum } from '../../navigation/screens';
import useOpenCloseState from '../../hooks/useOpenCloseState';

const userAdditionalsPendingSelector = createLoadingSelector(
	CrumbizUsersTypes.UPDATE_USER_ADDITIONALS_INFO
);

const MyProfile: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const userData = useSelector(getUserDataSelector);
	const imageLoadingState = useSelector(userAdditionalsPendingSelector);
	const userFullName = `${userData.firstName} ${userData.lastName}`;
	const [avatar, avatarType] = extractAvatarFromUser(userData);
	const dispatch = useDispatch();
	const openCloseState = useOpenCloseState();

	const photoSelectionHandler = (response: ImagePickerResponse) => {
		console.log(response);
		if (!response.error && !response.didCancel) {
			dispatch(
				updateUserAdditionalsInfo({
					updatedUserAdditionalsKeys: {
						avatar: response.data,
						avatarType: response.type
					}
				})
			);
			openCloseState.close();
		}
	};
	const deletePhotoHandler = () => {
		dispatch(
			updateUserAdditionalsInfo({
				updatedUserAdditionalsKeys: {
					avatar: '',
					avatarType: ''
				}
			})
		);
		openCloseState.close();
	};

	return (
		<S.Container>
			<StatusBar
				backgroundColor={theme.colors.gray12}
				barStyle='dark-content'
			/>
			<HeaderMenu
				leftIcon={{ iconColor: 'black' }}
				rightIcon={{
					iconColor: 'paleBlue1',
					onPress: () => navigation.navigate(ScreensEnum.PROFILE_SIDE_MENU),
					icon: Icons.GearWheelsIcon
				}}
			/>
			<S.TopContainer>
				<S.AvatarContainer size='large'>
					{imageLoadingState && <S.ActivityIndicator size='large' />}
					<CircleImage
						avatar={avatar}
						avatarType={avatarType}
						username={userFullName}
						size={deviceWidth * 0.3333}
					/>
					<S.CameraIcon
						size={calcWidth(40)}
						icon={Icons.CameraIcon}
						gradientColor='darkGray'
						fill={'white'}
						iconSize={deviceWidth * 0.055}
						touchable
						onPress={() => {
							// showImagePicker();
							openCloseState.open();
						}}
					/>
				</S.AvatarContainer>
				<S.TextContainer>
					<CustomText bold center size='s20' text={userFullName} />
				</S.TextContainer>
				<S.ProfileProgressContainer>
					<CustomText
						center
						size='s15'
						text={t('myProfile.mainPage.completeYourProfile')}
					/>
					<S.ProgressContainer>
						<S.ProgressBar />
					</S.ProgressContainer>
				</S.ProfileProgressContainer>
			</S.TopContainer>
			<S.BottomContainer>
				<ProfileSummary navigation={navigation} />
			</S.BottomContainer>
			<ChooseProfilePhoto
				{...openCloseState}
				photoSelectionCB={photoSelectionHandler}
				deletePhotoCB={deletePhotoHandler}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray12};
`;

S.TopContainer = styled.View`
	flex: 1;
	width: 100%;
	align-items: center;
	margin-bottom: ${deviceHeight * 0.0390625};
`;

S.TextContainer = styled.View`
	margin-top: ${deviceHeight * 0.015625};
`;

S.ProfileProgressContainer = styled.View`
	border-radius: 25px;
	align-items: center;
	flex-direction: column;
	justify-content: space-between;
	width: ${deviceWidth * 0.8611};
	height: ${deviceHeight * 0.15};
	margin-top: ${deviceHeight * 0.03125};
	padding-vertical: ${deviceHeight * 0.0390625};
	background-color: ${({ theme }) => theme.colors.gray14};
`;

S.AvatarContainer = styled.View`
	justify-content: center;
	align-items: center;
`;
S.ActivityIndicator = styled.ActivityIndicator`
	position: absolute;
	z-index: 500;
`;
S.CameraIcon = styled(RoundedIcon)`
	position: absolute;
	right: 0;
	bottom: 0;
`;

S.ProgressContainer = styled.View`
	border-radius: 13px;
	width: ${deviceWidth * 0.7222};
	height: ${deviceHeight * 0.021875};
	background: ${({ theme }) => theme.colors.white};
`;

S.ProgressBar = styled(Animated.View)`
	width: 50%;
	height: 100%;
	border-radius: 25;
	background-color: ${({ theme }) => theme.colors.darkerBlue1};
`;

S.BottomContainer = styled.View`
	width: 100%;
	border-top-left-radius: 25px;
	border-top-right-radius: 25px;
	height: ${deviceHeight * 0.42};
	padding-vertical: ${deviceHeight * 0.039};
	background-color: ${({ theme }) => theme.colors.white};
`;

export default MyProfile;
