import React, { useEffect } from 'react';
import styled from 'styled-components/native';
import { OppsScreenHeader } from '../../components/Opps';
import { useTranslation } from 'react-i18next';
import {
	Button,
	Chip,
	HeaderMenu,
	Icons,
	FadedWhiteGradient,
	CoveringLoadingModal
} from '../../components/Shared';
import { TemplatesEnum } from '../../types/enums';
import { IStackNavigation } from '../../types/interfaces';
import { useDispatch, useSelector } from 'react-redux';
import {
	verticalsSelector,
	createOpportunitySelector,
	initialVerticalSelector
} from '../../store/selectors/createOpportunitySelectors';
import {
	updateOpportunity,
	getOppTemplateField
} from '../../store/actions/createOpportunityActions';
import { StatusBar, ScrollView } from 'react-native';
import { useTheme, useNewOppFlow } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { defaultTheme } from '../../themes';
import { useShallowEqualSelector } from '../../hooks/useShallowEqualSelector';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}

const ChooseVertical: React.FC<IProps> = ({ navigation }) => {
	const { t } = useTranslation();
	let chosenVerticals = useSelector(verticalsSelector);
	// let { [TemplatesEnum.VERTICAL_ID]: verticalsOptions } = useSelector(
	// 	createOpportunitySelector
	// );

	const verticalsOptions = useShallowEqualSelector(initialVerticalSelector);
	const dispatch = useDispatch();
	const theme = useTheme();
	useEffect(() => {
		dispatch(getOppTemplateField(TemplatesEnum.VERTICAL_ID));
	}, []);
	const { goToNextScreen } = useNewOppFlow(navigation);

	if (!verticalsOptions.length) return <CoveringLoadingModal visible />;

	return (
		<S.Wrapper>
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
			<S.TopPortion>
				<OppsScreenHeader
					pre={t('opps.vertical.chooseYour')}
					header={t('opps.vertical.vertical')}
					alignment='stretch'
					marginTop={deviceHeight * 0.0156}
				/>
			</S.TopPortion>
			<ScrollView>
				<S.ChipsContainer>
					{verticalsOptions.map((chip: { id: string; title: string }) => (
						<Chip
							selected={Boolean(chosenVerticals[chip.title])}
							key={chip.id}
							text={chip.title}
							onPress={() => {
								let _verticals = null;
								const {
									[chip.title]: isAlreadyExists,
									...rest
								} = chosenVerticals;
								_verticals = isAlreadyExists
									? rest
									: {
											...chosenVerticals,
											[chip.title]: chip.id
									  };
								dispatch(updateOpportunity('verticals', _verticals));
							}}
						/>
					))}
				</S.ChipsContainer>
			</ScrollView>

			<S.EvaporatingChipCloud
				colors={[defaultTheme.colors.white, defaultTheme.colors.white]}
			/>

			<Button
				disabled={!Boolean(Object.keys(chosenVerticals).length)}
				width={deviceWidth}
				gradientBackground={
					Boolean(Object.keys(chosenVerticals).length) ? 'orange' : 'gray2'
				}
				gradientProps={{ useAngle: true, angle: 261 }}
				text={t('opps.businessType.buttonActionText')}
				textColor={defaultTheme.colors.white}
				onPress={() => goToNextScreen()}
			/>
		</S.Wrapper>
	);
};

const S: any = {};
S.Wrapper = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.TopPortion = styled.View`
	width: 100%;
	padding-left: ${deviceWidth * 0.0694};
`;

S.ChipsContainer = styled.View`
	flex-direction: row;
	flex-wrap: wrap;
	justify-content: flex-start;
	padding-left: ${deviceWidth * 0.0694};
	margin-top: ${deviceHeight * 0.04375};
`;

S.EvaporatingChipCloud = styled(LinearGradient)`
	height: ${deviceHeight * 0.0875};
	opacity: 0.1;
`;

export default ChooseVertical;
