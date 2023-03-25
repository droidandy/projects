import React, {
	useCallback,
	useRef,
	useState,
	useEffect,
	useMemo
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { StatusBar } from 'react-native';
import styled from 'styled-components/native';

import {
	Button,
	Icons,
	RoundedIcon,
	HeaderMenu,
	CustomText
} from '../../components/Shared';
import {
	calcHeight,
	calcWidth,
	deviceHeight,
	moderateScale,
	deviceWidth,
	headerMenuHeight
} from '../../utils/dimensions';
import { useInterpolationGroup, useTheme } from '../../hooks';
import { EntityDetails } from '../../components/ConnectEntities';
import { EntityEnum } from '../../types/enums';
import {
	createShadow,
	createCircle,
	fullName,
	destructUserAdditionals
} from '../../utils';
import {
	Animated,
	LayoutChangeEvent,
	TouchableWithoutFeedback
} from 'react-native';
import {
	sendIntroSelector,
	getOppEntities
} from '../../store/selectors/sendIntroSelectors';
import { getUserDataSelector } from '../../store/selectors/authSelector';
import { IStackNavigation, IUserData } from '../../types/interfaces';

import { SummaryCards } from '../../components/ConnectEntities/AllSet';
import { connectTarget } from '../../store/actions/sendIntroActions';
import { OppsScreenHeader } from '../../components/Opps';

interface IProps extends IStackNavigation {}

const BUTTON_HEIGHT = deviceHeight * 0.0546875; // 35px
const BOTTOM_MARGIN = deviceHeight * 0.0546875;

const AllSet: React.FC<IProps> = ({ navigation }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const animated = useRef(new Animated.Value(0)).current;
	const [isExpanded, setExpanded] = useState(false);
	const [bottomPortionYoffset, setBottomPortionYoffset] = useState(0);
	const [isActiveCard, setIsActiveCard] = useState(false);
	const { oppData } = useSelector(sendIntroSelector);
	const { opportunityConnectors, opportunityTargets } = useSelector(
		getOppEntities
	);
	const entity: IUserData = opportunityTargets.user;
	const owner: IUserData = opportunityConnectors.user;

	const { avatar: ownerAvatar, avatarType: ownerAvatarType } = useMemo(
		() => destructUserAdditionals(owner.userAdditionals!),
		[owner]
	);

	const { avatar: targetAvatar, avatarType: targetAvatarType } = useMemo(
		() => destructUserAdditionals(entity.userAdditionals!),
		[]
	);

	const dispatch = useDispatch();

	const handleConnectPress = useCallback(() => {
		setIsActiveCard(false);
		setExpanded(true);
		dispatch(connectTarget());
	}, []);

	useEffect(() => {
		Animated.spring(animated, {
			toValue: isExpanded ? 1 : 0,
			useNativeDriver: true
		}).start();
	}, [isExpanded]);

	const interpolationGroup = useInterpolationGroup(
		{
			animatedValue: animated,
			inputRange: [0, 1],
			groups: {
				topPortionY: [0, -deviceHeight],
				iconsContainer: [0, -bottomPortionYoffset + headerMenuHeight],
				magnetRotate: ['0deg', '135deg'],
				magentScale: [1, 1.13],
				iconsScale: [1, 1.2],
				iconsYOffset: [0, calcHeight(-50)],
				iconsXOffset: [0, calcWidth(10)],

				madeConnectionY: [deviceHeight, 0],
				buttonTranslateY: [BOTTOM_MARGIN + BUTTON_HEIGHT, 0],
				bottomGradient: [deviceHeight, 0]
			}
		},
		[bottomPortionYoffset]
	);

	const iconsStyle = [
		{ scale: interpolationGroup.iconsScale },
		{ translateY: interpolationGroup.iconsYOffset }
	];

	const madeConnectionOpacityInterpolation = animated.interpolate({
		inputRange: [0, 0.5, 1],
		outputRange: [0, 0.3, 1]
	});
	const headerOpacity = animated.interpolate({
		inputRange: [0, 0.2, 0.8, 1],
		outputRange: [1, 0.8, 0.2, 0]
	});

	return (
		<S.Container
			scrollEnabled={isActiveCard}
			bounces={false}
			keyboardShouldPersistTaps='always'
		>
			<StatusBar backgroundColor={theme.colors.white} barStyle='dark-content' />
			<Animated.View
				style={{
					opacity: headerOpacity
				}}
			>
				<HeaderMenu bgColor='white' leftIcon={{ iconColor: 'black' }} />
			</Animated.View>
			<S.TopPortion
				style={{
					transform: [{ translateY: interpolationGroup.topPortionY }]
				}}
			>
				<OppsScreenHeader
					pre={t('connectEntities.allSet.readyToGo')}
					header={t('connectEntities.allSet.clickToConnect')}
					alignment='stretch'
					marginTop={0}
					// marginBottom={deviceHeight * 0.015625}
				/>
				<SummaryCards
					onActiveCard={(index: number | null) =>
						setIsActiveCard(index !== null)
					}
					magnetExpanded={isExpanded}
				/>
			</S.TopPortion>
			<S.BottomPortionContainer
				onLayout={(e: LayoutChangeEvent) => {
					setBottomPortionYoffset(e.nativeEvent.layout.y);
				}}
			>
				<Icons.WhiteWave
					preserveAspectRatio='none'
					width={deviceWidth}
					height={deviceHeight * 0.15}
					style={{
						position: 'absolute',
						top: 0
					}}
				/>
				<S.IconsContainer
					style={{
						transform: [{ translateY: interpolationGroup.iconsContainer }]
					}}
				>
					<TouchableWithoutFeedback
						disabled={isExpanded}
						onPress={handleConnectPress}
					>
						<S.MagnetContainer
							style={{
								transform: [
									{ rotate: interpolationGroup.magnetRotate },
									{ scale: interpolationGroup.magentScale }
								]
							}}
						>
							<S.MagentCircle />
							<S.MagnetIcon
								size={120}
								icon={Icons.MagnetIcon}
								backgroundColor={theme.colors.orange}
							/>
						</S.MagnetContainer>
					</TouchableWithoutFeedback>

					<S.EntitiesContainer>
						<Animated.View
							style={{
								transform: [
									...iconsStyle,
									{ translateX: interpolationGroup.iconsXOffset }
								]
							}}
						>
							<EntityDetails
								avatar={ownerAvatar!}
								avatarType={ownerAvatarType!}
								name={fullName(oppData.user.firstName, oppData.user.lastName)}
								type={EntityEnum.OWNER}
								size={90}
							/>
						</Animated.View>

						<Animated.View
							style={{
								transform: [
									...iconsStyle,
									{
										translateX: Animated.multiply(
											interpolationGroup.iconsXOffset,
											-1
										)
									}
								]
							}}
						>
							<EntityDetails
								avatar={targetAvatar!}
								avatarType={targetAvatarType!}
								name={fullName(entity.firstName, entity.lastName)}
								type={EntityEnum.TARGET}
								size={90}
							/>
						</Animated.View>
					</S.EntitiesContainer>
				</S.IconsContainer>
			</S.BottomPortionContainer>
			<S.MadeAConnectionContainer
				style={{
					opacity: madeConnectionOpacityInterpolation,
					transform: [{ translateY: interpolationGroup.madeConnectionY }]
				}}
			>
				<S.YouJustMadeAConnection
					text={t('connectEntities.allSet.madeAConnection')}
					size='s22'
					bold
					center
					lineHeight={32}
				/>
			</S.MadeAConnectionContainer>
			<S.BackButtonContainer
				style={{
					transform: [{ translateY: interpolationGroup.buttonTranslateY }]
				}}
			>
				<S.BackToOppButton
					text={t('connectEntities.allSet.actionButtonText')}
					borderRadius='100px'
					onPress={() => {
						navigation.dismiss();
					}}
					backgroundColor={theme.colors.darkerBlue1}
				/>
			</S.BackButtonContainer>
			<S.AnimatedFooter
				style={{
					transform: [{ translateY: interpolationGroup.bottomGradient }]
				}}
			>
				<Icons.BlueWave
					preserveAspectRatio='none'
					height={deviceHeight * 0.25}
					width={deviceWidth}
					style={{
						transform: [{ rotateZ: '180deg' }, { rotateY: '180deg' }]
					}}
				/>
			</S.AnimatedFooter>
		</S.Container>
	);
};

const S: any = {};

S.Container = styled.ScrollView`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray12};
`;

S.TopPortion = styled(Animated.View)`
	padding-horizontal: ${deviceWidth * 0.06944444444};
	min-height: ${deviceHeight * 0.3859};
	background-color: ${({ theme }) => theme.colors.white};
`;

S.BottomPortionContainer = styled(Animated.View)`
	height: ${deviceHeight * 0.5218};
	/* background-color: red; */
`;

S.IconsContainer = styled(Animated.View)`
	z-index: 3;
	width: 100%;
`;

S.MagnetContainer = styled(Animated.View)`
	align-self: center;
	justify-content: center;
	align-items: center;
	z-index: 1;
`;

S.MagentCircle = styled.View`
	${createCircle(145)};
	background-color: #fbc638;
	opacity: 0.2;
`;
S.MagnetIcon = styled(RoundedIcon)`
	position: absolute;
	${createShadow({ elevation: 4 })};
	z-index: 1;
`;

S.EntitiesContainer = styled.View`
	flex-direction: row;
	padding-horizontal: ${calcWidth(50)};
	justify-content: space-between;
`;

S.MadeAConnectionContainer = styled(Animated.View)`
	position: absolute;
	top: ${calcHeight(363)};
	width: 100%;
	align-items: center;
`;

S.YouJustMadeAConnection = styled(CustomText)`
	width: ${calcWidth(230)};
`;
S.BackButtonContainer = styled(Animated.View)`
	position: absolute;
	bottom: ${calcHeight(35)};
`;

S.BackToOppButton = styled(Button)`
	height: ${calcHeight(35)};
	width: ${calcWidth(166)};
	margin-left: ${moderateScale(97)};
`;
S.AnimatedFooter = styled(Animated.View)`
	position: absolute;
	bottom: 0;
	right: 0;
	z-index: -1;
`;

export default AllSet;
