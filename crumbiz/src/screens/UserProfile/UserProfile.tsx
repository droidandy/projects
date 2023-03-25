import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../hooks';
import styled from 'styled-components/native';
import { deviceWidth, deviceHeight, calcWidth, calcHeight } from '../../utils/dimensions';
import { Icons, CustomText, HeaderMenu, CircleImage } from '../../components/Shared';
import { IStackNavigation, IUserExpandedWithRelationships } from '../../types/interfaces';
import extractAvatarFromUser from '../../utils/extractAvatarFromUser';
import { destructUserAdditionals } from '../../utils';
import UserProfileThreeDotsMenu from './UserProfileThreeDotsMenu';
import UserProfileContactMenu from './UserProfileContactMenu';
import { Tabs } from '../../components/OppOverview/OppOverview';

//TODO Yaron - change extractAvatar util to get userAdditionals instead the whole user obj

const UserProfile: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const initialTabIndex = navigation.getParam('t') ?? 0;
	const [tabIndex, setTabIndex] = useState(Number(initialTabIndex));
	const [showThreeDotsMenu, setThreeDotsMenu] = useState(false);
	const user: IUserExpandedWithRelationships = navigation.getParam('user');
	//@ts-ignore
	const fullName = `${user.firstName} ${user.lastName}`;
	const [avatar, avatarType] = extractAvatarFromUser(user);
	const { country, score, countryId } = destructUserAdditionals(user.userAdditionals)
	const countryAndDot = `${country ? country : 'Earth'} ${String.fromCharCode(8226)}`;
	const flagIconSrc = `https://www.countryflags.io/${countryId}/flat/16.png`;

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.gray12} barStyle='dark-content' />
			<HeaderMenu
				leftIcon={{ iconColor: 'black' }}
				rightIcon={{
					iconColor: 'black',
					onPress: () => setThreeDotsMenu(oldState => !oldState),
					icon: Icons.ThreeDotsIcon
				}}
			/>
			<UserProfileThreeDotsMenu
				visible={showThreeDotsMenu}
				setVisible={setThreeDotsMenu}
			/>
			<S.TopContainer onPress={() => setThreeDotsMenu(false)}>
				<S.TopSection>
					<S.UserDetails>
						<CircleImage
							avatar={avatar}
							avatarType={avatarType}
							username={fullName}
							size={deviceWidth * 0.2611}
						/>
						<S.TextContainer>
							<CustomText bold size='s20' text={fullName} />
							<CustomText size='s14' text='Partnership Director at Microsoft' />
						</S.TextContainer>
						<S.UserLocationAndScore>
							{countryId ? <S.CountryIcon source={{ uri: flagIconSrc }} /> : <S.EarthIcon />}
							<S.UserCountry
								size='s14'
								lineHeight={19}
								text={countryAndDot}
							/>
							<S.RatingIcon
								width={deviceWidth * 0.0388}
								fill={theme.colors.yellow}
							/>
							<S.UserScore
								size='s14'
								lineHeight={19}
								text={`${score ? score.toFixed(1) : 0}`}
							/>
						</S.UserLocationAndScore>
					</S.UserDetails>

					<S.SideMenuContainer>
						<UserProfileContactMenu user={user} />
					</S.SideMenuContainer>

				</S.TopSection>
			</S.TopContainer>

			<S.BottomSection>
				<Tabs
					tabIndex={tabIndex}
					setTabIndex={setTabIndex}
					comingFromUserProfile
				/>
			</S.BottomSection>

		</S.Container>
	)
}

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray12};
`;

S.TopContainer = styled.TouchableWithoutFeedback``;

S.TopSection = styled.View`
	flex: 1;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	padding-left: ${deviceWidth * 0.0694};
	margin-bottom: ${deviceHeight * 0.0390625};
`;

S.TextContainer = styled.View`
	margin-top: ${deviceHeight * 0.015625};
`;

S.UserDetails = styled.View`
	align-items: flex-start;
`;

S.SideMenuContainer = styled.View`
	align-items: flex-end;
	justify-content: space-between;
	width: ${deviceWidth * 0.12};
	border-top-left-radius: 25px;
	border-bottom-left-radius: 25px;
	padding-vertical: ${deviceHeight * 0.015};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.BottomSection = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.57};
	padding-bottom: ${deviceHeight * 0.035};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.UserLocationAndScore = styled.View`
	flex-direction: row;
	align-items: center;
	margin-top: ${deviceHeight * 0.025};
`;

S.CountryIcon = styled.Image`
	border-radius: 1000;
	width: ${calcWidth(14)};
	height: ${calcHeight(16)};
	margin-right: ${deviceWidth * 0.01388};
`;

S.EarthIcon = styled(Icons.GlobeIcon)`
	width: ${calcWidth(14)};
	height: ${calcHeight(16)};
	margin-right: ${deviceWidth * 0.01388};
`;

S.UserCountry = styled(CustomText)`
	margin-right: ${deviceWidth * 0.01388};
`;

S.UserScore = styled(CustomText)``;

S.RatingIcon = styled(Icons.StarIcon)`
	aspect-ratio: 1;
	margin-right: ${deviceWidth * 0.01388};
`;

export default UserProfile;