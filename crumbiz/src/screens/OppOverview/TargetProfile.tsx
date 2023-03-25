import React, { useCallback, useRef, useState, useEffect } from 'react';
import styled from 'styled-components/native';
import {
	Animated,
	NativeScrollEvent,
	NativeSyntheticEvent,
	TouchableWithoutFeedback,
	View,
	RefreshControl
} from 'react-native';
import { IOppTargetDetails, IStackNavigation } from '../../types/interfaces';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { useEffectAfterMount } from '../../hooks';
import TargetProfileButtons from '../../components/OppOverview/OppOverview/TargetProfileButtons';
import TargetProfileContents from '../../components/OppOverview/OppOverview/Tabs/TargetProfileContents';
import { ProfileImageWithIntroStatusIndicator } from '../../components/OppOverview';
import {
	CircleImage,
	CustomText,
	HeaderMenu,
	SlidingScreenOverview,
	KeyboardAwareScrollView
} from '../../components/Shared';
import { TargetProfileThreeDotsMenu } from '../../components/OppOverview/TargetProfile';
import ChangeIntroStatusButton from '../../components/OppOverview/OppOverview/ChangeIntroStatusButton';
import { useNavigation } from 'react-navigation-hooks';
import { useDispatch, useSelector } from 'react-redux';
import {
	getTargetInteractionsData,
	sendInteraction
} from '../../store/actions/oppOverviewActions';
import { ConnectedBy } from '../../components/OppOverview';
import {
	oppOverviewSelector,
	oppTargetProfileSelectors,
	oppTargetsSelector
} from '../../store/selectors/oppOverviewSelector';
import {
	EntityEnum,
	InteractionMenuOptionsEnum,
	TargetStatusesEnum
} from '../../types/enums';
import TargetProfileQuestions from '../../components/Shared/NewsFeed/TargetProfileQuestions';
import TargetProfileMessages from '../../components/Shared/NewsFeed/TargetProfileMessages';
import TargetProfileCalendar from '../../components/Shared/NewsFeed/TargetProfileCalendar';
import InteractionsFeed from '../../components/InteractionsFeed';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import withPagination from '../../hoc/withPagination';
import { createPaginatedRequestAction } from '../../store/actions/utils';
import { ScreensEnum } from '../../navigation/screens';
import { TargetProfileContext } from './targetProfileContext';
import { OppOverviewTypes } from '../../store/constants';
import { resetTargetProfileInteractions } from '../../store/actions/oppOverviewActions';
import compose from '../../hoc/compose';
import withLoading, { PropagatingSwitcher } from '../../hoc/withLoading';
import { createLoadingSelector } from '../../store/selectors/pendingSelectors';
import { PermissionsAndroid } from 'react-native';

const TEMP_PROFESSION = 'Partnership director at Microsoft';

interface IProps extends IStackNavigation {}

type activeButtonType = InteractionMenuOptionsEnum | null;

const Decorator = compose(
	withLoading({
		selector: createLoadingSelector(OppOverviewTypes.GET_TARGET_INTERACTIONS),
		Switcher: PropagatingSwitcher
	}),
	withPagination({
		top: 20,
		dataSelector: oppTargetProfileSelectors.selectTargetProfileData,
		countSelector: oppTargetProfileSelectors.selectTargetProfileCount,
		action: getTargetInteractionsData,
		enhancer: createPaginatedRequestAction,
		actionType: OppOverviewTypes.GET_TARGET_INTERACTIONS
	})
);

const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

const TargetProfile: React.FC<IProps> = props => {
	const [activeButton, setActiveButton] = useState<activeButtonType>(null);
	const [showOverview, setShowOverview] = useState(false);
	const [expandSubcontents, toggleExpandSubcontents] = useState(false);
	const [isProfileImageClicked, setProfileImageClicked] = useState(false);
	const [showThreeDotsMenu, setThreeDotsMenu] = useState(false);

	const animated = useRef(new Animated.Value(0)).current;
	const connectedByVerticalOffset = useRef(0);
	const mainScrollViewRef = useRef(null);
	const dispatch = useDispatch();
	const deleteTargetModalRef = useRef(null);
	const backTargetToPreviousStepModalRef = useRef(null);

	const navigation = useNavigation();

	const userData = useSelector(getUserDataSelector);
	const oppData = useSelector(oppOverviewSelector);
	const targetData: IOppTargetDetails = props.navigation.getParam('profile');
	const oppTargetDetails: IOppTargetDetails = useSelector(
		oppTargetsSelector
	).find(
		(target: IOppTargetDetails) => target.oppTargetId === targetData.oppTargetId
	)!;

	const { selectedOppId, role } = oppData;
	const { id: userId } = userData;

	// useEffectAfterMount(() => {
	// 	Animated.timing(animated, {
	// 		toValue: Number(expandSubcontents),
	// 		useNativeDriver: true
	// 	}).start();
	// 	//@ts-ignore
	// 	mainScrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
	// }, [expandSubcontents]);

	const handleScroll = useCallback((yOffset: number) => {
		setShowOverview(yOffset > connectedByVerticalOffset.current);
	}, []);

	const sendInteractionHandler = useCallback(
		({ body, isPredefinedMessage, predefinedMessageTemplateId }) => {
			dispatch(
				sendInteraction({
					body,
					targetUserId: oppTargetDetails.targetUserId,
					targetId: oppTargetDetails.oppTargetId,
					connectorId: oppTargetDetails.oppConnectorId,
					connectorUserId: oppTargetDetails.oppConnectorUserId,
					isPredefinedMessage,
					predefinedMessageTemplateId,
					cb: () => {
						toggleExpandSubcontents(false);
						setActiveButton(null);
					}
				})
			);
		},
		[oppTargetDetails]
	);

	if (!oppTargetDetails) return null;

	const {
		oppTargetPhone,
		oppTargetEmail,
		oppTargetUsername,
		oppTargetAvatar,
		oppTargetAvatarType,
		oppTargetId
	} = oppTargetDetails;

	const shouldShowChangeStatusButton =
		oppData.role !== EntityEnum.CONNECTOR &&
		oppTargetDetails.statusId !== TargetStatusesEnum.DONE_DEAL &&
		!expandSubcontents &&
		activeButton !== InteractionMenuOptionsEnum.MESSAGE;

	const translateYInterpolation = animated.interpolate({
		inputRange: [0, 1],
		outputRange: [0, -connectedByVerticalOffset.current]
	});

	return (
		<>
			<KeyboardAwareScrollView
				contentContainerStyle={{ flex: 1 }}
				keyboardShouldPersistTaps='always'
			>
				<SlidingScreenOverview visible={showOverview}>
					<S.SlidingOverviewContent>
						<S.SlidingOverviewImage
							avatar={oppTargetAvatar}
							avatarType={oppTargetAvatarType}
							username={oppTargetUsername}
							size={deviceWidth * 0.1027}
						/>
						<CustomText text={`${oppTargetUsername}`} bold />
					</S.SlidingOverviewContent>
				</SlidingScreenOverview>

				<TargetProfileContext.Provider
					value={{
						isExpanded: expandSubcontents,
						toggleExpanded: toggleExpandSubcontents,
						scrollViewRef: mainScrollViewRef,
						profile: oppTargetDetails,
						deleteTargetModalRef,
						backTargetToPreviousStepModalRef
					}}
				>
					<TouchableWithoutFeedback
						disabled={!showThreeDotsMenu}
						onPress={() => setThreeDotsMenu(false)}
					>
						<View style={{ flex: 1 }}>
							<S.Container
								onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
									handleScroll(e.nativeEvent.contentOffset.y);
								}}
								keyboardShouldPersistTaps='always'
								scrollEnabled={!showThreeDotsMenu}
								ref={mainScrollViewRef}
								isExpanded={expandSubcontents}
								nestedScrollEnabled
								refreshControl={
									<RefreshControl
										enabled
										refreshing={false}
										onRefresh={() => {
											dispatch(resetTargetProfileInteractions());
										}}
									/>
								}
							>
								<TargetProfileThreeDotsMenu
									visible={showThreeDotsMenu}
									setVisible={setThreeDotsMenu}
								/>

								<S.TopPartContainer
									style={{
										transform: [{ translateY: translateYInterpolation }]
									}}
								>
									<HeaderMenu
										leftIcon={{ iconColor: 'black' }}
										rightIcon={{
											iconColor: 'black',
											onPress: () => setThreeDotsMenu(oldState => !oldState)
										}}
									/>
									<TouchableWithoutFeedback
										onPress={() => {
											setProfileImageClicked(!isProfileImageClicked);
										}}
									>
										<View>
											<S.ProfileImage
												size={deviceWidth * 0.363}
												status={oppTargetDetails.statusId}
												avatar={oppTargetDetails.oppTargetAvatar}
												avatarType={oppTargetDetails.oppTargetAvatarType}
												username={oppTargetDetails.oppTargetUsername}
												showCrumb={true}
												circleWidth={4}
											/>
										</View>
									</TouchableWithoutFeedback>

									{isProfileImageClicked && (
										<TargetProfileButtons targetDetails={oppTargetDetails} />
									)}

									<S.UsernameAndProfessionContainer>
										<CustomText
											text={oppTargetDetails.oppTargetUsername}
											size='s20'
											bold
										/>
										{/* 
											Commented out according to bug 272 - temporary
										<CustomText
											text={TEMP_PROFESSION}
											color='gray13'
											size='s14'
										/> */}
									</S.UsernameAndProfessionContainer>

									<View
										onLayout={e => {
											const { y, height } = e.nativeEvent.layout;
											connectedByVerticalOffset.current = y + height;
										}}
									>
										<S.ConnectedBy
											connectorProfile={{
												avatar: oppTargetDetails.oppConnectorAvatar,
												connectorUsername: oppTargetDetails.oppConnectorUsername
											}}
											showAvatar
										/>
									</View>
								</S.TopPartContainer>

								<S.BottomPartContainer
									style={{
										transform: [{ translateY: translateYInterpolation }]
									}}
								>
									<TargetProfileContents
										entityUserName={oppTargetUsername}
										sendInteractionHandler={sendInteractionHandler}
										setActiveTab={setActiveButton}
										activeTab={activeButton}
										targetId={oppTargetId}
										defaultTab={
											<PaginatedInteractionsFeed
												actionProps={{
													selectedOppId,
													targetUserId: oppTargetDetails.targetUserId,
													userId,
													role
												}}
											/>
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
													entityName={targetData.oppTargetUsername}
												/>
											),
											[InteractionMenuOptionsEnum.CALENDAR]: (
												<>
													<TargetProfileCalendar />
													<PaginatedInteractionsFeed
														actionProps={{
															selectedOppId,
															targetUserId: oppTargetDetails.targetUserId,
															userId,
															role
														}}
													/>
												</>
											)
										}}
									/>
								</S.BottomPartContainer>
							</S.Container>
						</View>
					</TouchableWithoutFeedback>
				</TargetProfileContext.Provider>
			</KeyboardAwareScrollView>
			{shouldShowChangeStatusButton && (
				<S.ChangeStatusButton
					statusId={oppTargetDetails.statusId}
					targetId={oppTargetDetails.oppTargetId}
					onPress={() => {
						navigation.navigate(ScreensEnum.OH_YES, {
							profile: oppTargetDetails
						});
					}}
					showGradientBackground
					textSize={20}
				/>
			)}
		</>
	);
};

const S: any = {};
S.Container = styled.ScrollView<{ isExpanded?: boolean }>`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray14};
	/* min-height: ${({ isExpanded }) => (isExpanded ? deviceHeight * 1.5 : 0)}; */
`;

S.SlidingOverviewContent = styled.View`
	flex-direction: row;
	align-items: center;
	align-self: flex-start;
`;

S.SlidingOverviewImage = styled(CircleImage)`
	margin-right: ${deviceWidth * 0.027};
`;

S.ProfileImage = styled(ProfileImageWithIntroStatusIndicator)`
	margin-top: ${deviceHeight * 0.025};
`;

S.UsernameAndProfessionContainer = styled.View`
	align-items: center;
	justify-content: center;
`;

S.ConnectedBy = styled(ConnectedBy)`
	margin-top: ${deviceHeight * 0.043};
`;

S.TopPartContainer = styled(Animated.View)``;

S.BottomPartContainer = styled(Animated.View)``;

S.ChangeStatusButton = styled(ChangeIntroStatusButton)`
	position: absolute;
	width: ${deviceWidth * 0.75833333333};
	aspect-ratio: 4.55;
	bottom: ${deviceHeight * 0.0375};
`;

export default TargetProfile;

// Expandable code, changed this to be scrollable when msges is open. uncommented code is the old version of this screen

// import React, { useCallback, useRef, useState, useEffect } from 'react';
// import styled from 'styled-components/native';
// import {
// 	Animated,
// 	NativeScrollEvent,
// 	NativeSyntheticEvent,
// 	TouchableWithoutFeedback,
// 	View,
// 	RefreshControl
// } from 'react-native';
// import { IOppTargetDetails, IStackNavigation } from '../../types/interfaces';
// import { deviceHeight, deviceWidth } from '../../utils/dimensions';
// import { useEffectAfterMount } from '../../hooks';
// import TargetProfileButtons from '../../components/OppOverview/OppOverview/TargetProfileButtons';
// import TargetProfileContents from '../../components/OppOverview/OppOverview/Tabs/TargetProfileContents';
// import { ProfileImageWithIntroStatusIndicator } from '../../components/OppOverview';
// import {
// 	CircleImage,
// 	CustomText,
// 	HeaderMenu,
// 	SlidingScreenOverview
// } from '../../components/Shared';
// import { TargetProfileThreeDotsMenu } from '../../components/OppOverview/TargetProfile';
// import ChangeIntroStatusButton from '../../components/OppOverview/OppOverview/ChangeIntroStatusButton';
// import { useNavigation } from 'react-navigation-hooks';
// import { useDispatch, useSelector } from 'react-redux';
// import {
// 	getTargetInteractionsData,
// 	sendInteraction
// } from '../../store/actions/oppOverviewActions';
// import { ConnectedBy } from '../../components/OppOverview';
// import {
// 	oppOverviewSelector,
// 	oppTargetProfileSelectors,
// 	oppTargetsSelector
// } from '../../store/selectors/oppOverviewSelector';
// import {
// 	EntityEnum,
// 	InteractionMenuOptionsEnum,
// 	TargetStatusesEnum
// } from '../../types/enums';
// import TargetProfileQuestions from '../../components/Shared/NewsFeed/TargetProfileQuestions';
// import TargetProfileMessages from '../../components/Shared/NewsFeed/TargetProfileMessages';
// import TargetProfileCalendar from '../../components/Shared/NewsFeed/TargetProfileCalendar';
// import InteractionsFeed from '../../components/InteractionsFeed';
// import { getUserDataSelector } from '../../store/selectors/authSelector';
// import withPagination from '../../hoc/withPagination';
// import { createPaginatedRequestAction } from '../../store/actions/utils';
// import { ScreensEnum } from '../../navigation/screens';
// import { TargetProfileContext } from './targetProfileContext';
// import { OppOverviewTypes } from '../../store/constants';
// import { resetTargetProfileInteractions } from '../../store/actions/oppOverviewActions';
// import compose from '../../hoc/compose';
// import withLoading, { PropagatingSwitcher } from '../../hoc/withLoading';
// import { createLoadingSelector } from '../../store/selectors/pendingSelectors';

// const TEMP_PROFESSION = 'Partnership director at Microsoft';

// interface IProps extends IStackNavigation {}

// type activeButtonType = InteractionMenuOptionsEnum | null;

// const Decorator = compose(
// 	withLoading({
// 		selector: createLoadingSelector(OppOverviewTypes.GET_TARGET_INTERACTIONS),
// 		Switcher: PropagatingSwitcher
// 	}),
// 	withPagination({
// 		top: 20,
// 		dataSelector: oppTargetProfileSelectors.selectTargetProfileData,
// 		countSelector: oppTargetProfileSelectors.selectTargetProfileCount,
// 		action: getTargetInteractionsData,
// 		enhancer: createPaginatedRequestAction,
// 		actionType: OppOverviewTypes.GET_TARGET_INTERACTIONS
// 	})
// );

// const PaginatedInteractionsFeed = Decorator(InteractionsFeed);

// const TargetProfile: React.FC<IProps> = props => {
// 	const [activeButton, setActiveButton] = useState<activeButtonType>(null);
// 	const [showOverview, setShowOverview] = useState(false);
// 	const [expandSubcontents, toggleExpandSubcontents] = useState(false);
// 	const [isProfileImageClicked, setProfileImageClicked] = useState(false);
// 	const [showThreeDotsMenu, setThreeDotsMenu] = useState(false);

// 	const animated = useRef(new Animated.Value(0)).current;
// 	const connectedByVerticalOffset = useRef(0);
// 	const mainScrollViewRef = useRef(null);
// 	const dispatch = useDispatch();
// 	const deleteTargetModalRef = useRef(null);
// 	const backTargetToPreviousStepModalRef = useRef(null);

// 	const navigation = useNavigation();

// 	const userData = useSelector(getUserDataSelector);
// 	const oppData = useSelector(oppOverviewSelector);
// 	const targetData: IOppTargetDetails = props.navigation.getParam('profile');
// 	const oppTargetDetails: IOppTargetDetails = useSelector(
// 		oppTargetsSelector
// 	).find(
// 		(target: IOppTargetDetails) => target.oppTargetId === targetData.oppTargetId
// 	)!;

// 	const { targetUserId } = targetData;
// 	const { selectedOppId, role } = oppData;
// 	const { id: userId } = userData;

// 	useEffectAfterMount(() => {
// 		Animated.timing(animated, {
// 			toValue: Number(expandSubcontents),
// 			useNativeDriver: true
// 		}).start();
// 		//@ts-ignore
// 		mainScrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
// 	}, [expandSubcontents]);

// 	const handleScroll = useCallback((yOffset: number) => {
// 		setShowOverview(yOffset > connectedByVerticalOffset.current);
// 	}, []);

// 	const sendInteractionHandler = useCallback(
// 		({ body, isPredefinedMessage, predefinedMessageTemplateId }) => {
// 			dispatch(
// 				sendInteraction({
// 					body,
// 					targetUserId: oppTargetDetails.targetUserId,
// 					targetId: oppTargetDetails.oppTargetId,
// 					connectorId: oppTargetDetails.oppConnectorId,
// 					connectorUserId: oppTargetDetails.oppConnectorUserId,
// 					isPredefinedMessage,
// 					predefinedMessageTemplateId
// 				})
// 			);
// 		},
// 		[oppTargetDetails]
// 	);

// 	if (!oppTargetDetails) return null;

// 	const {
// 		oppTargetPhone,
// 		oppTargetEmail,
// 		oppTargetUsername,
// 		oppTargetAvatar,
// 		oppTargetAvatarType
// 	} = oppTargetDetails;

// 	const shouldShowChangeStatusButton =
// 		oppData.role !== EntityEnum.CONNECTOR &&
// 		oppTargetDetails.statusId !== TargetStatusesEnum.DONE_DEAL &&
// 		!expandSubcontents;

// 	const translateYInterpolation = animated.interpolate({
// 		inputRange: [0, 1],
// 		outputRange: [0, -connectedByVerticalOffset.current]
// 	});

// 	return (
// 		<>
// 			<SlidingScreenOverview visible={showOverview}>
// 				<S.SlidingOverviewContent>
// 					<S.SlidingOverviewImage
// 						avatar={oppTargetAvatar}
// 						avatarType={oppTargetAvatarType}
// 						username={oppTargetUsername}
// 						size={deviceWidth * 0.1027}
// 					/>
// 					<CustomText text={`${oppTargetUsername}`} bold />
// 				</S.SlidingOverviewContent>
// 			</SlidingScreenOverview>

// 			<TargetProfileContext.Provider
// 				value={{
// 					isExpanded: expandSubcontents,
// 					toggleExpanded: toggleExpandSubcontents,
// 					scrollViewRef: mainScrollViewRef,
// 					profile: oppTargetDetails,
// 					deleteTargetModalRef,
// 					backTargetToPreviousStepModalRef
// 				}}
// 			>
// 				<TouchableWithoutFeedback
// 					disabled={!showThreeDotsMenu}
// 					onPress={() => setThreeDotsMenu(false)}
// 				>
// 					<View style={{ flex: 1 }}>
// 						<S.Container
// 							onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
// 								handleScroll(e.nativeEvent.contentOffset.y);
// 							}}
// 							scrollEnabled={!expandSubcontents && !showThreeDotsMenu}
// 							ref={mainScrollViewRef}
// 							isExpanded={expandSubcontents}
// 							refreshControl={
// 								<RefreshControl
// 									enabled
// 									refreshing={false}
// 									onRefresh={() => {
// 										dispatch(resetTargetProfileInteractions());
// 									}}
// 								/>
// 							}
// 						>
// 							<TargetProfileThreeDotsMenu
// 								visible={showThreeDotsMenu}
// 								setVisible={setThreeDotsMenu}
// 							/>

// 							<S.TopPartContainer
// 								style={{ transform: [{ translateY: translateYInterpolation }] }}
// 							>
// 								<HeaderMenu
// 									leftIcon={{ iconColor: 'black' }}
// 									rightIcon={{
// 										iconColor: 'black',
// 										onPress: () => setThreeDotsMenu(oldState => !oldState)
// 									}}
// 								/>
// 								<TouchableWithoutFeedback
// 									onPress={() => {
// 										setProfileImageClicked(!isProfileImageClicked);
// 									}}
// 								>
// 									<View>
// 										<S.ProfileImage
// 											size={deviceWidth * 0.363}
// 											status={oppTargetDetails.statusId}
// 											avatar={oppTargetDetails.oppTargetAvatar}
// 											avatarType={oppTargetDetails.oppTargetAvatarType}
// 											username={oppTargetDetails.oppTargetUsername}
// 											showCrumb={true}
// 											circleWidth={4}
// 										/>
// 									</View>
// 								</TouchableWithoutFeedback>

// 								{isProfileImageClicked && (
// 									<TargetProfileButtons
// 										targetPhoneNumber={oppTargetPhone}
// 										targetEmail={oppTargetEmail}
// 										targetUsername={oppTargetUsername}
// 									/>
// 								)}

// 								<S.UsernameAndProfessionContainer>
// 									<CustomText
// 										text={oppTargetDetails.oppTargetUsername}
// 										size='s20'
// 										bold
// 									/>
// 									<CustomText
// 										text={TEMP_PROFESSION}
// 										color='gray13'
// 										size='s14'
// 									/>
// 								</S.UsernameAndProfessionContainer>

// 								<View
// 									onLayout={e => {
// 										const { y, height } = e.nativeEvent.layout;
// 										connectedByVerticalOffset.current = y + height;
// 									}}
// 								>
// 									<S.ConnectedBy
// 										connectorProfile={{
// 											avatar: oppTargetDetails.oppConnectorAvatar,
// 											connectorUsername: oppTargetDetails.oppConnectorUsername
// 										}}
// 										showAvatar
// 									/>
// 								</View>
// 							</S.TopPartContainer>

// 							<S.BottomPartContainer
// 								style={{ transform: [{ translateY: translateYInterpolation }] }}
// 							>
// 								<TargetProfileContents
// 									sendInteractionHandler={sendInteractionHandler}
// 									setActiveTab={setActiveButton}
// 									activeTab={activeButton}
// 									defaultTab={
// 										<PaginatedInteractionsFeed
// 											actionProps={{
// 												selectedOppId,
// 												targetUserId,
// 												userId,
// 												role
// 											}}
// 										/>
// 									}
// 									tabs={{
// 										[InteractionMenuOptionsEnum.QUESTION]: (
// 											<TargetProfileQuestions
// 												activeButton={activeButton}
// 												setActiveButton={setActiveButton}
// 												sendInteractionHandler={sendInteractionHandler}
// 												toggleExpandSubcontents={toggleExpandSubcontents}
// 											/>
// 										),
// 										[InteractionMenuOptionsEnum.MESSAGE]: (
// 											<TargetProfileMessages
// 												sendInteractionHandler={sendInteractionHandler}
// 												setActiveButton={setActiveButton}
// 												toggleExpandSubcontents={toggleExpandSubcontents}
// 												entityName={targetData.oppTargetUsername}
// 											/>
// 										),
// 										[InteractionMenuOptionsEnum.CALENDAR]: (
// 											<>
// 												<TargetProfileCalendar />
// 												<PaginatedInteractionsFeed
// 													actionProps={{
// 														selectedOppId,
// 														targetUserId,
// 														userId,
// 														role
// 													}}
// 												/>
// 											</>
// 										)
// 									}}
// 								/>
// 							</S.BottomPartContainer>
// 						</S.Container>

// 						{shouldShowChangeStatusButton && (
// 							<S.ChangeStatusButton
// 								statusId={oppTargetDetails.statusId}
// 								targetId={oppTargetDetails.oppTargetId}
// 								onPress={() => {
// 									navigation.navigate(ScreensEnum.OH_YES, {
// 										profile: oppTargetDetails
// 									});
// 								}}
// 								showGradientBackground
// 								textSize={20}
// 							/>
// 						)}
// 					</View>
// 				</TouchableWithoutFeedback>
// 			</TargetProfileContext.Provider>
// 		</>
// 	);
// };

// const S: any = {};
// S.Container = styled.ScrollView<{ isExpanded?: boolean }>`
// 	flex: 1;
// 	background-color: ${({ theme }) => theme.colors.gray14};
// 	min-height: ${({ isExpanded }) => (isExpanded ? deviceHeight * 1.5 : 0)};
// `;

// S.SlidingOverviewContent = styled.View`
// 	flex-direction: row;
// 	align-items: center;
// 	align-self: flex-start;
// `;

// S.SlidingOverviewImage = styled(CircleImage)`
// 	margin-right: ${deviceWidth * 0.027};
// `;

// S.ProfileImage = styled(ProfileImageWithIntroStatusIndicator)`
// 	margin-top: ${deviceHeight * 0.025};
// `;

// S.UsernameAndProfessionContainer = styled.View`
// 	align-items: center;
// 	justify-content: center;
// `;

// S.ConnectedBy = styled(ConnectedBy)`
// 	margin-top: ${deviceHeight * 0.043};
// `;

// S.TopPartContainer = styled(Animated.View)``;

// S.BottomPartContainer = styled(Animated.View)``;

// S.ChangeStatusButton = styled(ChangeIntroStatusButton)`
// 	position: absolute;
// 	width: ${deviceWidth * 0.75833333333};
// 	aspect-ratio: 4.55;
// 	bottom: ${deviceHeight * 0.0375};
// `;

// export default TargetProfile;
