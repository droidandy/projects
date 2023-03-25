import React, { useCallback, useMemo } from 'react';
import styled from 'styled-components/native';
import { TabView } from '../../../Shared';
import { useTranslation } from 'react-i18next';
import ConnectorsTab from './ConnectorsTab';
import { EntityEnum } from '../../../../types/enums';
import {
	oppIdSelector,
	oppInteractionsSelectors,
	oppOverviewSelector
} from '../../../../store/selectors/oppOverviewSelector';
import { useSelector } from 'react-redux';
import NewsFeed from './NewsFeedTab';
import TargetsTab from './TargetsTab';
import {
	StateUpdaterFunction,
	PlainFunction
} from '../../../../types/interfaces';
import InteractionsFeed from '../../../InteractionsFeed';
import BioTab from '../../../../screens/UserProfile/UserProfileTabs/BioTab';
import { useTheme } from '../../../../hooks';
import { deviceHeight } from '../../../../utils/dimensions';
import OppsTab from '../../../../screens/UserProfile/UserProfileTabs/OppsTab';
import { selectInteractionsData } from '../../../../store/selectors/interactionsSelectors';
import withPagination from '../../../../hoc/withPagination';
import { createPaginatedRequestAction } from '../../../../store/actions/utils';
import { getOppInteractionsData } from '../../../../store/actions/oppOverviewActions';
import { OppOverviewTypes } from '../../../../store/constants';
import compose from '../../../../hoc/compose';
import withLoading, { PropagatingSwitcher } from '../../../../hoc/withLoading';
import { createLoadingSelector } from '../../../../store/selectors/pendingSelectors';

interface IProps {
	tabIndex: number;
	setTabIndex: StateUpdaterFunction<number>;
	comingFromUserProfile?: boolean;
	handleOppOverviewRefresh: PlainFunction;
}
const Decorator = compose(
	withLoading({
		selector: createLoadingSelector(OppOverviewTypes.GET_OPP_INTERACTIONS),
		Switcher: PropagatingSwitcher
	}),
	withPagination({
		top: 20,
		action: getOppInteractionsData,
		actionType: OppOverviewTypes.GET_OPP_INTERACTIONS,
		dataSelector: oppInteractionsSelectors.selectOpportunityData,
		countSelector: oppInteractionsSelectors.selectOpportunityCount,
		enhancer: createPaginatedRequestAction
	})
);

const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

const Tabs: React.FC<IProps> = props => {
	const {
		tabIndex,
		setTabIndex,
		comingFromUserProfile,
		handleOppOverviewRefresh
	} = props;
	const theme = useTheme();
	const { t } = useTranslation();
	const { role } = useSelector(oppOverviewSelector);
	const selectedOppId = useSelector(oppIdSelector);

	const tabs = useMemo(() => {
		const _dynamicTabs = comingFromUserProfile
			? [
					{
						component: () => <BioTab />,
						key: 'tab1',
						title: t('userProfile.tabs.bioTab.header')
					},
					{
						component: () => <OppsTab />,
						key: 'tab2',
						title: t('userProfile.tabs.oppsTab.header')
					}
			  ]
			: [
					{
						component: () => (
							<TargetsTab handleOppOverviewRefresh={handleOppOverviewRefresh} />
						),
						key: 'tab1',
						title: t('oppOverview.oppOverview.tabs.targets.tabName')
					},
					{
						component: () => (
							<PaginatedInteractionsFeed
								actionProps={{ oppId: selectedOppId }}
							/>
						),
						key: 'tab2',
						title: t('oppOverview.oppOverview.tabs.newsFeed.tabName')
					}
			  ];

		if (role === EntityEnum.OWNER && !comingFromUserProfile) {
			_dynamicTabs.push({
				component: () => <ConnectorsTab />,
				key: 'tab3',
				title: t('oppOverview.oppOverview.tabs.connectors.tabName')
			});
		}

		return _dynamicTabs;
	}, []);

	return (
		<S.Container>
			{comingFromUserProfile ? (
				<TabView
					tabs={tabs}
					index={tabIndex}
					setIndex={setTabIndex}
					marginBottom={deviceHeight * 0.032}
					tabBarBackgroundColor={theme.colors.gray12}
				/>
			) : (
				<TabView index={tabIndex} setIndex={setTabIndex} tabs={tabs} />
			)}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

export default Tabs;
