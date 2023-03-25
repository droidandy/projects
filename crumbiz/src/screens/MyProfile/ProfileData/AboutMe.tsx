import React, { useState, useMemo } from 'react';
import { StatusBar } from 'react-native';
import { useTheme } from '../../../hooks';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../../types/interfaces';
import { deviceWidth, deviceHeight } from '../../../utils/dimensions';
import {
	CustomText,
	Button,
	HeaderMenu,
	KeyboardAwareScrollView,
	Textarea
} from '../../../components/Shared';
import { useShallowEqualSelector } from '../../../hooks/useShallowEqualSelector';
import { getUserAdditionals } from '../../../store/selectors/authSelector';
import destructUserAdditionals from '../../../utils/destructUserAdditionals';
import { useDispatch } from 'react-redux';
import { updateUserAdditionalsInfo } from '../../../store/actions/crumbizUsersActions';

const AboutMe: React.FC<IStackNavigation> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const userAdditionals = useShallowEqualSelector(getUserAdditionals);

	const about = useMemo(() => {
		const { about } = destructUserAdditionals(userAdditionals);
		return about;
	}, [userAdditionals]);

	const [value, setValue] = useState(about);

	return (
		<KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<S.Container>
				<StatusBar
					backgroundColor={theme.colors.white}
					barStyle='dark-content'
				/>
				<HeaderMenu leftIcon={{ iconColor: 'black' }} />
				<S.TopPortion>
					<CustomText bold size='s20' text={t('myProfile.aboutMe.header')} />
					<S.Input
						value={value}
						textSize={15}
						onChange={setValue}
						textColor={theme.colors.black}
						placeholder={t('myProfile.aboutMe.placeHolder')}
					/>
				</S.TopPortion>
				<Button
					width={deviceWidth}
					backgroundColor='orange'
					text={t('myProfile.mainPage.actionButton')}
					onPress={() => {
						dispatch(
							updateUserAdditionalsInfo({
								updatedUserAdditionalsKeys: { about: value }
							})
						);
						navigation.goBack();
					}}
				/>
			</S.Container>
		</KeyboardAwareScrollView>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	align-items: center;
	justify-content: space-between;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.TopPortion = styled.View`
	width: 100%;
	padding-left: ${deviceWidth * 0.0694};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Input = styled(Textarea)`
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-width: 0;
	margin-top: ${deviceHeight * 0.039};
	font-size: 15;
`;
export default AboutMe;
