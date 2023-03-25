import React, { useMemo } from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import Icons from './Icons';
import { useTheme } from '../../hooks';
import { DynamicObject } from '../../types/interfaces';

interface IProps {
	routeName: string;
	focused: boolean;
}

export enum RouteOptions {
	Home = 'Home',
	Opps = 'Opps',
	Relationships = 'Relationships',
	Analytics = 'Analytics'
}

const routeToIcon: DynamicObject<any> = {
	[RouteOptions.Home]: Icons.HomeIcon,
	[RouteOptions.Opps]: Icons.MagnetFullIcon,
	[RouteOptions.Relationships]: Icons.RelationshipsIcon,
	[RouteOptions.Analytics]: Icons.AnalyticsIcon
};

interface StyleOptions {
	focused: boolean;
	styles?: Object;
}

const createStylesMaker = (theme: DefaultTheme) => ({
	focused,
	styles
}: StyleOptions) => {
	return {
		// Default Styles
		width: deviceWidth * 0.06944444444,
		height: deviceHeight * 0.03125,
		fill: focused ? theme.colors.orange : theme.colors.paleBlue2,
		// Custom Styles
		...styles
	};
};

const BottomTabIcon: React.FC<IProps> = ({ routeName, focused }) => {
	const theme = useTheme();
	const makeStyles = useMemo(() => {
		return createStylesMaker(theme);
	}, [theme]);

	const IconComponent = routeToIcon[routeName];
	const styles = makeStyles({ focused });

	return (
		<S.Container>
			<IconComponent {...styles} />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View``;

export default BottomTabIcon;
