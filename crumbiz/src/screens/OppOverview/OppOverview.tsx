import React, {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState
} from 'react';
import styled from 'styled-components/native';
import LinearGradient from 'react-native-linear-gradient';
import {
	CoveringLoadingModal,
	CustomText,
	FloatingButton,
	GradientHeader,
	PaddingHorizontalContainer,
	SlidingDropdown,
	SlidingScreenOverview
} from '../../components/Shared';
import { useDispatch, useSelector } from 'react-redux';
import {
	IOppOverViewSelector,
	oppOverviewSelector,
	oppTargetsSelector
} from '../../store/selectors/oppOverviewSelector';
import {
	getOppDetailsTargetsAndConnectors,
	resetOppOverviewState
} from '../../store/actions/oppOverviewActions';
import { chooseOppId } from '../../store/actions/sendIntroActions';
import { Tabs } from '../../components/OppOverview/OppOverview';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	RefreshControl,
	TouchableOpacity,
	View
} from 'react-native';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import {
	EntityEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum
} from '../../types/enums';
import OpSummary from '../../components/Shared/OpSummary/OpSummary';
import {
	IModalAndSlidingDropdownControls,
	IOppTargetDetails,
	IStackNavigation
} from '../../types/interfaces';
import { OppOnHoldDropdown } from '../../components/OppOverview/SlidingDropdowns';
import {
	NowWereTalkingModal,
	NowYouCanAddTargetsModal,
	OppCompleteModal
} from '../../components/OppOverview/Modals';
import OwnerSideMenu from '../../components/OppOverview/Drawers/OwnerSideMenu';
import { setAddNewConnectorConfig } from '../../store/actions/createOpportunityActions';
import { ScreensEnum } from '../../navigation/screens';
import { OppOverviewContext as OppOverviewContext1 } from './oppOverviewContext';
import { resetOppInteractions } from '../../store/actions/oppOverviewActions';
import { oppoverviewLoadingSelector } from '../../store/selectors/pendingSelectors';

interface IProps extends IStackNavigation {}

const OppOverview: React.FC<IProps> = ({ navigation }) => {
	const dispatch = useDispatch();
	const initialTabIndex = navigation.getParam('t') ?? 0;
	const dropdownRef = useRef<IModalAndSlidingDropdownControls>(null);
	const oppoverviewRefreshing = useSelector(oppoverviewLoadingSelector);
	const [isOverviewVisible, setOverviewVisible] = useState(false);
	const [tabIndex, setTabIndex] = useState(Number(initialTabIndex));
	const headerHeight = useRef(0);
	const oppCompleteModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	const nowWereTalkingModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	const nowYouCanAddTargetsRef = useRef<IModalAndSlidingDropdownControls>(null);
	const oppOnHoldModalRef = useRef<IModalAndSlidingDropdownControls>(null);
	const [showOwnerSideMenu, setOwnerSideMenu] = useState(false);
	const { shouldRedirectToTargetProfile, targetId } =
		navigation.state.params ?? {};
	const oppTargetDetails: IOppTargetDetails[] = useSelector(oppTargetsSelector);

	const {
		oppDetails,
		selectedOppId,
		role,
		oppOverviewDataArrived,
		oppSummary,
		canAddTargetsModal,
		newOppModal,
		oppTargets
	}: IOppOverViewSelector = useSelector(oppOverviewSelector);

	const userData = useSelector(getUserDataSelector);
	const { oppTitle, oppStatus, ownerUserName } = oppDetails;
	useEffect(() => {
		if (userData.id && selectedOppId && !oppOverviewDataArrived) {
			dispatch(
				getOppDetailsTargetsAndConnectors({
					oppId: selectedOppId,
					userId: userData.id,
					role
				})
			);
		}
	}, [userData.id, selectedOppId, oppOverviewDataArrived]);

	/**
	 * When navigating to TargetProfile via deep link,
	 * we need to make sure that all the opportunity data including the targets arrived.
	 * Only than we make the redirect.
	 * */
	const deps = [
		shouldRedirectToTargetProfile,
		selectedOppId,
		userData.id,
		oppTargetDetails.length,
		oppOverviewDataArrived
	];
	useEffect(() => {
		const shouldNavigate = deps.filter(Boolean).length === deps.length;
		if (shouldNavigate) {
			navigation.navigate(ScreensEnum.TARGET_PROFILE, {
				profile: {
					oppTargetId: targetId
				}
			});
		}
	}, deps);

	useEffect(() => {
		if (
			oppStatus === OpportunityStatusesEnum.ON_HOLD &&
			role !== EntityEnum.TARGET
		) {
			oppOnHoldModalRef.current?.open();
		}
	}, [oppStatus, oppOverviewDataArrived]);

	useEffect(() => {
		// Opening this Modal after the Connector accept being a connector in opp
		if (canAddTargetsModal && oppOverviewDataArrived) {
			nowYouCanAddTargetsRef.current?.open();
		}

		// Opening this Modal after the Owner/Connector is creating a new opp
		//
		if (oppOverviewDataArrived && newOppModal) {
			nowWereTalkingModalRef.current!.open();
		}
	}, [nowYouCanAddTargetsRef, oppOverviewDataArrived, newOppModal]);
	useEffect(() => {
		return () => {
			dispatch(resetOppOverviewState());
		};
	}, []);

	useEffect(() => {
		if (
			oppoverviewRefreshing ||
			!oppOverviewDataArrived ||
			oppStatus === OpportunityStatusesEnum.ON_HOLD ||
			role !== EntityEnum.OWNER
		)
			return;
		const isAllTargetsStatusSetToDoneDeal = oppTargets.every(
			({ statusId }: IOppTargetDetails) =>
				statusId === TargetStatusesEnum.DONE_DEAL
		);
		// To do - Need to fix this bug 
		//if (isAllTargetsStatusSetToDoneDeal) {
		//	oppCompleteModalRef.current!.open();
		//}
	}, [oppTargets]);

	const handleScroll = useCallback((yOffset: number) => {
		setOverviewVisible(yOffset > headerHeight.current);
	}, []);

	const setHeaderHeight = (_headerHeight: number) => {
		headerHeight.current = _headerHeight;
	};

	const handleRefresh = useCallback(() => {
		dispatch(resetOppInteractions());
		dispatch(
			getOppDetailsTargetsAndConnectors({
				oppId: selectedOppId,
				userId: userData.id!,
				role
			})
		);
	}, [selectedOppId, userData.id, role]);

	// Refresh on each tab change
	useEffect(() => {
		if (oppoverviewRefreshing || !oppOverviewDataArrived) return;
		if (tabIndex === 1) {
			dispatch(resetOppInteractions());
		} else {
			dispatch(
				getOppDetailsTargetsAndConnectors({
					oppId: selectedOppId,
					userId: userData.id!,
					role
				})
			);
		}
	}, [tabIndex]);

	const _floatingButton = useMemo(() => {
		if (tabIndex === 0 && role === EntityEnum.CONNECTOR) {
			return (
				<FloatingButton
					onPress={() => {
						dispatch(chooseOppId(selectedOppId));
						navigation.navigate(ScreensEnum.CONNECT_CHOOSE_ENTITY);
					}}
					gradientBackground='orange'
				/>
			);
		} else if (tabIndex === 2 && role === EntityEnum.OWNER) {
			return (
				<FloatingButton
					onPress={() => {
						dispatch(setAddNewConnectorConfig());
						navigation.navigate(ScreensEnum.ADD_NEW_CONNECTOR);

						// TODO Yaron - connect to drop 2 (choose new connector)
					}}
					gradientBackground='orange'
				/>
			);
		}
		return null;
	}, [tabIndex, role]);

	return !oppOverviewDataArrived ? (
		<CoveringLoadingModal visible />
	) : (
		<>
			<OwnerSideMenu
				isSideMenuOpen={showOwnerSideMenu}
				setOpen={setOwnerSideMenu}
			/>
			<OppCompleteModal ref={oppCompleteModalRef} />
			<NowWereTalkingModal ref={nowWereTalkingModalRef} />

			<SlidingScreenOverview
				gradientBackground='blue'
				visible={isOverviewVisible}
				text={oppTitle}
				textVariant='light'
			/>

			<SlidingDropdown ref={dropdownRef} location='top'>
				<S.SlidingViewTitle text='Opp Details' />
				<OpSummary data={oppSummary} trimmed />

				<S.OppTouchableLine onPress={() => dropdownRef.current!.close()}>
					<S.OpDetailsLine />
				</S.OppTouchableLine>
			</SlidingDropdown>

			<S.Container
				bounces={true}
				refreshControl={
					<RefreshControl
						enabled
						refreshing={false}
						onRefresh={handleRefresh}
					/>
				}
				onScroll={(e: NativeSyntheticEvent<NativeScrollEvent>) => {
					handleScroll(e.nativeEvent.contentOffset.y);
				}}
				scrollEventThrottle={16}
			>
				<OppOverviewContext1.Provider
					value={{
						oppCompleteModalRef,
						showDrawer: setOwnerSideMenu,
						role
					}}
				>
					<GradientHeader
						setHeaderHeight={setHeaderHeight}
						oppStatus={oppStatus}
						oppTitle={oppTitle}
						dropdownRef={dropdownRef}
						// @ts-ignore
						connectedByConfig={
							role === EntityEnum.CONNECTOR
								? {
										action: EntityEnum.CONNECTOR,
										titleConfig: {
											color: 'halfWhite'
										},
										usernameConfig: {
											color: 'white'
										},

										connectorProfile: {
											avatar: '',
											avatarType: '',
											connectorUsername: ownerUserName
										}
								  }
								: null
						}
					/>
					<Tabs
						tabIndex={tabIndex}
						setTabIndex={setTabIndex}
						handleOppOverviewRefresh={handleRefresh}
					/>
				</OppOverviewContext1.Provider>
			</S.Container>

			{_floatingButton}
			<NowYouCanAddTargetsModal ref={nowYouCanAddTargetsRef} />
			<OppOnHoldDropdown asEntity={role} ref={oppOnHoldModalRef} />
		</>
	);
};

const S: any = {};
S.Container = styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.white};
`;

S.Gradient = styled(LinearGradient)`
	width: 100%;
	aspect-ratio: 1.63;
	border-bottom-left-radius: 40;
`;

S.HeaderContainer = styled(PaddingHorizontalContainer)`
	flex-direction: row;
	width: 100%;
	justify-content: space-between;
	align-items: center;
	margin-top: ${deviceHeight * 0.0375};
`;

S.OppTouchableLine = styled(TouchableOpacity)`
	align-self: center;
	padding-top: ${deviceHeight * 0.0390625};
`;

S.OpDetailsLine = styled(View)`
	width: ${deviceWidth * 0.186};
	aspect-ratio: 16.75;
	background: ${({ theme }) => theme.colors.gray3};
	opacity: 0.2;
	border-radius: 8;
	align-self: center;
`;

S.ContentContainer = styled(PaddingHorizontalContainer)`
	width: 100%;
	flex: 1;
	justify-content: space-around;
`;

S.SlidingViewTitle = styled(CustomText)`
	margin-bottom: ${deviceHeight * 0.01875};
`;

export default OppOverview;
