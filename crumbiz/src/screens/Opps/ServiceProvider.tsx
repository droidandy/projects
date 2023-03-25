import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { ScrollView, StatusBar } from 'react-native';
import {
	Button,
	Card,
	HeaderMenu,
	Icons,
	CustomText,
	CoveringLoadingModal
} from '../../components/Shared';
import { OppsScreenHeader } from '../../components/Opps';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import { providersSelector } from '../../store/selectors/createOpportunitySelectors';
import { createOpportunitySelector } from '../../store/selectors/createOpportunitySelectors';
import {
	updateOpportunity,
	getOppTemplateField
} from '../../store/actions/createOpportunityActions';
import {
	calcHeight,
	deviceHeight,
	deviceWidth,
	calcWidth
} from '../../utils/dimensions';
import { useTheme, useNewOppFlow } from '../../hooks';
import { TemplatesEnum } from '../../types/enums';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}
const ServiceProvider: React.FC<IProps> = React.memo(({ navigation }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const theme = useTheme();
	const { provider } = useSelector(createOpportunitySelector);
	const providers = useSelector(providersSelector);
	useEffect(() => {
		dispatch(getOppTemplateField(TemplatesEnum.SERVICE_PROVIDER_ID));
	}, []);
	const { goToNextScreen } = useNewOppFlow(navigation);

	if (!providers.length) return <CoveringLoadingModal visible />;
	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu
				leftIcon={{ iconColor: 'black' }}
				rightIcon={{
					iconColor: 'black',
					onPress: () =>
						navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL),
					icon: Icons.XIcon
				}}
			/>
			<S.OppsScreenHeaderContainer>
				<CustomText text={t('opps.serviceProvider.which')} size='s14' />
				<CustomText
					text={t('opps.serviceProvider.serviceProvider')}
					size='s22'
					bold
				/>
				<CustomText text={t('opps.serviceProvider.areYouSeeking')} size='s14' />
			</S.OppsScreenHeaderContainer>
			<ScrollView>
				<S.CardContainer>
					{providers.map((singleProvider: { id: string; title: string }) => (
						<S.Card
							selected={singleProvider.id === provider.id}
							key={singleProvider.id}
							text={singleProvider.title}
							onPress={() => {
								dispatch(
									updateOpportunity('provider', {
										id: singleProvider.id,
										title: singleProvider.title
									})
								);
							}}
						/>
					))}
				</S.CardContainer>
			</ScrollView>
			<Button
				gradientBackground={provider.title ? 'orange' : 'gray2'}
				text={t(
					`opps.businessType.${
						provider.title ? 'buttonActionText' : 'buttonInActionText'
					}`
				)}
				textColor={theme.colors.white}
				width={deviceWidth}
				onPress={() => goToNextScreen()}
			/>
		</S.Container>
	);
});

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background: ${({ theme }) => theme.colors.white};
`;

S.OppsScreenHeaderContainer = styled.View`
	width: 100%;
	background-color: ${({ theme }) => theme.colors.white};
	margin-bottom: ${deviceHeight * 0.0156};
	padding-left: ${deviceWidth * 0.0694};
`;

S.CardContainer = styled.View`
	align-items: center;
	flex-direction: row;
	flex-wrap: wrap;
	width: 100%;
	padding-horizontal: ${deviceWidth * 0.0694};
	justify-content: space-between;
`;

S.Card = styled(Card)`
	width: ${calcWidth(148)};
	height: ${calcHeight(128)};
	padding-horizontal: ${deviceWidth * 0.0388};
	margin-bottom: ${deviceWidth * 0.0388};
`;

export default ServiceProvider;
