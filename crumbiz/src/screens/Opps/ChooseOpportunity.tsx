import React, { useEffect, useMemo } from 'react';
import { StatusBar, Image } from 'react-native';
import styled from 'styled-components/native';
import {
	Icons,
	HeaderMenu,
	CustomText,
	CoveringLoadingModal
} from '../../components/Shared';
import { useTranslation } from 'react-i18next';
import { IStackNavigation, PlainFunction } from '../../types/interfaces';
import { Button } from '../../components/Shared';
import { useDispatch, useSelector } from 'react-redux';
import {
	updateOpportunity,
	getOppTypes
} from '../../store/actions/createOpportunityActions';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import MyCarousel from '../../components/Shared/Carousel';
import useTheme from '../../hooks/useTheme';
import { createOpportunitySelector } from '../../store/selectors/createOpportunitySelectors';
import { resetCreateOppState } from '../../store/actions/createOpportunityActions';
import { ScreensEnum } from '../../navigation/screens';
import { OpportunityTypesEnum } from '../../types/enums';
import { oppTypeIconsMapper } from '../../mappers';

interface IOppType {
	id: OpportunityTypesEnum;
	title: string;
	description: string;
	icon?: React.StatelessComponent;
	onPress?: PlainFunction;
	image: string;
	imageType: string;
}

interface IProps extends IStackNavigation {}

const ChooseOpportunity: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const theme = useTheme();
	const dispatch = useDispatch();

	// const { oppTypes } = useSelector(templateFieldsSelector);
	const { opType, oppTypes } = useSelector(createOpportunitySelector);

	useEffect(() => {
		dispatch(getOppTypes());

		return () => {
			dispatch(resetCreateOppState());
		};
	}, []);

	const carouselOppTypes = useMemo(() => {
		return oppTypes.map((item: IOppType) => {
			const base64Image = `data:${item.imageType};base64,${item.image}`;
			const convertedOppTypes = {
				...item,
				image: (
					<Image
						source={{ uri: base64Image }}
						style={{
							width: deviceWidth * 0.40555555555,
							height: deviceHeight * 0.21,
							resizeMode: 'contain'
						}}
					/>
				),
				onPress: () => {
					dispatch(
						updateOpportunity('opType', { title: item.title, id: item.id })
					);
				}
			};
			return convertedOppTypes;
		});
	}, [oppTypes]);

	if (!oppTypes.length) return <CoveringLoadingModal visible />;

	return (
		<S.Container>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<HeaderMenu leftIcon={{ iconColor: 'black' }} />
			<S.HeaderContainer>
				<CustomText text={t('opps.chooseOp.opType')} size='s22' bold />
				<CustomText text={t('opps.chooseOp.createOpportunity')} size='s14' />
			</S.HeaderContainer>
			<MyCarousel
				selected={opType.id}
				opportunityTypeCards={carouselOppTypes}
			/>
			<Button
				disabled={!opType.id}
				text='Next'
				textColor={theme.colors.white}
				width={deviceWidth}
				height={deviceHeight * 0.0859}
				gradientBackground={opType.id ? 'orange' : 'gray2'}
				gradientProps={{ useAngle: true, angle: opType.id ? 261 : 258 }}
				onPress={() => {
					props.navigation.navigate(ScreensEnum.SET_OPPORTUNITY_TITLE);
				}}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.HeaderContainer = styled.View`
	padding-left: ${deviceWidth * 0.06944444444};
`;

export default ChooseOpportunity;
