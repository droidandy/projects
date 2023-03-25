import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import Icons from '../../components/Shared/Icons';
import {
	CoveringLoadingModal,
	CustomText,
	FloatingButton,
	HeaderMenu
} from '../../components/Shared';
import {
	calcHeight,
	calcWidth,
	deviceHeight,
	deviceWidth
} from '../../utils/dimensions';
import { EntityDetails } from '../../components/ConnectEntities';
import { EntityEnum } from '../../types/enums';
import { IStackNavigation, ITemplate, IUserData } from '../../types/interfaces';
import {
	CreateTemplate,
	EntityConfirmationTooltip,
	IntroTypeCarousel,
	RecordAudio
} from '../../components/ConnectEntities/SendIntro';
import {
	SlidingView,
	SlidingViewContent,
	SlidingViewModal
} from '../../components/Shared/SlidingView';
import { useSelector, useDispatch } from 'react-redux';

import {
	getOppEntities,
	selectTemplates
} from '../../store/selectors/sendIntroSelectors';
import { TouchableWithoutFeedback, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { SendIntroContext as SendIntroContext1 } from './sendntroContext';
import { SendIntroModalContentEnum } from './sendIntroEnum';
import { prepareTemplates } from '../../store/actions/sendIntroActions';
import destructUserAdditionals from '../../utils/destructUserAdditionals';
import { fullName } from '../../utils';

interface IProps extends IStackNavigation {}
const SendIntro: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(prepareTemplates());
	}, []);

	const [
		currentModalContentType,
		setCurrentModalContentType
	] = useState<SendIntroModalContentEnum | null>(null);
	const [
		currentModalContent,
		setCurrentModalContent
	] = useState<ITemplate | null>(null);

	const [isAddIntroMenuOpen, setIsAddIntroMenuOpen] = useState(false);
	const [
		isConfirmationTooltipVisible,
		setConfirmationTooltipVisible
	] = useState(false);

	const { opportunityConnectors, opportunityTargets } = useSelector(
		getOppEntities
	);

	const templates: Array<ITemplate> = useSelector(selectTemplates);

	const contributor: IUserData = opportunityTargets.user;
	const owner: IUserData = opportunityConnectors.user;
	const { avatar: ownerAvatar, avatarType: ownerAvatarType } = useMemo(
		() => destructUserAdditionals(owner.userAdditionals!),
		[owner]
	);

	const {
		avatar: contributorAvatar,
		avatarType: contributorAvatarType
	} = useMemo(() => destructUserAdditionals(contributor.userAdditionals!), []);

	return templates.length ? (
		<SlidingView>
			<SlidingViewContent>
				{({ setModalOpen }) => (
					<TouchableWithoutFeedback
						onPress={() => setConfirmationTooltipVisible(false)}
						disabled={!isConfirmationTooltipVisible}
					>
						<>
							<View style={{ flex: 1 }}>
								<S.Container>
									<Icons.BlueWave
										preserveAspectRatio='none'
										width={deviceWidth}
										height={deviceHeight * 0.334}
										style={{
											position: 'absolute',
											top: 0
										}}
									/>

									<S.TopPortion>
										<HeaderMenu />
										<EntityConfirmationTooltip
											visible={isConfirmationTooltipVisible}
										/>
										<S.SendIntroTo
											bold
											size='s22'
											color='white'
											text={t('connectEntities.sendIntro.sendIntroTo')}
										/>
										<S.EntityDetailsContainer>
											{/* TODO: yaron need to pass avatar + avatar type */}
											<EntityDetails
												avatar={ownerAvatar!}
												avatarType={ownerAvatarType!}
												name={fullName(owner.firstName, owner.lastName)}
												type={EntityEnum.OWNER}
											/>
											<EntityDetails
												avatar={contributorAvatar!}
												avatarType={contributorAvatarType!}
												name={`${contributor.firstName} ${contributor.lastName}`}
												type={EntityEnum.TARGET}
											/>
										</S.EntityDetailsContainer>
									</S.TopPortion>
									<S.BottomPortion>
										<S.BottomPortionHeader
											text={t('connectEntities.sendIntro.chooseIntroType')}
											color='paleBlue1'
											size='s14'
										/>
										<SendIntroContext1.Provider
											value={{
												setModalOpen,
												setCurrentModalContent,
												setCurrentModalContentType
											}}
										>
											<IntroTypeCarousel templates={templates} />
										</SendIntroContext1.Provider>
									</S.BottomPortion>
								</S.Container>
							</View>
							{isAddIntroMenuOpen && (
								<>
									<FloatingButton
										backgroundColor='blue'
										onPress={() => {
											setCurrentModalContentType(
												SendIntroModalContentEnum.TEMPLATE_EDITABLE
											);
											setModalOpen && setModalOpen(true);
										}}
										distanceFromBottom={190}
									>
										<Icons.PencilIcon width={deviceWidth * 0.152} />
									</FloatingButton>
									<FloatingButton
										backgroundColor='purple1'
										onPress={() => {
											setCurrentModalContentType(
												SendIntroModalContentEnum.RECORD_AUDIO
											);
											setModalOpen && setModalOpen(true);
										}}
										distanceFromBottom={114}
									>
										<Icons.RecordingIcon width={deviceWidth * 0.152} />
									</FloatingButton>
								</>
							)}
							<FloatingButton
								onPress={() => {
									setIsAddIntroMenuOpen(!isAddIntroMenuOpen);
								}}
								distanceFromBottom={30}
								gradientBackground='orange'
								isActive={isAddIntroMenuOpen}
							/>
						</>
					</TouchableWithoutFeedback>
				)}
			</SlidingViewContent>
			<SlidingViewModal>
				{currentModalContentType === SendIntroModalContentEnum.RECORD_AUDIO && (
					<RecordAudio />
				)}
				{currentModalContentType === SendIntroModalContentEnum.TEMPLATE && (
					<CreateTemplate content={currentModalContent} isEditable={false} />
				)}
				{currentModalContentType ===
					SendIntroModalContentEnum.TEMPLATE_EDITABLE && (
					<CreateTemplate isEditable={true} />
				)}
			</SlidingViewModal>
		</SlidingView>
	) : (
		<CoveringLoadingModal visible />
	);
};

const S: any = {};

S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
`;
S.TopPortion = styled.View`
	width: 100%;
`;

S.MoreActionsButton = styled.TouchableOpacity`
	position: absolute;
	top: 2px;
	right: 8px;
	padding-vertical: 20;
	padding-horizontal: 20;
`;

S.SendIntroTo = styled(CustomText)`
	margin-left: ${deviceWidth * 0.07};
	line-height: 32;
`;

S.EntityDetailsContainer = styled.View`
	width: 100%;
	align-content: center;
	flex-direction: row;
	justify-content: space-between;
	padding-horizontal: ${deviceWidth * 0.15};

	margin-top: ${calcHeight(19.89)};
`;

S.XButtonContainer = styled.View`
	transform: rotate(45deg);
`;
S.BottomPortion = styled.View``;

S.BottomPortionHeader = styled(CustomText)`
	margin-vertical: ${heightPercentageToDP('3.125%')};
	transform: translateX(${calcWidth(25)}px);
	line-height: 21;
`;
export default SendIntro;
