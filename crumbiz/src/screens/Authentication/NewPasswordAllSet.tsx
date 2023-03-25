import React from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import { Button, CustomText, Icons } from '../../components/Shared';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { useTheme } from '../../hooks';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import navigationService from '../../services/NavigationService';
import { ScreensEnum } from '../../navigation/screens';
import { StackEnums } from '../../navigation/stacks';

interface IProps extends IStackNavigation {}
const NewPasswordAllSet: React.FC<IProps> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<S.TopPortion>
				<Icons.AllSetIcon
					width={deviceWidth * 0.6}
					height={deviceHeight * 0.55}
				/>
				<CustomText
					center
					text={t('createNewPassword.doneStep.headerText')}
					size='s22'
					bold
				/>
				<CustomText
					center
					text={t('createNewPassword.doneStep.fieldsDescription')}
					size='s14'
					color='gray15'
				/>
				<CustomText
					center
					text={t('createNewPassword.doneStep.fieldsDescription2')}
					size='s14'
					color='gray15'
				/>
			</S.TopPortion>
			<S.Button>
				<Button
					withBottomGap
					borderRadius='100px'
					text={t('createNewPassword.doneStep.actionButtonText')}
					gradientBackground='orange'
					onPress={() => {
						navigationService.navigate(ScreensEnum.LOGIN);
					}}
				/>
			</S.Button>
		</S.Container>
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
	align-items: center;
	margin-top: ${deviceHeight * 0.05};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Button = styled.View`
	margin-bottom: ${deviceHeight * 0.078125};
`;

export default NewPasswordAllSet;
