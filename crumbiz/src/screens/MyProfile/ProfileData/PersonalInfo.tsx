import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import { Textarea } from '../../../components/Shared';
import { IStackNavigation } from '../../../types/interfaces';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import { CustomText, HeaderMenu, Button } from '../../../components/Shared';
import { getUserDataSelector } from '../../../store/selectors/authSelector';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../../../components/Shared/Form@2.0';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updateUserInfo } from '../../../store/actions/crumbizUsersActions';

const PersonalInfo: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const userData = useSelector(getUserDataSelector);
	const dispatch = useDispatch();

	const [city, setCity] = useState('');
	const [state, setState] = useState('');
	const [country, setCountry] = useState('');
	const [email, setEmail] = useState(userData.email ?? '');
	const [lastName, setLastName] = useState(userData.lastName ?? '');
	const [firstName, setFirstName] = useState(userData.firstName ?? '');

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />
			<S.ContentWrapper>
				<CustomText bold size='s20' text={t('myProfile.personalInfo.header')} />

				<S.FirstNameContainer>
					<CustomText
						withTopGap
						size='s14'
						color='gray13'
						text={t('myProfile.personalInfo.firstName')}
					/>
					<S.Input
						value={firstName}
						textColor={theme.colors.black}
						onChange={(text: string) => setFirstName(text)}
					/>
				</S.FirstNameContainer>

				<S.LastNameContainer>
					<CustomText
						size='s14'
						color='gray13'
						text={t('myProfile.personalInfo.lastName')}
					/>
					<S.Input
						value={lastName}
						textColor={theme.colors.black}
						onChange={(text: string) => setLastName(text)}
					/>
				</S.LastNameContainer>

				<S.Input
					editable={false}
					value={city}
					textColor={theme.colors.black}
					placeholder={t('myProfile.personalInfo.city')}
					onChange={(text: string) => setCity(text)}
				/>

				<S.Input
					editable={false}
					value={state}
					textColor={theme.colors.black}
					placeholder={t('myProfile.personalInfo.state')}
					onChange={(text: string) => setState(text)}
				/>

				<S.Input
					editable={false}
					value={country}
					textColor={theme.colors.black}
					placeholder={t('myProfile.personalInfo.country')}
					onChange={(text: string) => {
						setCountry(text);
					}}
				/>

				<S.EmailContainer>
					<CustomText
						size='s14'
						color='gray13'
						text={t('myProfile.personalInfo.email')}
					/>
					<S.Input
						editable={false}
						value={email}
						textColor={theme.colors.black}
						onChange={(text: string) => setEmail(text)}
					/>
				</S.EmailContainer>
			</S.ContentWrapper>
			<Button
				text='Save Changes'
				borderRadius='0px'
				textColor={theme.colors.white}
				width={deviceWidth}
				height={deviceHeight * 0.0859}
				gradientBackground='orange'
				onPress={() => {
					// TODO Yaron - integration
					dispatch(
						updateUserInfo({ updatedUserObject: { firstName, lastName } })
					);
					navigation.goBack();
				}}
			/>
		</KeyboardAwareScrollView>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
`;

S.ContentWrapper = styled.View`
	flex: 1;
	justify-content: space-between;
	padding-horizontal: ${deviceWidth * 0.072};
`;

S.FirstNameContainer = styled.View``;
S.LastNameContainer = styled.View``;
S.EmailContainer = styled.View``;

S.Input = styled(TextInput)`
	width: 100%;
	flex-shrink: 0;
	padding-left: 0;
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	margin-bottom: ${deviceHeight * 0.039};
	font-size: ${({ theme }) => theme.fontSizes.s15};
	background-color: ${({ theme }) => theme.colors.white};
	border-bottom-color: ${({ theme }) => theme.colors.gray16};
`;

export default PersonalInfo;
