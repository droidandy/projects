import React, { useState, useEffect } from 'react';
import styled from 'styled-components/native';
import { StatusBar } from 'react-native';
import {
	Button,
	ListItem,
	HeaderMenu,
	Icons,
	CustomText,
	CoveringLoadingModal
} from '../../components/Shared';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { FlatList } from 'react-native';
import { useTheme, useNewOppFlow } from '../../hooks';

import { OppsScreenHeader } from '../../components/Opps';
import { fuzzySearch } from '../../utils';
import { TemplatesEnum } from '../../types/enums';
import { useDispatch, useSelector } from 'react-redux';
import { createOpportunitySelector } from '../../store/selectors/createOpportunitySelectors';
import {
	updateOpportunity,
	getOppTemplateField
} from '../../store/actions/createOpportunityActions';
import { TextInput } from '../../components/Shared/Form@2.0';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { defaultTheme } from '../../themes';
import { ScreensEnum } from '../../navigation/screens';

interface IBusiness {
	title: string;
	id: string;
	creatorUserId: string;
}

interface IProps extends IStackNavigation {}

const BusinessType: React.FC<IProps> = ({ navigation }) => {
	const [term, setTerm] = useState('');
	const theme = useTheme();
	const { t } = useTranslation();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(getOppTemplateField(TemplatesEnum.BUSINESS_TYPE_ID));
	}, []);
	const {
		businessType,
		[TemplatesEnum.BUSINESS_TYPE_ID]: businessTypes
	} = useSelector(createOpportunitySelector);
	const { goToNextScreen } = useNewOppFlow(navigation);

	if (!businessTypes.length) return <CoveringLoadingModal visible />;

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
			<S.TextAndInputContainer>
				<CustomText text={t('opps.businessType.what')} size='s14' />
				<CustomText
					text={t('opps.businessType.typeOfBusiness')}
					size='s22'
					bold
				/>
				<CustomText
					text={t('opps.businessType.areYouSeeking')}
					size='s14'
					withBottomGap
				/>
				<S.Input
					placeholder={t('opps.businessType.inputPlaceholder')}
					onChange={setTerm}
					name='term'
					value={term}
				/>
			</S.TextAndInputContainer>

			<FlatList
				data={businessTypes.filter(({ title }: { title: string }) =>
					fuzzySearch(term, title)
				)}
				keyExtractor={item => item.id}
				style={{
					flex: 1,
					width: '100%',
					backgroundColor: theme.colors.gray14
				}}
				renderItem={({ item }: { item: IBusiness }) => (
					<ListItem
						text={item.title}
						textSize='s14'
						selected={businessType.id === item.id}
						onPress={() =>
							dispatch(
								updateOpportunity('businessType', {
									title: item.title,
									id: item.id
								})
							)
						}
					/>
				)}
			/>

			<Button
				// disabled={!Boolean(businessType.id)}
				width={deviceWidth}
				borderRadius='0px'
				gradientBackground={businessType.id ? 'orange' : 'gray2'}
				text={t(
					`opps.businessType.${
						businessType.id ? 'buttonActionText' : 'buttonInActionText'
					}`
				)}
				textColor={defaultTheme.colors.white}
				onPress={() => goToNextScreen()}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	align-items: center;
`;

S.TextAndInputContainer = styled.View`
	width: 100%;
	aspect-ratio: 1.7;
	background-color: ${({ theme }) => theme.colors.white};
	padding-left: ${deviceWidth * 0.0694};
`;

S.Input = styled(TextInput)`
	align-self: flex-start;
	flex-shrink: 0;
	background-color: ${defaultTheme.colors.white};
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-color: ${defaultTheme.colors.gray16};
	padding-left: 0;
`;

export default BusinessType;
