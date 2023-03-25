import React, { useEffect, useRef } from 'react';
import styled from 'styled-components/native';
import FeedHeader from './FeedHeader';
import {
	getInteractionsData,
	getSummaryData
} from '../../store/actions/interactionsActions';
import { useActions } from '../../hooks/useAct';
import { createShadow } from '../../utils';
import { useSelector, useDispatch } from 'react-redux';
import { selectSummaryData } from '../../store/selectors/summarySelectors';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import {
	selectInteractionsCount,
	selectInteractionsData
} from '../../store/selectors/interactionsSelectors';

import withPagination from '../../hoc/withPagination';
import { createPaginatedRequestAction } from '../../store/actions/utils';
import { deviceHeight } from '../../utils/dimensions';
import InteractionsFeed from '../../components/InteractionsFeed';

import compose from '../../hoc/compose';
import withLoading, { PropagatingSwitcher } from '../../hoc/withLoading';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { InteractionsTypes } from '../../store/constants';
import { clearInteractionState } from '../../store/actions/interactionsActions';
import { IStackNavigation } from '../../types/interfaces';
import { useNavigationFocus } from '../../hooks';
import { NavigationEventPayload } from 'react-navigation';
import navigationService from '../../services/NavigationService';

interface IProps extends IStackNavigation {}

const Decorator = compose(
	withLoading({
		selector: createLoadingSelector(InteractionsTypes.GET_INTERACTIONS),
		Switcher: PropagatingSwitcher
	}),
	withPagination({
		top: 10,
		enhancer: createPaginatedRequestAction,
		dataSelector: selectInteractionsData,
		countSelector: selectInteractionsCount,
		action: getInteractionsData,
		actionType: InteractionsTypes.GET_INTERACTIONS
	})
);

const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

const NewsFeed: React.FC<IProps> = props => {
	const actions = useActions({ getSummaryData, clearInteractionState });
	const user = useSelector(getUserDataSelector);
	const summary = useSelector(selectSummaryData);

	const dispatch = useDispatch();

	useNavigationFocus((payload: NavigationEventPayload) => {
		if (payload.lastState) {
			dispatch(clearInteractionState());
			actions.getSummaryData();
		}
	});

	useEffect(() => {
		actions.getSummaryData();
	}, []);

	return (
		<S.Container>
			<S.RoundedContainer>
				<PaginatedInteractionsFeed
					withRefreshing={true}
					refreshAction={() => {
						actions.getSummaryData();
						actions.clearInteractionState();
					}}
					listProps={{
						ListHeaderComponent: () => (
							<S.HeaderContainer>
								<FeedHeader summary={summary} user={user} />
							</S.HeaderContainer>
						)
					}}
					backgroundColor='white'
				/>
			</S.RoundedContainer>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.View`
	flex: 1;
	background: ${({ theme }) => theme.colors.white};
`;

S.RoundedContainer = styled.View`
	${createShadow({ elevation: 0.9 })};
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.white};
	margin-top: ${-deviceHeight * 0.03125}px;
`;

S.HeaderContainer = styled.View`
	margin-bottom: -22px;
`;

export default NewsFeed;
