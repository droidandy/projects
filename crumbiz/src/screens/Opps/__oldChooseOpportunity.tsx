import React from 'react';
import styled from 'styled-components/native';
import { useSelector } from 'react-redux';

import { Button, Icons, Typography } from '../../components/Shared';
import { useTranslation } from 'react-i18next';
import { IStackNavigation } from '../../types/interfaces';
import { OppsScreenHeader } from '../../components/Opps';
import { ScreensEnum } from '../../navigation/screens';

const CIRCLE_RADIUS = 73;
const CIRCLE_WIDTH = 220;
const CIRCLE_HEIGHT = 220;
const CATEGORIES = Array.from({ length: 5 });

const step = (2 * Math.PI) / CATEGORIES.length;
let angle = Math.PI * 3.5;
function getXY(): { x: number; y: number } {
	var x = Math.round(
		CIRCLE_WIDTH / 2 + CIRCLE_RADIUS * Math.cos(angle) - 20 / 2 - 70
	);
	var y = Math.round(
		CIRCLE_HEIGHT / 2 + CIRCLE_RADIUS * Math.sin(angle) - 20 / 2 - 70
	);

	angle += step;
	return {
		x,
		y
	};
}

interface IProps extends IStackNavigation {}
const ChooseOpportunity: React.FC<IProps> = props => {
	const { t } = useTranslation();

	// Opp Types DATA
	// const oppTypes: [] = useSelector(templateFieldsSelector).oppTypes;

	return (
		<S.Container>
			<OppsScreenHeader
				pre={t('opps.chooseOp.chooseThe')}
				header={t('opps.chooseOp.opType')}
			/>

			<S.Circle>
				{CATEGORIES.map((_, i) => {
					const { x, y } = getXY();
					return <S.Icon style={{ top: y, left: x }} key={i} />;
				})}
			</S.Circle>

			<S.TextContainer>
				<Typography.H7>Fundraising</Typography.H7>
				<Typography.Text>
					Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
					eiusmod
				</Typography.Text>
			</S.TextContainer>

			<S.NextButton
				text='Next'
				onPress={() =>
					props.navigation.navigate(ScreensEnum.SET_OPPORTUNITY_TITLE)
				}
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
`;

S.Circle = styled.View`
	width: 220px;
	height: 220px;
	border-radius: 110px;
	border-width: 70px;
	border-color: ${props => props.theme.colors.gray8};
	align-self: center;
	margin-top: 50px;
	position: relative;
`;

S.Icon = styled(Icons.LinkedIcon)`
	position: absolute;
	width: 20px;
	height: 20px;
`;

S.TextContainer = styled.View`
	margin-top: 30px;
`;

S.NextButton = styled(Button)`
	margin-top: auto;
	align-self: center;
	margin-bottom: 30px;
`;

export default ChooseOpportunity;

// FIRST VERSION OF CHOOSE OPPORTUNITY

// import React, { useRef } from 'react';
// import styled, { css } from 'styled-components/native';
// import { Animated, PanResponder } from 'react-native';
// import { Icons, Typography } from '../../components/Shared';
// import { useTranslation } from 'react-i18next';
// import { IStackNavigation, ITheme } from '../../types/interfaces';
// import { OppsScreenHeader } from '../../components/Opps';
// import i18n from '../../locale/i18n';
// import { deviceWidth } from '../../utils/dimensions';
// import { ScreensEnum } from '../../navigation';

// import { useDispatch, useSelector } from 'react-redux';
// import { updateOpportunity } from '../../store/actions/createOpportunityActions';

// const TEMP_CATEGORIES = [
// 	{
// 		icon: Icons.BackIcon,
// 		title: i18n.t('opps.chooseOp.categories.forStaff'),
// 		text:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit euismod in pellentesque massa placerat. Pharetra vel turpis nunc eget lorem dolor sed viverra ipsum.',
// 		id: 'a9c6935d-3608-4b80-80a8-50d8221daae9'
// 	},
// 	{
// 		icon: Icons.BackIcon,
// 		title: i18n.t('opps.chooseOp.categories.fundraising'),
// 		text:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Velit euismod in pellentesque massa placerat. Pharetra vel turpis nunc eget lorem dolor sed viverra ipsum.',
// 		id: 'a9c6935d-3608-4b80-80a8-50d8221daae8'
// 	}
// ];

// const SQUARE_WIDTH = 100;
// const SHORT_SWIPE_THRESHOLD = deviceWidth / 3;
// const FAST_SWIPE_THRESHOLD = 1;
// const ANIMATED_CONFIG = {
// 	useNativeDriver: true
// };

// interface IProps extends IStackNavigation {}
// const ChooseOpportunity: React.FC<IProps> = props => {
// 	const { t } = useTranslation();
// 	const animated = useRef(new Animated.Value(0)).current;
// 	let currentIndex = useRef(0).current;
// 	let lastIndex = useRef(0).current;
// 	const dispatch = useDispatch();

// 	// OppTypes DATA
// 	const { oppTypes } = useSelector(templateFieldsSelector);

// 	const squaresContainerTranslateXInterpolation = animated.interpolate({
// 		inputRange: [0, deviceWidth],
// 		outputRange: [0, deviceWidth / 2 + SQUARE_WIDTH / 4]
// 	});

// 	const squareContainerStyle = {
// 		transform: [{ translateX: squaresContainerTranslateXInterpolation }]
// 	};

// 	const descriptionContainerTranslateXInterpolation = animated.interpolate({
// 		inputRange: [0, deviceWidth * TEMP_CATEGORIES.length - 1],
// 		outputRange: [0, deviceWidth * TEMP_CATEGORIES.length - 1]
// 	});

// 	const descriptionContainer = {
// 		transform: [{ translateX: descriptionContainerTranslateXInterpolation }]
// 	};

// 	const adjustSlide = () => {
// 		goToSlide();
// 	};

// 	const goToSlide = (index = currentIndex) => {
// 		Animated.spring(animated, {
// 			toValue: currentIndex * (index >= lastIndex ? -deviceWidth : deviceWidth),
// 			...ANIMATED_CONFIG
// 		}).start(() => animated.extractOffset());
// 		lastIndex = index;
// 	};

// 	const prevSlide = () => {
// 		if (currentIndex === 0) {
// 			adjustSlide();
// 			return;
// 		}
// 		currentIndex--;
// 		goToSlide();
// 	};

// 	const nextSlide = () => {
// 		if (currentIndex >= TEMP_CATEGORIES.length - 1) {
// 			adjustSlide();
// 			return;
// 		}
// 		currentIndex++;
// 		goToSlide();
// 	};

// 	const panResponder = PanResponder.create({
// 		onStartShouldSetPanResponder: () => false,
// 		onMoveShouldSetPanResponder: (evt, gestureState) => {
// 			// return true if user is swiping, return false if it's a single click
// 			return !(gestureState.dx <= 2 && gestureState.dy <= 2);
// 		},
// 		onPanResponderMove: Animated.event([null, { dx: animated }]),
// 		onPanResponderRelease: (e, { dx, vx, vy }) => {
// 			animated.flattenOffset();
// 			const SWIPE_THRESHOLD =
// 				Math.abs(vx) > 0.3 ? FAST_SWIPE_THRESHOLD : SHORT_SWIPE_THRESHOLD;

// 			if (Math.abs(dx) < SWIPE_THRESHOLD) {
// 				adjustSlide();
// 				return;
// 			}

// 			if (dx >= 0) {
// 				prevSlide();
// 			} else if (dx <= 0) {
// 				nextSlide();
// 			}
// 		}
// 	});

// 	return (
// 		<S.Container>
// 			<OppsScreenHeader
// 				pre={t('opps.chooseOp.chooseThe')}
// 				header={t('opps.chooseOp.opType')}
// 			/>

// 			<S.AnimatedContainer {...panResponder.panHandlers}>
// 				<S.SquaresContainer style={squareContainerStyle}>
// 					{[{ title: 'left' }, ...TEMP_CATEGORIES, { title: 'right' }].map(
// 						(category, index) => {
// 							const { icon: Icon, title, id } = category as any;
// 							const marginLeft = index === 0 ? 0 : deviceWidth / 2 - 75; // left square width 25 + 50 half width == 75
// 							return (
// 								<S.CategorySquare
// 									trimmed={index === 0 || index === TEMP_CATEGORIES.length + 1}
// 									style={{ marginLeft }}
// 									key={title}
// 									onPress={() => {
// 										dispatch(updateOpportunity('opType', { title, id }));
// 										props.navigation.navigate(
// 											ScreensEnum.SET_OPPORTUNITY_TITLE
// 										);
// 									}}
// 								>
// 									{Icon && <Icon />}
// 								</S.CategorySquare>
// 							);
// 						}
// 					)}
// 				</S.SquaresContainer>

// 				<S.DescriptionContainer style={descriptionContainer}>
// 					{TEMP_CATEGORIES.map(({ text, title }) => (
// 						<S.Description key={title}>
// 							{/*
// 							 // @ts-ignore  */}
// 							<Typography.Text style={{ fontWeight: 'bold' }}>
// 								{title}
// 							</Typography.Text>
// 							<Typography.Text>{text}</Typography.Text>
// 						</S.Description>
// 					))}
// 				</S.DescriptionContainer>
// 			</S.AnimatedContainer>

// 			<S.BottomBackgroundColor />
// 		</S.Container>
// 	);
// };

// const S: any = {};
// S.Container = styled.View`
// 	flex: 1;
// 	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
// `;

// S.AnimatedContainer = styled(Animated.View)`
// 	flex: 1;
// 	background-color: transparent;
// 	justify-content: center;
// `;

// S.SquaresContainer = styled(Animated.View)`
// 	flex-direction: row;
// 	width: 100%;
// 	height: 100px;
// 	margin-top: -70px;
// `;

// S.CategorySquare = styled.TouchableOpacity(
// 	({ trimmed, theme }: ITheme & { trimmed: boolean }) => `
// 	height: 100px;
// 	width: 100px;
// 	background: white;
// 	align-items: center;
// 	justify-content: center;
// 	z-index: 1;

// 	${trimmed &&
// 		css`
// 			width: 25px;
// 		`}
// `
// );

// S.DescriptionContainer = styled(Animated.View)`
// 	flex-direction: row;
// `;

// S.Description = styled.View`
// 	width: 100%;
// `;

// S.BottomBackgroundColor = styled.View`
// 	position: absolute;
// 	height: 55%;
// 	background-color: ${({ theme }) => theme.colors.gray8};
// 	bottom: 0;
// 	width: 100%;
// 	z-index: -1;
// `;

// S.ScrollView = styled.ScrollView`
// 	position: absolute;
// 	height: 100%;
// 	width: 100%;
// 	background: transparent;
// 	z-index: 1;
// `;

// export default ChooseOpportunity;
