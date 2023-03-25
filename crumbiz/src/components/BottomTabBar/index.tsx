import * as React from 'react';
import { Animated, StyleSheet, View } from 'react-native';
// @ts-ignore
import * as shape from 'd3-shape';
// @ts-ignore
import Androw from 'react-native-androw';
import Svg, { Path } from 'react-native-svg';
import StaticTabBar from './StaticTabBar';
import { deviceWidth } from '../../utils/dimensions';
import NewsFeed from '../../screens/InteractionsFeed';
import MyOpps from '../../screens/MyOpps';
import Relationships from '../../screens/Relationships';
import Analytics from '../../screens/Analytics/Analytics';
import styled from 'styled-components/native';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { ScreensEnum } from '../../navigation/screens';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);
const bottomBarHeight = 64;

const getPath = (tabWidth: number): string => {
	const left = shape.line()
		.x((d: any) => d.x)
		.y((d: any) => d.y)([
			{ x: 0, y: 0 },
			{ x: deviceWidth, y: 0 },
		]);

	const offsets = {
		y: {
			lowest: deviceWidth * 0.01701388888,
			mid: 0,
			highest: 0.7 * bottomBarHeight
		},
		x: {
			lowest: deviceWidth * 0.01458333333,
			mid: deviceWidth * 0.03645833333,
			highest: deviceWidth * 0.06076388888
		}
	}
	const tab = shape.line().x((d: any) => d.x).y((d: any) => d.y).curve(shape.curveBasis)([
		{ x: deviceWidth, y: offsets.y.mid },
		{ x: deviceWidth + offsets.x.lowest, y: offsets.y.mid },
		{ x: deviceWidth + offsets.x.mid, y: offsets.y.lowest },
		{ x: deviceWidth + offsets.x.highest, y: offsets.y.highest },
		{ x: deviceWidth + tabWidth - offsets.x.highest, y: offsets.y.highest },
		{ x: deviceWidth + tabWidth - offsets.x.mid, y: offsets.y.lowest },
		{ x: deviceWidth + tabWidth - offsets.x.lowest, y: offsets.y.mid },
		{ x: deviceWidth + tabWidth, y: offsets.y.mid },
	]);

	const right = shape.line().x((d: any) => d.x).y((d: any) => d.y)([
		{ x: deviceWidth + tabWidth, y: 0 },
		{ x: deviceWidth * 2, y: 0 },
		{ x: deviceWidth * 2, y: bottomBarHeight },
		{ x: 0, y: bottomBarHeight },
		{ x: 0, y: 0 },
	]);
	return `${left} ${tab} ${right}`;
};

interface IProps {
	state: any;
	navigation: any;
}

const screens = {
	Home: { screen: NewsFeed },
	Opps: { screen: MyOpps },
	Relationships: { screen: Relationships },
	Analytics: { screen: Analytics }
};

const BottomTabBar: React.FC<IProps> = (props) => {
	const { navigation, ...rest } = props;
	const { state } = navigation;

	const tabWidth = deviceWidth / state.routes.length;
	const d = getPath(tabWidth);

	const value = new Animated.Value(deviceWidth / 2 - tabWidth / 2);
	const translateX = value.interpolate({
		inputRange: [0, deviceWidth],
		outputRange: [-deviceWidth, 0],
	});

	const onPress = (route: any, isFocused: boolean) => {
		navigation.navigate(route.routeName);
	};

	return (
		<S.BarContainer>
			<S.ContentContainer {...{ height: bottomBarHeight, width: deviceWidth, ...rest }}>
				<Androw style={styles.shadow}>
					<AnimatedSvg
						width={deviceWidth * 2}
						height={bottomBarHeight}
						style={{ transform: [{ translateX }] }}
					>
						<Path fill="white" {...{ d }} />
					</AnimatedSvg>
					<View style={StyleSheet.absoluteFill}>
						<StaticTabBar
							value={value}
							routes={state.routes}
							active={state.index}
							onPress={onPress}
						/>
					</View>
				</Androw>
			</S.ContentContainer>
		</S.BarContainer>
	);
}

const S: any = {};

S.BarContainer = styled.View`
	position: absolute;
	left: 0;
	right: 0;
	bottom: 0;
`;

S.ContentContainer = styled.View`
	height: ${bottomBarHeight};
	width: 100%;
`;

const styles = StyleSheet.create({
	shadow:{
		shadowColor: '#000000',
		shadowOffset:{
			width: 0,
			height: 0,
		},
		shadowOpacity: .25,
		shadowRadius: 10
	}
});

const options = {
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarVisible: navigation.state.routeName !== ScreensEnum.LOGIN
	}),
	tabBarComponent: BottomTabBar
}

export default createBottomTabNavigator(screens, options);
