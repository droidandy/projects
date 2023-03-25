import React, { useCallback, useMemo, useEffect } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import {
	compareDesc,
	isAfter,
	isBefore,
	isToday,
	isYesterday,
	subDays,
	endOfDay
} from 'date-fns';
import FeedCard from './FeedCard';
import { DynamicObject, PlainFunction } from '../../types/interfaces';
import { CoveringLoadingModal, CustomText, Icons } from '../Shared';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import structures, { defaultBuilder } from './structures';
import { SectionList, RefreshControl } from 'react-native';
import { formatDistanceToNow } from 'date-fns/esm';
import { IVInteraction } from '../../types/interfaces';
import { useNavigation } from 'react-navigation-hooks';
import SectionHeader, {
	SectionHeaderText
} from '../OppOverview/OppOverview/SectionHeader';

interface IProps {
	loading: boolean;
	withPaddingBottom?: boolean;
	backgroundColor?: string;
	data: Array<IVInteraction>;
	onEndReached?: (info: { distanceFromEnd: number }) => void;
	listProps?: DynamicObject<any>;
	withRefresh: boolean;
	refreshAction: PlainFunction;
}

interface FeedGroup {
	title: string;
	data: Array<IVInteraction>;
	dates: Array<Date>;
}

const generateGroup = (startDate: Date, endDate: Date) => {
	{
	}
	let title;
	if (isToday(startDate)) {
		title = 'Today';
	} else if (isYesterday(startDate)) {
		title = 'Yesterday';
	} else {
		title = `${formatDistanceToNow(startDate)} ago`;
	}
	return {
		title,
		data: [],
		dates: [startDate, endDate]
	};
};

const generateGroups = (lastDate: Date, newestInteractionDate: Date) => {
	let startDate = endOfDay(newestInteractionDate);
	let endDate = subDays(startDate, 1);
	const groups = [];
	while (isAfter(endDate, lastDate)) {
		groups.push(generateGroup(startDate, endDate));

		startDate = endDate;
		endDate = subDays(startDate, 1);
	}

	if (isBefore(endDate, lastDate)) {
		groups.push(generateGroup(startDate, endDate));
	}
	return groups;
};

const groupInteractionsByDays = (interactions: Array<IVInteraction>) => {
	const newestInteractionDate = new Date(interactions[0].timestamp);
	const oldestInteraction = interactions[interactions.length - 1];
	const oldestInteractionDate = new Date(oldestInteraction.timestamp);
	const groups: Array<FeedGroup> = generateGroups(
		oldestInteractionDate,
		newestInteractionDate
	);

	interactions.forEach(interaction => {
		const interactionDate = new Date(interaction.timestamp);
		const relevantGroup = groups.find(group => {
			const [startDate, endDate] = group.dates;
			return (
				isBefore(interactionDate, startDate) &&
				isAfter(interactionDate, endDate)
			);
		});

		if (relevantGroup) {
			relevantGroup.data.push(interaction);
		}
	});
	return groups
		.filter(group => group.data.length)
		.map((group, index) => ({
			...group,
			data: group.data.sort((a, b) =>
				compareDesc(new Date(a.timestamp), new Date(b.timestamp))
			),
			order: index
		}));
};

type ScreensViewingFeed = 'Home' | 'TargetProfile' | 'OppOverview' | 'OppCrumb';

const ListEmptyView = () => {
	const emptyViewTextMapper = {
		Home: {
			header: 'Create a new Opp',
			body: 'Once you create your Opp. you can view and manage it right here'
		},
		TargetProfile: {
			header: 'You dont have interactions yet',
			body:
				'Once you and the contributor will have interactions they will appear here.'
		},
		OppCrumb: {
			header: 'You dont have interactions yet',
			body:
				'Once you and the owner will have interactions they will appear here.'
		},
		OppOverview: {
			header: 'You dont have interactions yet',
			body:
				'Once you and the contributor will have interactions they will appear here.'
		}
	};

	const navigation = useNavigation();
	const currentRoute = navigation.state.routeName;
	const emptyViewText = emptyViewTextMapper[currentRoute as ScreensViewingFeed];
	return (
		<S.CenteredContainer>
			<Icons.EmptyFeedIcon
				width={deviceWidth * 0.5}
				height={deviceHeight * 0.25}
			/>
			<S.TextContainer>
				<S.LastLabel text={emptyViewText.header} size='s16' />
				<S.LastLabel text={emptyViewText.body} size='s13' color={'gray15'} />
			</S.TextContainer>
		</S.CenteredContainer>
	);
};

const InteractionsFeed: React.FC<IProps> = props => {
	const {
		withPaddingBottom,
		backgroundColor,
		data,
		onEndReached,
		loading,
		listProps = {},
		withRefresh,
		refreshAction
	} = props;

	const handleRefresh = useCallback(() => {
		refreshAction();
	}, []);

	const handleEndReached = useCallback(
		distance => {
			if (!loading && onEndReached) {
				onEndReached(distance);
			}
		},
		[onEndReached, loading]
	);

	const sections = useMemo(() => {
		const filterDuplicateInteractions = data.reduce((total, interacrtion) => {
			if (!total[interacrtion.id]) {
				total[interacrtion.id] = interacrtion;
			}
			return total;
		}, {} as { [key: string]: IVInteraction });

		const filteredInteractionsList = Object.values(filterDuplicateInteractions);
		return filteredInteractionsList.length
			? groupInteractionsByDays(filteredInteractionsList)
			: [];
	}, [data]);

	return (
		<S.Container
			withPaddingBottom={withPaddingBottom}
			backgroundColor={backgroundColor}
		>
			{loading && !data.length && <CoveringLoadingModal visible />}
			<SectionList
				bounces={withRefresh}
				refreshControl={
					<RefreshControl
						enabled={withRefresh}
						refreshing={false}
						onRefresh={handleRefresh}
					/>
				}
				sections={sections}
				initialNumToRender={20}
				onEndReachedThreshold={0.01}
				onMomentumScrollEnd={handleEndReached}
				stickySectionHeadersEnabled={false}
				renderItem={({ item }) => (
					<S.PaddingContainer>
						<FeedCard
							interaction={item}
							structureBuilder={
								structures[item.interactionTypeId] || defaultBuilder
							}
						/>
					</S.PaddingContainer>
				)}
				renderSectionHeader={({ section }) => (
					<S.SectionContainer rounded={section.order === 0}>
						<S.PaddingContainer>
							<S.Capitalize>
								<SectionHeader>
									<SectionHeaderText text={section.title} />
								</SectionHeader>
							</S.Capitalize>
						</S.PaddingContainer>
					</S.SectionContainer>
				)}
				ListEmptyComponent={!loading ? ListEmptyView : null}
				ListFooterComponent={() => (
					<S.LoaderContainer>
						<CoveringLoadingModal visible={loading} />
					</S.LoaderContainer>
				)}
				keyExtractor={item => item.id}
				{...listProps}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	overflow: hidden;
	background-color: ${({
		theme,
		backgroundColor
	}: {
		backgroundColor: string;
		theme: DefaultTheme;
	}) => backgroundColor || theme.colors.white};
`;

S.Capitalize = styled.View`
	text-transform: capitalize;
`;

S.TextContainer = styled.View`
	width: ${deviceWidth * 0.7};
`;

S.LastLabel = styled(CustomText)`
	text-align: center;
	margin-top: ${deviceHeight * 0.015};
`;

S.PaddingContainer = styled.View`
	padding-horizontal: ${deviceWidth * 0.06666666666};
`;

S.CenteredContainer = styled.View`
	flex: 1;
	padding-top: ${deviceHeight * 0.13168896321};
	justify-content: center;
	align-items: center;
`;

S.SectionContainer = styled.View`
	${({ rounded }: { rounded: boolean }) =>
		rounded &&
		`
		border-top-left-radius: 25;
		border-top-right-radius: 25;
	`}

	background-color: white;
`;

S.LoaderContainer = styled.View`
	margin-top: ${(64 / 2) * 1.5};
	margin-bottom: ${64 * 2};
`;
export default InteractionsFeed;
