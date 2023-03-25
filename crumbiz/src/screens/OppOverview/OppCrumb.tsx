import React, {
	FC,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import styled from 'styled-components/native';
import {
	Animated,
	LayoutChangeEvent,
	View,
	RefreshControl
} from 'react-native';
import {
	CoveringLoadingModal,
	CustomText,
	GradientHeader,
	PaddingHorizontalContainer,
	SlidingDropdown
} from '../../components/Shared';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
	EntityEnum,
	InteractionMenuOptionsEnum,
	TargetStatusesEnum
} from '../../types/enums';
import { useDispatch, useSelector } from 'react-redux';
import {
	changeTargetStatus,
	getNewOppAndTargetProfile,
	getTargetOverviewInteractionsData,
	resetOppOverviewState,
	sendInteraction
} from '../../store/actions/oppOverviewActions';
import {
	IOppOverViewSelector,
	oppCrumbSelectors,
	oppOverviewSelector
} from '../../store/selectors/oppOverviewSelector';
import { ConnectedBy } from '../../components/OppOverview';
import MyPartIsDoneButton from '../../components/OppOverview/OppOverview/MyPartIsDoneButton';
import { useEffectAfterMount } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import ProfileImage from '../../components/OppOverview/ProfileImageWithIntroStatusIndicator';
import TargetProfileContents from '../../components/OppOverview/OppOverview/Tabs/TargetProfileContents';
import IntroStatusCrumb from '../../components/OppOverview/OppOverview/IntroStatusCrumb';
import { createShadow } from '../../utils';
import { OpSummary } from '../../components/Shared/OpSummary';

import { IModalAndSlidingDropdownControls } from '../../types/interfaces';
import ChangeIntroStatusButton from '../../components/OppOverview/OppOverview/ChangeIntroStatusButton';
import NowYouCanInteractWithTheOwner from '../../components/OppOverview/Modals/NowYouCanInteractWithTheOwnerModal';
import MyPartIsDoneModal from '../../components/OppOverview/Modals/MyPartIsDoneModal';
import extractAvatarFromUser from '../../utils/extractAvatarFromUser';
import TargetProfileQuestions, {
	activeButtonType
} from '../../components/Shared/NewsFeed/TargetProfileQuestions';
import TargetProfileMessages from '../../components/Shared/NewsFeed/TargetProfileMessages';
import TargetProfileCalendar from '../../components/Shared/NewsFeed/TargetProfileCalendar';
import InteractionsFeed from '../../components/InteractionsFeed';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import withPagination from '../../hoc/withPagination';
import { createPaginatedRequestAction } from '../../store/actions/utils';
import { SubcontentOpenContext } from './SubcontentOpenContext';
import { OppOverviewTypes } from '../../store/constants';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import withLoading, { PropagatingSwitcher } from '../../hoc/withLoading';
import compose from '../../hoc/compose';
import { resetTargetOverviewInteractions } from '../../store/actions/oppOverviewActions';

const Decorator = compose(
	withLoading({
		selector: createLoadingSelector(
			OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS
		),
		Switcher: PropagatingSwitcher
	}),
	withPagination({
		top: 10,
		dataSelector: oppCrumbSelectors.selectOppCrumbData,
		countSelector: oppCrumbSelectors.selectOppCrumbCount,
		action: getTargetOverviewInteractionsData,
		actionType: OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS,
		enhancer: createPaginatedRequestAction
	})
);

const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

const OppCrumb: FC<any> = () => {
	const dispatch = useDispatch();

	const [activeButton, setActiveButton] = useState<activeButtonType>(null);
	const [createdByHeight, setCreatedByHeight] = useState(0);
	const [expandSubcontents, toggleExpandSubcontents] = useState(false);
	const animated = useRef(new Animated.Value(0)).current;
	const connectedByVerticalOffset = useRef(0);
	const mainScrollViewRef = useRef(null);
	const dropdownRef = useRef<IModalAndSlidingDropdownControls>(null);
	const nowYouCanInteractModalRef = useRef<IModalAndSlidingDropdownControls>(
		null
	);
	const MyPartIsDoneModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	const {
		newOppAndTargetProfileDataArrived,
		newOppAndTargetProfile,
		oppSummary
	}: IOppOverViewSelector = useSelector(oppOverviewSelector);

	const userData = useSelector(getUserDataSelector);
	const {
		user1: connector,
		user: owner,
		opportunity,
		opportunityTargets
	} = newOppAndTargetProfile;

	useEffect(() => {
		// Fetches screen data if data did not arrive from NewOpp screen
		if (!newOppAndTargetProfileDataArrived) {
			dispatch(getNewOppAndTargetProfile());
		} else {
			nowYouCanInteractModalRef.current?.open();
		}

		return () => {
			dispatch(resetOppOverviewState());
		};
	}, []);

	const sendInteractionHandler = useCallback(
		({ body, isPredefinedMessage, predefinedMessageTemplateId }) => {
			dispatch(
				sendInteraction({
					body,
					ownerUserId: owner.id!,
					targetId: opportunityTargets[0].id,
					connectorId: newOppAndTargetProfile.id,
					connectorUserId: connector.id!,
					isPredefinedMessage,
					predefinedMessageTemplateId,
					cb: () => {
						toggleExpandSubcontents(false);
						setActiveButton(null);
					}
				})
			);
		},
		[newOppAndTargetProfile]
	);

	const connectedByConfig = useMemo(() => {
		if (!newOppAndTargetProfileDataArrived) return {};
		const [avatar, avatarType] = extractAvatarFromUser(connector);
		return {
			action: EntityEnum.TARGET,
			connectorProfile: {
				connectorUsername: `${connector.firstName} ${connector.lastName}`,
				avatar,
				avatarType
			},
			titleConfig: {
				color: 'halfWhite'
			},
			usernameConfig: {
				color: 'white'
			}
		};
	}, [connector]);

	const { ownerAvatar, ownerAvatarType, ownerUsername } = useMemo(() => {
		if (!newOppAndTargetProfileDataArrived)
			return { ownerAvatar: '', ownerAvatarType: '', ownerUsername: '' };
		const [avatar, avatarType] = extractAvatarFromUser(owner);
		return {
			ownerAvatar: avatar,
			ownerAvatarType: avatarType,
			ownerUsername: `${owner.firstName} ${owner.lastName}`
		};
	}, [owner]);

	const oppTargetStatus = useMemo(() => {
		if (newOppAndTargetProfileDataArrived) {
			return opportunityTargets[0].opportunityTargetStatusId;
		}
	}, [newOppAndTargetProfile, newOppAndTargetProfileDataArrived]);

	// useEffectAfterMount(() => {
	// 	Animated.spring(animated, {
	// 		toValue: Number(expandSubcontents),
	// 		useNativeDriver: true
	// 	}).start();
	// }, [expandSubcontents]);

	const translateYInterpolation = animated.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -connectedByVerticalOffset.current]
	});

	if (!newOppAndTargetProfileDataArrived) {
		return <CoveringLoadingModal visible />;
	}

	return (
		<>
			<SlidingDropdown ref={dropdownRef} location='top'>
				{/* Todo All - i18n */}
				<CustomText text='Opp Details' />
				{/*
        //@ts-ignore // TODO All - check why ts warns here */}
				<OpSummary data={oppSummary} trimmed />
			</SlidingDropdown>
			<SubcontentOpenContext.Provider
				value={{
					isExpanded: expandSubcontents,
					toggleExpanded: toggleExpandSubcontents,
					scrollViewRef: mainScrollViewRef
				}}
			>
				<KeyboardAwareScrollView
					keyboardShouldPersistTaps='always'
					enableOnAndroid
					ref={mainScrollViewRef}
					refreshControl={
						<RefreshControl
							enabled
							refreshing={false}
							onRefresh={() => {
								dispatch(resetTargetOverviewInteractions());
							}}
						/>
					}
				>
					<S.Container
						style={{ transform: [{ translateY: translateYInterpolation }] }}
					>
						<GradientHeader
							dropdownRef={dropdownRef}
							headerText={opportunity.title}
							// @ts-ignore // TODO All - find why it throws an error
							connectedByConfig={connectedByConfig}
						/>
						<PaddingHorizontalContainer>
							<S.ContentContainer createdByHeight={createdByHeight}>
								<S.CreatedByContainer
									onLayout={(event: LayoutChangeEvent) => {
										const { height } = event.nativeEvent.layout;
										if (createdByHeight === 0) {
											setCreatedByHeight(height);
										}
									}}
									createdByHeight={createdByHeight}
								>
									<ProfileImage // Owner avatar
										size={deviceWidth * 0.1506}
										status={opportunityTargets[0].opportunityTargetStatusId}
										avatar={ownerAvatar!}
										avatarType={ownerAvatarType!}
										username={ownerUsername}
									/>
									<S.ConntectedByCrumbWrapper>
										<ConnectedBy
											textColumn
											titleSize='s12'
											usernameSize='s16'
											action={EntityEnum.CONNECTOR} // changes the text in the owner container to Created by
											connectorProfile={{
												connectorUsername: ownerUsername,
												avatar: ownerAvatar!,
												avatarType: ownerAvatarType!
											}}
											avatarSize={0.16667}
										/>
										<IntroStatusCrumb status={oppTargetStatus!} />
									</S.ConntectedByCrumbWrapper>
								</S.CreatedByContainer>
							</S.ContentContainer>
						</PaddingHorizontalContainer>
						<S.BottomContentContainer
							onLayout={(event: LayoutChangeEvent) => {
								const { y } = event.nativeEvent.layout;
								connectedByVerticalOffset.current = y;
							}}
						>
							<TargetProfileContents
								entityUserName={ownerUsername}
								sendInteractionHandler={sendInteractionHandler}
								setActiveTab={setActiveButton}
								activeTab={activeButton}
								targetId={opportunityTargets[0].id}
								defaultTab={
									<View style={{ flex: 1 }}>
										<PaginatedInteractionsFeed
											actionProps={{
												targetUserId: userData.id,
												ownerUserId: owner.id,
												oppId: opportunity.id
											}}
										/>
									</View>
								}
								tabs={{
									[InteractionMenuOptionsEnum.QUESTION]: (
										<TargetProfileQuestions
											activeButton={activeButton}
											setActiveButton={setActiveButton}
											sendInteractionHandler={sendInteractionHandler}
											toggleExpandSubcontents={toggleExpandSubcontents}
										/>
									),
									[InteractionMenuOptionsEnum.MESSAGE]: (
										<TargetProfileMessages
											sendInteractionHandler={sendInteractionHandler}
											setActiveButton={setActiveButton}
											toggleExpandSubcontents={toggleExpandSubcontents}
											entityName={ownerUsername}
										/>
									),
									[InteractionMenuOptionsEnum.CALENDAR]: (
										<>
											<TargetProfileCalendar />
											<PaginatedInteractionsFeed
												actionProps={{
													targetUserId: userData.id,
													ownerUserId: owner.id
												}}
											/>
										</>
									)
								}}
							/>
						</S.BottomContentContainer>
					</S.Container>
				</KeyboardAwareScrollView>
			</SubcontentOpenContext.Provider>

			{oppTargetStatus === TargetStatusesEnum.INTRO &&
				activeButton !== InteractionMenuOptionsEnum.MESSAGE && (
					<S.TargetChangeStatusButton
						statusId={oppTargetStatus}
						targetId={opportunityTargets[0].id}
						onPress={() => {}} // TODO Yaron - probably dont need here
						oppStatus={opportunity.opportunityStatusId}
						showGradientBackground
						textSize={20}
					/>
				)}
			{(oppTargetStatus === TargetStatusesEnum.WE_ARE_GOOD_TO_GO ||
				oppTargetStatus === TargetStatusesEnum.MY_PART_IS_DONE) && (
				<S.MyPartIsDoneButton
					onPress={() => {
						dispatch(
							changeTargetStatus({
								newStatus: TargetStatusesEnum.MY_PART_IS_DONE,
								targetId: opportunityTargets[0].id
							})
						);
						MyPartIsDoneModalRef.current?.open();
					}}
					statusId={oppTargetStatus}
					targetId={opportunityTargets[0].id}
				/>
			)}
			<NowYouCanInteractWithTheOwner ref={nowYouCanInteractModalRef} />
			<MyPartIsDoneModal
				ownerUsername={ownerUsername}
				ref={MyPartIsDoneModalRef}
			/>
		</>
	);
};

const S: any = {};

S.ScrollView = styled.ScrollView<{ isExpanded?: boolean }>`
	/* min-height: ${({ isExpanded }) => (isExpanded ? deviceHeight * 1.5 : 0)}; */
	flex: 1;
`;

S.Container = styled(Animated.View)`
	background-color: ${({ theme }) => theme.colors.gray12};
`;

S.ConntectedByCrumbWrapper = styled.View`
	align-items: flex-start;
	padding-left: ${deviceWidth * 0.02777};
`;

S.TextContainer = styled.View`
	margin-top: ${deviceHeight * 0.05};
`;

S.CreatedByContainer = styled(Animated.View)`
	background-color: white;
	width: 100%;
	aspect-ratio: 3.1;
	align-items: flex-start;
	flex-direction: row;
	justify-content: flex-start;
	align-items: center;
	border-radius: 18;
	padding-horizontal: ${deviceWidth * 0.055};
	margin-top: -${({ createdByHeight }) => createdByHeight / 2.1}px;
	${createShadow()};
`;

S.ContentContainer = styled.View<{ createdByHeight: number }>``;

S.BottomContentContainer = styled.View``;

S.TargetChangeStatusButton = styled(ChangeIntroStatusButton)`
	position: absolute;
	width: ${deviceWidth * 0.75833333333};
	aspect-ratio: 4.55;
	bottom: ${deviceHeight * 0.0375};
`;

S.MyPartIsDoneButton = styled(MyPartIsDoneButton)`
	position: absolute;
	width: ${deviceWidth * 0.75833333333};
	aspect-ratio: 4.55;
	bottom: ${deviceHeight * 0.0375};
`;

export default OppCrumb;

// This is the old version with the expandable UI, we changed the behaviour to fit the send message screen
// import React, {
// 	FC,
// 	useCallback,
// 	useEffect,
// 	useMemo,
// 	useRef,
// 	useState
// } from 'react';
// import styled from 'styled-components/native';
// import {
// 	Animated,
// 	LayoutChangeEvent,
// 	View,
// 	RefreshControl
// } from 'react-native';
// import {
// 	CoveringLoadingModal,
// 	CustomText,
// 	GradientHeader,
// 	PaddingHorizontalContainer,
// 	SlidingDropdown
// } from '../../components/Shared';
// import {
// 	EntityEnum,
// 	InteractionMenuOptionsEnum,
// 	TargetStatusesEnum
// } from '../../types/enums';
// import { useDispatch, useSelector } from 'react-redux';
// import {
// 	changeTargetStatus,
// 	getNewOppAndTargetProfile,
// 	getTargetOverviewInteractionsData,
// 	resetOppOverviewState,
// 	sendInteraction
// } from '../../store/actions/oppOverviewActions';
// import {
// 	IOppOverViewSelector,
// 	oppCrumbSelectors,
// 	oppOverviewSelector
// } from '../../store/selectors/oppOverviewSelector';
// import { ConnectedBy } from '../../components/OppOverview';
// import MyPartIsDoneButton from '../../components/OppOverview/OppOverview/MyPartIsDoneButton';
// import { useEffectAfterMount } from '../../hooks';
// import { deviceHeight, deviceWidth } from '../../utils/dimensions';
// import ProfileImage from '../../components/OppOverview/ProfileImageWithIntroStatusIndicator';
// import TargetProfileContents from '../../components/OppOverview/OppOverview/Tabs/TargetProfileContents';
// import IntroStatusCrumb from '../../components/OppOverview/OppOverview/IntroStatusCrumb';
// import { createShadow } from '../../utils';
// import { OpSummary } from '../../components/Shared/OpSummary';

// import { IModalAndSlidingDropdownControls } from '../../types/interfaces';
// import ChangeIntroStatusButton from '../../components/OppOverview/OppOverview/ChangeIntroStatusButton';
// import NowYouCanInteractWithTheOwner from '../../components/OppOverview/Modals/NowYouCanInteractWithTheOwnerModal';
// import MyPartIsDoneModal from '../../components/OppOverview/Modals/MyPartIsDoneModal';
// import extractAvatarFromUser from '../../utils/extractAvatarFromUser';
// import TargetProfileQuestions, {
// 	activeButtonType
// } from '../../components/Shared/NewsFeed/TargetProfileQuestions';
// import TargetProfileMessages from '../../components/Shared/NewsFeed/TargetProfileMessages';
// import TargetProfileCalendar from '../../components/Shared/NewsFeed/TargetProfileCalendar';
// import InteractionsFeed from '../../components/InteractionsFeed';
// import { getUserDataSelector } from '../../store/selectors/authSelector';
// import withPagination from '../../hoc/withPagination';
// import { createPaginatedRequestAction } from '../../store/actions/utils';
// import { SubcontentOpenContext } from './SubcontentOpenContext';
// import { OppOverviewTypes } from '../../store/constants';
// import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
// import withLoading, { PropagatingSwitcher } from '../../hoc/withLoading';
// import compose from '../../hoc/compose';
// import { resetTargetOverviewInteractions } from '../../store/actions/oppOverviewActions';

// const Decorator = compose(
// 	withLoading({
// 		selector: createLoadingSelector(
// 			OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS
// 		),
// 		Switcher: PropagatingSwitcher
// 	}),
// 	withPagination({
// 		top: 10,
// 		dataSelector: oppCrumbSelectors.selectOppCrumbData,
// 		countSelector: oppCrumbSelectors.selectOppCrumbCount,
// 		action: getTargetOverviewInteractionsData,
// 		actionType: OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS,
// 		enhancer: createPaginatedRequestAction
// 	})
// );

// const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

// const OppCrumb: FC<any> = () => {
// 	const dispatch = useDispatch();

// 	const [activeButton, setActiveButton] = useState<activeButtonType>(null);
// 	const [createdByHeight, setCreatedByHeight] = useState(0);
// 	const [expandSubcontents, toggleExpandSubcontents] = useState(false);
// 	const animated = useRef(new Animated.Value(0)).current;
// 	const connectedByVerticalOffset = useRef(0);
// 	const mainScrollViewRef = useRef(null);
// 	const dropdownRef = useRef<IModalAndSlidingDropdownControls>(null);
// 	const nowYouCanInteractModalRef = useRef<IModalAndSlidingDropdownControls>(
// 		null
// 	);
// 	const MyPartIsDoneModalRef = useRef<IModalAndSlidingDropdownControls>(null);
// 	const {
// 		newOppAndTargetProfileDataArrived,
// 		newOppAndTargetProfile,
// 		oppSummary
// 	}: IOppOverViewSelector = useSelector(oppOverviewSelector);

// 	const userData = useSelector(getUserDataSelector);
// 	const {
// 		user1: connector,
// 		user: owner,
// 		opportunity,
// 		opportunityTargets
// 	} = newOppAndTargetProfile;

// 	useEffect(() => {
// 		// Fetches screen data if data did not arrive from NewOpp screen
// 		if (!newOppAndTargetProfileDataArrived) {
// 			dispatch(getNewOppAndTargetProfile());
// 		} else {
// 			nowYouCanInteractModalRef.current?.open();
// 		}

// 		return () => {
// 			dispatch(resetOppOverviewState());
// 		};
// 	}, []);

// 	const sendInteractionHandler = useCallback(
// 		({ body, isPredefinedMessage, predefinedMessageTemplateId }) => {
// 			dispatch(
// 				sendInteraction({
// 					body,
// 					ownerUserId: owner.id!,
// 					targetId: opportunityTargets[0].id,
// 					connectorId: newOppAndTargetProfile.id,
// 					connectorUserId: connector.id!,
// 					isPredefinedMessage,
// 					predefinedMessageTemplateId
// 				})
// 			);
// 		},
// 		[newOppAndTargetProfile]
// 	);

// 	const connectedByConfig = useMemo(() => {
// 		if (!newOppAndTargetProfileDataArrived) return {};
// 		const [avatar, avatarType] = extractAvatarFromUser(connector);
// 		return {
// 			action: EntityEnum.TARGET,
// 			connectorProfile: {
// 				connectorUsername: `${connector.firstName} ${connector.lastName}`,
// 				avatar,
// 				avatarType
// 			},
// 			titleConfig: {
// 				color: 'halfWhite'
// 			},
// 			usernameConfig: {
// 				color: 'white'
// 			}
// 		};
// 	}, [connector]);

// 	const { ownerAvatar, ownerAvatarType, ownerUsername } = useMemo(() => {
// 		if (!newOppAndTargetProfileDataArrived)
// 			return { ownerAvatar: '', ownerAvatarType: '', ownerUsername: '' };
// 		const [avatar, avatarType] = extractAvatarFromUser(owner);
// 		return {
// 			ownerAvatar: avatar,
// 			ownerAvatarType: avatarType,
// 			ownerUsername: `${owner.firstName} ${owner.lastName}`
// 		};
// 	}, [owner]);

// 	const oppTargetStatus = useMemo(() => {
// 		if (newOppAndTargetProfileDataArrived) {
// 			return opportunityTargets[0].opportunityTargetStatusId;
// 		}
// 	}, [newOppAndTargetProfile, newOppAndTargetProfileDataArrived]);

// 	useEffectAfterMount(() => {
// 		Animated.spring(animated, {
// 			toValue: Number(expandSubcontents),
// 			useNativeDriver: true
// 		}).start();
// 	}, [expandSubcontents]);

// 	const translateYInterpolation = animated.interpolate({
// 		inputRange: [0, 1],
// 		outputRange: [0, -connectedByVerticalOffset.current]
// 	});

// 	if (!newOppAndTargetProfileDataArrived) {
// 		return <CoveringLoadingModal visible />;
// 	}

// 	return (
// 		<>
// 			<SlidingDropdown ref={dropdownRef} location='top'>
// 				{/* Todo All - i18n */}
// 				<CustomText text='Opp Details' />
// 				{/*
//         //@ts-ignore // TODO All - check why ts warns here */}
// 				<OpSummary data={oppSummary} trimmed />
// 			</SlidingDropdown>
// 			<SubcontentOpenContext.Provider
// 				value={{
// 					isExpanded: expandSubcontents,
// 					toggleExpanded: toggleExpandSubcontents,
// 					scrollViewRef: mainScrollViewRef
// 				}}
// 			>
// 				<S.ScrollView
// 					ref={mainScrollViewRef}
// 					scrollEnabled={!expandSubcontents}
// 					isExpanded={expandSubcontents}
// 					refreshControl={
// 						<RefreshControl
// 							enabled
// 							refreshing={false}
// 							onRefresh={() => {
// 								dispatch(resetTargetOverviewInteractions());
// 							}}
// 						/>
// 					}
// 				>
// 					<S.Container
// 						style={{ transform: [{ translateY: translateYInterpolation }] }}
// 					>
// 						<GradientHeader
// 							dropdownRef={dropdownRef}
// 							headerText={opportunity.title}
// 							// @ts-ignore // TODO All - find why it throws an error
// 							connectedByConfig={connectedByConfig}
// 						/>
// 						<PaddingHorizontalContainer>
// 							<S.ContentContainer createdByHeight={createdByHeight}>
// 								<S.CreatedByContainer
// 									onLayout={(event: LayoutChangeEvent) => {
// 										const { height } = event.nativeEvent.layout;
// 										setCreatedByHeight(height);
// 									}}
// 									createdByHeight={createdByHeight}
// 								>
// 									<ProfileImage // Owner avatar
// 										size={deviceWidth * 0.1506}
// 										status={opportunityTargets[0].opportunityTargetStatusId}
// 										avatar={ownerAvatar!}
// 										avatarType={ownerAvatarType!}
// 										username={ownerUsername}
// 									/>
// 									<S.ConntectedByCrumbWrapper>
// 										<ConnectedBy
// 											textColumn
// 											titleSize='s12'
// 											usernameSize='s16'
// 											action={EntityEnum.CONNECTOR} // changes the text in the owner container to Created by
// 											connectorProfile={{
// 												connectorUsername: ownerUsername,
// 												avatar: ownerAvatar!,
// 												avatarType: ownerAvatarType!
// 											}}
// 											avatarSize={0.16667}
// 										/>
// 										<IntroStatusCrumb status={oppTargetStatus!} />
// 									</S.ConntectedByCrumbWrapper>
// 								</S.CreatedByContainer>
// 							</S.ContentContainer>
// 						</PaddingHorizontalContainer>
// 						<S.BottomContentContainer
// 							onLayout={(event: LayoutChangeEvent) => {
// 								const { y } = event.nativeEvent.layout;
// 								connectedByVerticalOffset.current = y;
// 							}}
// 						>
// 							<TargetProfileContents
// 								sendInteractionHandler={sendInteractionHandler}
// 								setActiveTab={setActiveButton}
// 								activeTab={activeButton}
// 								defaultTab={
// 									<View style={{ flex: 1 }}>
// 										<PaginatedInteractionsFeed
// 											actionProps={{
// 												targetUserId: userData.id,
// 												ownerUserId: owner.id,
// 												oppId: opportunity.id
// 											}}
// 										/>
// 									</View>
// 								}
// 								tabs={{
// 									[InteractionMenuOptionsEnum.QUESTION]: (
// 										<TargetProfileQuestions
// 											activeButton={activeButton}
// 											setActiveButton={setActiveButton}
// 											sendInteractionHandler={sendInteractionHandler}
// 											toggleExpandSubcontents={toggleExpandSubcontents}
// 										/>
// 									),
// 									[InteractionMenuOptionsEnum.MESSAGE]: (
// 										<TargetProfileMessages
// 											sendInteractionHandler={sendInteractionHandler}
// 											setActiveButton={setActiveButton}
// 											toggleExpandSubcontents={toggleExpandSubcontents}
// 											entityName={ownerUsername}
// 										/>
// 									),
// 									[InteractionMenuOptionsEnum.CALENDAR]: (
// 										<>
// 											<TargetProfileCalendar />
// 											<PaginatedInteractionsFeed
// 												actionProps={{
// 													targetUserId: userData.id,
// 													ownerUserId: owner.id
// 												}}
// 											/>
// 										</>
// 									)
// 								}}
// 							/>
// 						</S.BottomContentContainer>
// 					</S.Container>
// 				</S.ScrollView>
// 			</SubcontentOpenContext.Provider>

// 			{oppTargetStatus === TargetStatusesEnum.INTRO && (
// 				<S.TargetChangeStatusButton
// 					statusId={oppTargetStatus}
// 					targetId={opportunityTargets[0].id}
// 					onPress={() => {}} // TODO Yaron - probably dont need here
// 					oppStatus={opportunity.opportunityStatusId}
// 					showGradientBackground
// 					textSize={20}
// 				/>
// 			)}
// 			{(oppTargetStatus === TargetStatusesEnum.WE_ARE_GOOD_TO_GO ||
// 				oppTargetStatus === TargetStatusesEnum.MY_PART_IS_DONE) && (
// 				<S.MyPartIsDoneButton
// 					onPress={() => {
// 						dispatch(
// 							changeTargetStatus({
// 								newStatus: TargetStatusesEnum.MY_PART_IS_DONE,
// 								targetId: opportunityTargets[0].id
// 							})
// 						);
// 						MyPartIsDoneModalRef.current?.open();
// 					}}
// 					statusId={oppTargetStatus}
// 					targetId={opportunityTargets[0].id}
// 				/>
// 			)}
// 			<NowYouCanInteractWithTheOwner ref={nowYouCanInteractModalRef} />
// 			<MyPartIsDoneModal
// 				ownerUsername={ownerUsername}
// 				ref={MyPartIsDoneModalRef}
// 			/>
// 		</>
// 	);
// };

// const S: any = {};

// S.ScrollView = styled.ScrollView<{ isExpanded?: boolean }>`
// 	min-height: ${({ isExpanded }) => (isExpanded ? deviceHeight * 1.5 : 0)};
// 	flex: 1;
// `;

// S.Container = styled(Animated.View)`
// 	background-color: ${({ theme }) => theme.colors.gray12};
// `;

// S.ConntectedByCrumbWrapper = styled.View`
// 	align-items: flex-start;
// 	padding-left: ${deviceWidth * 0.02777};
// `;

// S.TextContainer = styled.View`
// 	margin-top: ${deviceHeight * 0.05};
// `;

// S.CreatedByContainer = styled(Animated.View)`
// 	background-color: white;
// 	width: 100%;
// 	aspect-ratio: 3.1;
// 	align-items: flex-start;
// 	flex-direction: row;
// 	justify-content: flex-start;
// 	align-items: center;
// 	border-radius: 18;
// 	padding-horizontal: ${deviceWidth * 0.055};
// 	margin-top: -${({ createdByHeight }) => createdByHeight / 2.1}px;
// 	${createShadow()};
// `;

// S.ContentContainer = styled.View<{ createdByHeight: number }>``;

// S.BottomContentContainer = styled.View``;

// S.TargetChangeStatusButton = styled(ChangeIntroStatusButton)`
// 	position: absolute;
// 	width: ${deviceWidth * 0.75833333333};
// 	aspect-ratio: 4.55;
// 	bottom: ${deviceHeight * 0.0375};
// `;

// S.MyPartIsDoneButton = styled(MyPartIsDoneButton)`
// 	position: absolute;
// 	width: ${deviceWidth * 0.75833333333};
// 	aspect-ratio: 4.55;
// 	bottom: ${deviceHeight * 0.0375};
// `;

// export default OppCrumb;
