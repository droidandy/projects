import React, { useState } from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import {
	Button,
	CustomText,
	HeaderMenu,
	Icons,
	KeyboardAwareScrollView
} from '../../components/Shared';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { OppsScreenHeader } from '../../components/Opps';
import { useDispatch } from 'react-redux';
import { updateOpportunity } from '../../store/actions/createOpportunityActions';
import { useTheme, useNewOppFlow } from '../../hooks';
import { TextInput } from '../../components/Shared/Form@2.0';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}
const SetOpportunityTitle: React.FC<IProps> = ({ navigation }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const [value, setValue] = useState('');
	const theme = useTheme();

	const { goToNextScreen } = useNewOppFlow(navigation);

	const textLength = value.length >= 40 ? '40' : value.length;

	return (
		<KeyboardAwareScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			keyboardShouldPersistTaps='always'
		>
			<S.Container>
				<StatusBar
					backgroundColor={theme.colors.white}
					barStyle='dark-content'
				/>
				<HeaderMenu
					leftIcon={{ iconColor: 'black' }}
					rightIcon={{
						iconColor: 'black',
						onPress: () =>
							navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL),
						icon: Icons.XIcon
					}}
				/>
				<S.TopPortion>
					<OppsScreenHeader
						pre={t('opps.setOpTitle.setThe')}
						header={t('opps.setOpTitle.opTitle')}
						alignment='stretch'
						marginTop={deviceHeight * 0.0156}
						marginBottom={deviceHeight * 0.0703}
					/>
					<S.Input
						value={value}
						maxLength={40}
						onChange={setValue}
						textColor={theme.colors.black}
						textSize={15}
						placeholder={t('opps.setOpTitle.inputPlaceholder')}
						name='title'
						marginBottom={deviceHeight * 0.0156}
					/>
					<S.TextLengthMeasurement
						text={`${textLength}/40`}
						color={textLength === '40' ? 'red1' : 'gray13'}
						size='s12'
					/>
				</S.TopPortion>
				<Button
					disabled={!Boolean(value)}
					width={deviceWidth}
					text={t('opps.setOpTitle.buttonActionText')}
					gradientBackground={value ? 'orange' : 'gray2'}
					gradientProps={{ useAngle: true, angle: value ? 261 : 258 }}
					onPress={() => {
						dispatch(updateOpportunity('opTitle', value));
						goToNextScreen();
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
	height: ${deviceHeight * 0.9};
`;

S.TopPortion = styled.View`
	width: 100%;
	aspect-ratio: 1.31852664577;
	background-color: ${({ theme }) => theme.colors.white};
	padding-left: ${deviceWidth * 0.0694};
`;

S.Input = styled(TextInput)`
	align-self: flex-start;
	flex-shrink: 0;
	background-color: ${({ theme }) => theme.colors.white};
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-color: ${({ theme }) => theme.colors.gray16};
	padding-left: 0;
`;

S.TextLengthMeasurement = styled(CustomText)`
	align-self: flex-end;
	padding-right: ${deviceWidth * 0.0694};
`;

export default SetOpportunityTitle;
