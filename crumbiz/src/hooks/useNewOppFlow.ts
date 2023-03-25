import { useState, useCallback } from 'react';
import { useSelector } from 'react-redux';

import { OpportunityTypesEnum } from '../types/enums';

import { NavigationScreenProp } from 'react-navigation';
import { getSelectedOppTypeId } from '../store/selectors/createOpportunitySelectors';
import { ScreensEnum } from '../navigation/screens';

const usenNewOppFlow = (navigation: NavigationScreenProp<any>) => {
	// The screens mappers must stay here, pulling them outside is causing runtime error
	const lastScreen = ScreensEnum.SELECT_YOUR_ROLE;
	const hiringFlow = [ScreensEnum.CHOOSE_VERTICAL, lastScreen];
	const fundraisingFlow = [
		ScreensEnum.CHOOSE_VERTICAL,
		ScreensEnum.SELECT_BUDGET,
		lastScreen
	];
	const serviceProviderFlow = [
		ScreensEnum.CHOOSE_VERTICAL,
		ScreensEnum.SERVICE_PROVIDER,
		lastScreen
	];
	const businessTypeFlow = [
		ScreensEnum.CHOOSE_VERTICAL,
		ScreensEnum.BUSINESS_TYPE,
		lastScreen
	];

	const createOppFlowMapper = {
		[OpportunityTypesEnum.HIRING]: hiringFlow,
		[OpportunityTypesEnum.FUNDRAISING]: fundraisingFlow,
		[OpportunityTypesEnum.SERVICE_PROVIDER]: serviceProviderFlow,
		[OpportunityTypesEnum.BUSINESS_DEVELOPMENT]: businessTypeFlow
	};
	const oppType: OpportunityTypesEnum = useSelector(getSelectedOppTypeId);

	const getNextRoute = useCallback(
		(currentScreen: ScreensEnum): ScreensEnum => {
			const currentFlow = createOppFlowMapper[oppType];
			const currentIndex = currentFlow.indexOf(currentScreen);
			return currentFlow[currentIndex + 1];
		},
		[oppType]
	);

	const initialScreen = ScreensEnum.SET_OPPORTUNITY_TITLE;

	const goToNextScreen = useCallback(() => {
		const currentScreen = navigation.state.routeName;

		if (currentScreen === initialScreen) {
			navigation.navigate(createOppFlowMapper[oppType][0]);
		} else {
			navigation.navigate(getNextRoute(currentScreen));
		}
	}, [navigation.state.routeName]);

	return { goToNextScreen };
};

export default usenNewOppFlow;
