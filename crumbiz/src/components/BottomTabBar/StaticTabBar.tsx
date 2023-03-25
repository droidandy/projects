import * as React from 'react';
import { Animated, Route, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import BottomTabIcon from '../Shared/BottomTabIcon';
import styled from 'styled-components/native';
import { navigationService } from '../../services';
import { FloatingButton } from '../Shared';
import { createCircle } from '../../utils';
import { deviceWidth } from '../../utils/dimensions';
import { ScreensEnum } from '../../navigation/screens';

interface IProps {
	routes: Route[];
	active: number,
	value: Animated.Value;
	onPress: Function;
}

const StaticTabBar: React.FC<IProps> = (props) => {
	const { routes, onPress, active } = props;
	const handlePress = (route: Route) => {
		onPress(route);
	}

	const midIndex = Math.ceil(routes.length / 2);
	const [firstGroup, secondGroup] = [
		routes.slice(0, midIndex),
		routes.slice(midIndex)
	];

	const renderGroup = (group, indexOffset = 0) => {
		return (
			<S.GroupContainer>
				{group.map((route: Route, index: number) => {
					return (
						<TouchableOpacity
							key={index}
							onPress={() => handlePress(route)}
						>
							<BottomTabIcon routeName={route.routeName} focused={active === index + indexOffset} />
						</TouchableOpacity>
					);
				})}
			</S.GroupContainer>
		)
	}

	return (
		<S.Container>
			{renderGroup(firstGroup)}
			<S.CenteredFloatingButton
				gradientBackground='orange'
				gradientProps={{ useAngle: true, angle: 218 }}
				onPress={() => {
					navigationService.navigate(ScreensEnum.CHOOSE_OPPORTUNITY);
				}}
				distanceFromBottom={20}
			/>
			{renderGroup(secondGroup, 2)}
		</S.Container>
	)
}

const S: any = {};

S.Container = styled.View`
	flex-direction: row;
	justify-content: space-between;
	height: 100%;
`;

S.GroupContainer = styled.View`
	width: 35%;
	display: flex;
	flex-direction: row;
	justify-content: space-around;
	align-items: center;
`

S.CenteredFloatingButton = styled(FloatingButton)`
	position: relative;
	left: 0;
	
	${createCircle(deviceWidth * 0.12888888888)}
`
export default StaticTabBar;
