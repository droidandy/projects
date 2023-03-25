import React, { useMemo, useState, useRef, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { useTranslation } from 'react-i18next';
import { OppsScreenHeader } from '../../components/Opps';
import { TemplatesEnum } from '../../types/enums';
import { IStackNavigation } from '../../types/interfaces';
import {
	Button,
	RangeSlider,
	HeaderMenu,
	Icons,
	CoveringLoadingModal
} from '../../components/Shared';
import {
	IRangeSliderRefActions,
	RangeSliderChangeCallbackParams
} from '../../components/Shared/RangeSlider';
import { useDispatch, useSelector } from 'react-redux';
import {
	initialBudgetSelector,
	budgetSelector
} from '../../store/selectors/createOpportunitySelectors';
import { convertStringBudgetToNumber } from '../../utils';
import {
	updateOpportunity,
	getOppTemplateField
} from '../../store/actions/createOpportunityActions';
import { StatusBar } from 'react-native';
import { useTheme, useNewOppFlow } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { useShallowEqualSelector } from '../../hooks/useShallowEqualSelector';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}
const SelectBudget: React.FC<IProps> = ({ navigation }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	let [showResetButton, setShowResetButton] = useState(false);
	useEffect(() => {
		dispatch(getOppTemplateField(TemplatesEnum.BUDGET_ID));
	}, []);
	// const { [TemplatesEnum.BUDGET_ID]: budgetArray, budget } = useSelector(
	// 	createOpportunitySelector
	// );

	const budgetArray = useShallowEqualSelector(initialBudgetSelector);
	const budget = useShallowEqualSelector(budgetSelector);
	const rangeSliderRef = useRef<IRangeSliderRefActions>(null);
	const theme = useTheme();
	const { goToNextScreen } = useNewOppFlow(navigation);
	const budgetRangerArray = useMemo(
		() =>
			budgetArray.map((item: { title: string }) =>
				convertStringBudgetToNumber(item.title)
			),
		[budgetArray]
	);

	if (!budgetArray.length) return <CoveringLoadingModal visible />;

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
			<S.TopPortion>
				<OppsScreenHeader
					pre={t('opps.selectBudget.selectThe')}
					header={t('opps.selectBudget.budget')}
					alignment='stretch'
					marginTop={deviceHeight * 0.0156}
				/>
				<RangeSlider
					minValue={Math.min(...budgetRangerArray)}
					maxValue={Math.max(...budgetRangerArray)}
					onValueChange={({
						value,
						isInitialRender
					}: RangeSliderChangeCallbackParams) => {
						if (!isInitialRender) {
							setShowResetButton(true);
						}

						dispatch(updateOpportunity('budget', value));
					}}
					ref={rangeSliderRef}
				/>
			</S.TopPortion>
			<S.BottomPortion>
				{showResetButton && (
					<S.ResetButton
						rounded
						text='Reset'
						width={deviceWidth * 0.2166}
						height={deviceHeight * 0.0546}
						backgroundColor={theme.colors.gray19}
						onPress={() => {
							rangeSliderRef.current!.setResetToInitialValue();
							setShowResetButton(false);
							dispatch(updateOpportunity('budget', null));
						}}
					/>
				)}
			</S.BottomPortion>

			<Button
				width={deviceWidth}
				borderRadius='0px'
				gradientBackground={budget ? 'orange' : 'gray'}
				text={t(
					`opps.businessType.${
						budget ? 'buttonActionText' : 'buttonInActionText'
					}`
				)}
				textColor={theme.colors.white}
				onPress={() => goToNextScreen()}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View(
	({ theme }: { theme: DefaultTheme }) => `
	flex: 1;
	background-color: ${theme.colors.white};
`
);

S.TopPortion = styled.View`
	width: 100%;
	height: ${deviceHeight * 0.5953};
	background-color: ${({ theme }) => theme.colors.white};
	padding-horizontal: ${deviceWidth * 0.0694};
	padding-bottom: ${deviceWidth * 0.0875};
`;

S.BottomPortion = styled.View(
	({ theme }: { theme: DefaultTheme }) => `
	background-color: ${theme.colors.gray14};
	width: 100%;
	height: 30%;
`
);

S.ResetButton = styled(Button)`
	margin-bottom: ${deviceHeight * 0.2109};
`;

export default SelectBudget;
