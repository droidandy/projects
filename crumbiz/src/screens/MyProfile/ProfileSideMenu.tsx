import React, { useState } from 'react';
import { useTheme } from '../../hooks';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import SwitchOnAndOff from '../../components/Shared/SwitchOnAndOff';
import { CustomText, HeaderMenu, Icons } from '../../components/Shared';
import { logoutUser } from '../../store/actions/authActions';
import { useDispatch } from 'react-redux';
import { ScreensEnum } from '../../navigation/screens';

const ProfileSideMenu: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const [isIntroductionsToggled, setIsIntroductionsToggled] = useState(false);
	const [isOpportunitiesToggled, setIsOpportunitiesToggled] = useState(false);
	const [isNotificationsToggled, setIsNotificationsToggled] = useState(false);
	const dispatch = useDispatch();

	const menuItems = [
		{
			header: t('myProfile.profileSideMenu.introductions.header'),
			text: t('myProfile.profileSideMenu.introductions.text'),
			status: isIntroductionsToggled,
			onToggle: () => setIsIntroductionsToggled(oldState => !oldState)
		},
		{
			header: t('myProfile.profileSideMenu.opportunities.header'),
			text: t('myProfile.profileSideMenu.opportunities.text'),
			status: isOpportunitiesToggled,
			onToggle: () => setIsOpportunitiesToggled(oldState => !oldState)
		},
		{
			header: t('myProfile.profileSideMenu.notifications.header'),
			text: t('myProfile.profileSideMenu.notifications.text'),
			status: isNotificationsToggled,
			onToggle: () => setIsNotificationsToggled(oldState => !oldState)
		}
	];

	return (
		<View>
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />
			<S.SideMenuContainer>
				<S.Header>
					<CustomText bold size='s20' text='Settings' />
				</S.Header>
				<View>
					{menuItems.map((label, index) => (
						<View key={index}>
							<S.Container>
								<CustomText
									withTopGap
									text={label.header}
									size='s15'
									color='black'
								/>
								<S.SwitchContainer key={index}>
									<S.Text
										text={label.text}
										size='s13'
										color='gray15'
										withBottomGap
									/>
									<SwitchOnAndOff
										size='small'
										isOn={label.status}
										onToggle={label.onToggle}
									/>
								</S.SwitchContainer>
							</S.Container>
							<S.LineContainer>
								<S.Line />
							</S.LineContainer>
						</View>
					))}
				</View>

				<S.LogOutContainer>
					<S.LineContainer>
						<S.Line />
					</S.LineContainer>

					<TouchableWithoutFeedback
						onPress={() => {
							dispatch(logoutUser());
							navigation.goBack();
						}}
					>
						<S.LogOutItems>
							<Icons.LogOutIcon
								width={deviceWidth * 0.0555}
								height={deviceHeight * 0.03125}
								fill={theme.colors.darkerBlue1}
							/>
							<CustomText
								text='Log Out'
								size='s15'
								color='darkerBlue1'
								withLeftGap
							/>
						</S.LogOutItems>
					</TouchableWithoutFeedback>
				</S.LogOutContainer>
			</S.SideMenuContainer>
		</View>
	);
};

const S: any = {};
S.SideMenuContainer = styled.View`
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Header = styled.View`
	padding-left: ${deviceWidth * 0.072};
`;

S.Container = styled.View`
	width: 85%;
	margin: 0 auto;
`;

S.SideMenuContainer = styled.View`
	background-color: ${({ theme }) => theme.colors.white};
`;

S.SwitchContainer = styled.View`
	flex-direction: row;
	align-items: baseline;
	justify-content: space-between;
`;

S.Text = styled(CustomText)`
	max-width: ${deviceWidth * 0.6388};
`;

S.LineContainer = styled.View`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	height: ${deviceHeight * 0.01875};
`;

S.Line = styled.View`
	width: ${deviceWidth};
	height: ${deviceHeight * 0.0015625};
	background-color: ${({ theme }) => theme.colors.gray14};
`;

S.LogOutContainer = styled.View`
	margin-top: ${deviceHeight * 0.13};
`;

S.LogOutItems = styled.View`
	flex-direction: row;
	align-items: center;
	padding-vertical: ${deviceHeight * 0.02};
	padding-horizontal: ${deviceWidth * 0.0555};
`;

export default ProfileSideMenu;
