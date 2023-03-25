import React, { useMemo } from 'react';
import { SceneMap, TabBar, TabView as _TabView } from 'react-native-tab-view';
import { IPlainObject, StateUpdaterFunction } from '../../types/interfaces';
import { useTheme } from '../../hooks';
import { deviceWidth, deviceHeight } from '../../utils/dimensions';
import CustomText from './CustomText';
import { IColors } from '../../types/styled';
import { defaultTheme } from '../../themes';

interface ITab {
	key: string;
	title: string;
	component: () => React.ReactNode;
}

interface IProps {
	tabs: Array<ITab>;
	index: number;
	setIndex: StateUpdaterFunction<number>;
	tabBarBackgroundColor?: keyof IColors | string;
	marginBottom?: number;
}

const TabView: React.FC<IProps> = props => {
	const theme = useTheme();
	const { tabs, index, setIndex, tabBarBackgroundColor, marginBottom } = props;

	const scenes = useMemo(() => {
		const _tabs = tabs.reduce((acc, currentTab) => {
			const { key, component } = currentTab;
			acc[key] = component;
			return acc;
		}, {} as IPlainObject);
		return SceneMap(_tabs);
	}, [tabs]);

	return (
		<_TabView
			lazy
			renderTabBar={props => (
				<TabBar
					{...props}
					labelStyle={{
						color: 'black'
					}}
					renderLabel={route => (
						<CustomText
							text={route.route.title}
							size='s14'
							style={{
								opacity: route.focused ? 1 : 0.5,
								paddingTop: deviceHeight * 0.015,
								color: theme.colors.darkerBlue1
							}}
						/>
					)}
					indicatorStyle={{
						backgroundColor: theme.colors.lightBlue1
					}}
					style={{
						elevation: 0,
						marginBottom: marginBottom ? marginBottom : 0,
						backgroundColor: tabBarBackgroundColor,
					}}
				/>
			)}
			navigationState={{
				index: index,
				routes: tabs
			}}
			renderScene={scenes}
			onIndexChange={(index: number) => setIndex(index)}
			initialLayout={{ width: deviceWidth }}
		/>
	);
};

TabView.defaultProps = {
	tabBarBackgroundColor: defaultTheme.colors.white
};

export default TabView;
