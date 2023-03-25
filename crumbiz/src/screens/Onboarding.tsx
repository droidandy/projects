import React, { useRef, useState } from 'react';
import { View, Animated } from 'react-native';
import i18n from '../locale/i18n';
import FirstScreenLogo from '../assets/icons/onboarding/first-screen-logo.svg';
import SecondScreenLogo from '../assets/icons/onboarding/second-screen-logo.svg';
import ThirdScreenLogo from '../assets/icons/onboarding/third-screen-logo.svg';
import { IStackNavigation } from '../types/interfaces';
// @ts-ignore
import SwiperFlatList from 'react-native-swiper-flatlist';
import styled, { DefaultTheme, withTheme } from 'styled-components/native';
import { Button, Typography } from '../components/Shared';
import { calcHeight, deviceHeight, deviceWidth } from '../utils/dimensions';
import { ScreensEnum } from '../navigation/screens';

interface IProps extends IStackNavigation {
	theme: DefaultTheme;
}

const slides = [
	{
		headerText: i18n.t('onboarding.firstScreen.headerText'),
		descriptionText: i18n.t('onboarding.firstScreen.descriptionText'),
		logo: FirstScreenLogo
	},
	{
		headerText: i18n.t('onboarding.secondScreen.headerText'),
		descriptionText: i18n.t('onboarding.secondScreen.descriptionText'),
		logo: SecondScreenLogo
	},
	{
		headerText: i18n.t('onboarding.thirdScreen.headerText'),
		descriptionText: i18n.t('onboarding.thirdScreen.descriptionText'),
		logo: ThirdScreenLogo
	}
];

const BUTTON_HEIGHT = calcHeight(60);
const BOTTOM_MARGIN = 30;

const Onboarding: React.FC<IProps> = ({ theme, navigation }) => {
	const [index, setIndex] = useState(0);
	const swiperRef = useRef();
	const animation = useRef(new Animated.Value(0)).current;

	// Opacity
	const opacityInterpolation = animation.interpolate({
		inputRange: [deviceWidth, deviceWidth * 2],
		outputRange: [1, 0]
	});

	const opacityStyle = {
		opacity: opacityInterpolation
	};

	// Transform
	const translateYInterpolation = animation.interpolate({
		inputRange: [deviceWidth, deviceWidth * 2],
		outputRange: [BUTTON_HEIGHT + BOTTOM_MARGIN, 0]
	});

	const transformStyle = {
		transform: [{ translateY: translateYInterpolation }]
	};

	return (
		<View style={{ flex: 1 }}>
			<View style={{ height: deviceHeight - 130 }}>
				<SwiperFlatList
					showPagination
					paginationDefaultColor={theme.colors.gray4}
					paginationActiveColor={theme.colors.darkGray}
					index={index}
					ref={swiperRef}
					paginationStyle={{
						bottom: 5
					}}
					onViewableItemsChanged={() => {
						// @ts-ignore
						setIndex(swiperRef.current!.getCurrentIndex());
					}}
					onScroll={Animated.event([
						{
							nativeEvent: {
								contentOffset: {
									x: animation
								}
							}
						}
					])}
				>
					{slides.map(({ headerText, descriptionText, logo: Logo }, i) => (
						<View key={i}>
							<S.Slide>
								<S.TextContainer>
									<Typography.HeaderText>{headerText}</Typography.HeaderText>
									<Typography.Text>{descriptionText}</Typography.Text>
								</S.TextContainer>

								<S.LogoContainer>
									<Logo />
								</S.LogoContainer>
							</S.Slide>
						</View>
					))}
				</SwiperFlatList>
			</View>

			<Animated.View style={opacityStyle}>
				<S.NextButton
					text={i18n.t('onboarding.next')}
					onPress={() => {
						// @ts-ignore
						swiperRef.current!.scrollToIndex({
							index: index + 1,
							animated: true
						});
						setIndex(index + 1);
					}}
					variant={'light'}
				/>
			</Animated.View>

			<S.GetStartedCrumbizContainer style={transformStyle}>
				<Button
					text={i18n.t('onboarding.getStarted')}
					onPress={() => {
						navigation.navigate(ScreensEnum.DASHBOARD);
					}}
					variant='dark'
				/>
			</S.GetStartedCrumbizContainer>
		</View>
	);
};

const S: any = {};
S.TextContainer = styled.View`
	align-items: center;
`;

S.Slide = styled.View`
	flex: 1;
	align-items: center;
	flex-wrap: wrap;
	width: ${deviceWidth};
`;

S.LogoContainer = styled.View`
	flex: 1;
	justify-content: center;
	align-items: center;
`;

S.NextButton = styled(Button)`
	align-self: center;
	top: 10px;
`;

S.GetStartedCrumbizContainer = styled(Animated.View)`
	position: absolute;
	bottom: 30px;
	align-self: center;
`;

export default withTheme(Onboarding as never);
