import React, { useState } from 'react';
import styled from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import {
	Button,
	Textarea,
	HeaderMenu,
	Icons,
	KeyboardAwareScrollView
} from '../../components/Shared';
import { IStackNavigation } from '../../types/interfaces';
import { OppsScreenHeader } from '../../components/Opps';
import { useDispatch } from 'react-redux';
import { updateOpportunity } from '../../store/actions/createOpportunityActions';
import { StatusBar } from 'react-native';
import { useTheme } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { ScreensEnum } from '../../navigation/screens';
import { entityDetailsSelector } from '../../store/selectors/entitySelector';
import { useShallowEqualSelector } from '../../hooks/useShallowEqualSelector';

interface IProps extends IStackNavigation {}
const SendMessageToEntity: React.FC<IProps> = ({ navigation }) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const entity = useShallowEqualSelector(entityDetailsSelector);

	const contactName = entity?.firstName ?? '';
	const [textMsg, setTextMsg] = useState('');
	const dispatch = useDispatch();

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
						pre={t('opps.sendMessageToEntity.typeAMessage')}
						header={contactName}
						alignment='stretch'
						marginTop={deviceHeight * 0.0156}
						marginBottom={deviceHeight * 0.0703}
					/>
					<S.Textarea
						value={textMsg}
						onChange={setTextMsg}
						placeholder={`Hi ${contactName}...`}
						style={{ fontSize: 15 }}
					/>
				</S.TopPortion>

				<Button
					disabled={!Boolean(textMsg)}
					width={deviceWidth}
					text={t('opps.setOpTitle.buttonActionText')}
					gradientBackground={textMsg ? 'orange' : 'gray2'}
					onPress={() => {
						dispatch(updateOpportunity('msgTextToEntity', textMsg));
						navigation.navigate(ScreensEnum.OPPORTUNITY_DETAILS);
					}}
				/>
			</S.Container>
		</KeyboardAwareScrollView>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
	height: ${deviceHeight * 0.9};
`;

S.TopPortion = styled.View`
	width: 100%;
	aspect-ratio: 1.31852664577;
	background-color: ${({ theme }) => theme.colors.white};
	padding-horizontal: ${deviceWidth * 0.0694};
`;

S.Textarea = styled(Textarea)`
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-width: 0;
`;

export default SendMessageToEntity;
