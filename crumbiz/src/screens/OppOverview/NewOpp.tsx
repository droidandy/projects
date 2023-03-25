import React, {
	FC,
	useState,
	useRef,
	useEffect,
	useMemo,
	useCallback
} from 'react';
import styled from 'styled-components/native';
import { LayoutChangeEvent, Platform } from 'react-native';
import {
	GradientHeader,
	PaddingHorizontalContainer,
	CustomText,
	CoveringLoadingModal,
	AudioPlayer
} from '../../components/Shared';
import { OpSummary } from '../../components/Shared/OpSummary';
import {
	OpportunityCategoriesEnum,
	EntityEnum,
	TargetStatusesEnum
} from '../../types/enums';
import {
	IOppOverViewSelector,
	newIntroductionMessageSelector
} from '../../store/selectors/oppOverviewSelector';
import {
	getNewOppAndTargetProfile,
	changeEntityDecision,
	updateTargetStatusInsideProfile,
	openCanAddTargetsModal
} from '../../store/actions/oppOverviewActions';
import { useDispatch, useSelector } from 'react-redux';
import { oppOverviewSelector } from '../../store/selectors/oppOverviewSelector';
import { ConnectedBy } from '../../components/OppOverview';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import { setEntityNewSatatus } from '../../utils';
import AcceptBeingAnEntityDropdown from '../../components/OppOverview/SlidingDropdowns/AcceptBeingAnEntityDropdown';
import DeclineOppModal from '../../components/OppOverview/Modals/DeclineOppModal';
import {
	IModalAndSlidingDropdownControls,
	IUserData,
	IStackNavigation
} from '../../types/interfaces';
import extractAvatarFromUser from '../../utils/extractAvatarFromUser';
import {
	resetOppOverviewState,
	setSelectedOppAndRole
} from '../../store/actions/oppOverviewActions';
import { ScreensEnum } from '../../navigation/screens';

interface IProps extends IStackNavigation {}

const NewOpp: FC<IProps> = ({ navigation }) => {
	const [createdByHeight, setCreatedByHeight] = useState(0);
	const [buttonsDisabled, setButtonsDisabled] = useState(false);
	const yesNoRef = useRef<IModalAndSlidingDropdownControls>(null);
	const areYouSureRef = useRef<IModalAndSlidingDropdownControls>(null);
	const dispatch = useDispatch();
	const {
		newOppAndTargetProfileDataArrived,
		newOppAndTargetProfile,
		role,
		newInteractionMessage,
		oppSummary,
		selectedOppId
	}: IOppOverViewSelector = useSelector(oppOverviewSelector);
	const { opportunity } = newOppAndTargetProfile;
	const base64Recording =
		useSelector(newIntroductionMessageSelector)?.interactionTemplateFields?.[0]
			?.fileTextValue ?? null;

	useEffect(() => {
		dispatch(getNewOppAndTargetProfile());
		// return () => {
		// 	dispatch(resetOppOverviewState());
		// };
	}, []);

	useEffect(() => {
		if (newOppAndTargetProfileDataArrived) {
			yesNoRef.current!.open();
		}
	}, [newOppAndTargetProfileDataArrived]);

	const connectorProfile = useMemo(() => {
		if (newOppAndTargetProfileDataArrived) {
			const entityPath = role === EntityEnum.CONNECTOR ? 'user' : 'user1';
			const entity: IUserData = newOppAndTargetProfile[entityPath];
			const connectorUsername = `${entity.firstName} ${entity.lastName}`;
			const [entityAvatar, entitiyAvatarType] = extractAvatarFromUser(entity);
			let avatar = entityAvatar!;
			let avatarType = entitiyAvatarType!;
			return { avatar, connectorUsername, avatarType };
		}
		return { avatar: '', connectorUsername: '', avatarType: '' };
	}, [newOppAndTargetProfileDataArrived]);

	const handleDecision = useCallback((decision: boolean) => {
		setButtonsDisabled(true);
		const screenToNavigata =
			role === EntityEnum.CONNECTOR
				? ScreensEnum.OPP_OVERVIEW
				: ScreensEnum.OPP_CRUMB;

		const newStatus = setEntityNewSatatus({ role, decision });
		const entityAccept = () => {
			navigation.dismiss();

			if (role === EntityEnum.TARGET) {
				dispatch(updateTargetStatusInsideProfile(TargetStatusesEnum.INTRO));
			}
			if (role === EntityEnum.CONNECTOR) {
				dispatch(openCanAddTargetsModal());
			}
			navigation.navigate(screenToNavigata);
		};
		const entityDecline = () => {
			navigation.dismiss();
			areYouSureRef.current?.close();
		};
		const callback = decision ? entityAccept : entityDecline;

		dispatch(
			changeEntityDecision({
				callback,
				// @ts-ignore
				newStatus,
				role
			})
		);
	}, []);

	if (!newOppAndTargetProfileDataArrived) {
		return <CoveringLoadingModal visible />;
	}
	return (
		<>
			<S.Container contentContainerStyle={{ paddingBottom: 200 }}>
				<GradientHeader hideMiddleLine oppTitle={opportunity.title} />
				<PaddingHorizontalContainer>
					<S.ContentContainer createdByHeight={createdByHeight}>
						<S.CreatedByContainer
							onLayout={(event: LayoutChangeEvent) =>
								setCreatedByHeight(event.nativeEvent.layout.height)
							}
						>
							<ConnectedBy
								action={role}
								showAvatar
								connectorProfile={connectorProfile}
								avatarSize={0.16667}
							/>
						</S.CreatedByContainer>
						{!!newInteractionMessage.body && (
							<S.TextContainer>
								<CustomText size='s14' text={newInteractionMessage.body} />
							</S.TextContainer>
						)}

						{base64Recording && <AudioPlayer base64={base64Recording} />}
						<S.Divider />
						<S.SummaryContainer>
							<OpSummary data={oppSummary} trimmed />
						</S.SummaryContainer>
					</S.ContentContainer>
				</PaddingHorizontalContainer>
			</S.Container>

			<AcceptBeingAnEntityDropdown
				ref={yesNoRef}
				asEntity={role}
				areYouSureRef={areYouSureRef}
				handleDecision={handleDecision}
				buttonsDisabled={buttonsDisabled}
			/>
			<DeclineOppModal
				ref={areYouSureRef}
				asEntity={role}
				declinedUser={connectorProfile.connectorUsername}
				handleDecision={handleDecision}
				buttonsDisabled={buttonsDisabled}
			/>
		</>
	);
};

const S: any = {};

S.Container = styled.ScrollView`
	background-color: ${({ theme }) => theme.colors.gray12};
`;

S.TextContainer = styled.View`
	margin-top: ${deviceHeight * 0.05};
`;

S.CreatedByContainer = styled.View`
	background-color: white;
	width: 100%;
	aspect-ratio: 3.1;
	align-items: flex-start;
	justify-content: center;
	border-radius: 18;
	padding-horizontal: ${deviceWidth * 0.055};
`;

S.ContentContainer = styled.View<{ createdByHeight: number }>`
	top: -${({ createdByHeight }) => createdByHeight / 2}px;
`;

S.Divider = styled.View`
	width: ${deviceWidth * 0.86};
	height: 1;
	background-color: ${({ theme }) => theme.colors.gray16};
	margin-vertical: 5%;
`;

S.SummaryContainer = styled.View``;

export default NewOpp;
