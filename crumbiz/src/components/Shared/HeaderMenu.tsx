import React, { StatelessComponent } from 'react';
import styled from 'styled-components/native';
import { TouchableOpacity } from 'react-native';
import { PlainFunction } from '../../types/interfaces';
import Icons from './Icons';
import { IColors } from '../../types/styled';
import {
	deviceHeight,
	deviceWidth,
	headerMenuHeight
} from '../../utils/dimensions';
import { useTheme } from '../../hooks';
import { navigationService } from '../../services';
interface IIcon {
	onPress?: PlainFunction;
	icon?: StatelessComponent;
	iconColor?: keyof IColors;
}

interface IProps {
	leftIcon?: IIcon;
	rightIcon?: IIcon;
	onMiddleLineClick?: PlainFunction;
	hideLeftIcon?: boolean;
	disabled?: boolean;
	hideMiddleIcon?: boolean;
	bgColor?: keyof IColors;
}

const HeaderMenu: React.FC<IProps> = props => {
	const {
		leftIcon,
		rightIcon,
		hideLeftIcon,
		disabled,
		hideMiddleIcon,
		bgColor = 'transparent'
	} = props;
	const theme = useTheme();

	const leftIconConfig: IIcon = {
		iconColor: 'white',
		icon: Icons.ArrowBackWithoutLineIcon,
		...leftIcon
	};

	const rightIconConfig: IIcon = {
		iconColor: 'white',
		icon: Icons.ThreeDotsIcon,
		...rightIcon
	};

	const { icon: RightIcon } = rightIconConfig;

	return (
		<S.Container style={{ backgroundColor: bgColor }}>
			{!hideLeftIcon ? (
				<S.IconContainer
					disabled={disabled}
					onPress={() => {
						typeof leftIconConfig.onPress == 'function'
							? leftIconConfig.onPress()
							: navigationService.goBack();
					}}
				>
					<Icons.ArrowBackWithoutLineIcon
						fill={theme.colors[leftIconConfig.iconColor!]}
					/>
				</S.IconContainer>
			) : null}

			{props.onMiddleLineClick && !hideMiddleIcon ? (
				<S.OppTouchableLine onPress={props.onMiddleLineClick}>
					<S.OpDetailsLine />
				</S.OppTouchableLine>
			) : null}

			{rightIconConfig!.onPress ? (
				<S.IconContainer onPress={rightIcon!.onPress}>
					{/*
					//@ts-ignore */}
					<RightIcon fill={theme.colors[rightIconConfig.iconColor!]} />
				</S.IconContainer>
			) : null}
		</S.Container>
	);
};

HeaderMenu.defaultProps = {
	leftIcon: {},
	rightIcon: {}
};

const S: any = {};

S.Container = styled.View`
	width: 100%;
	height: ${headerMenuHeight};
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
`;

S.OppTouchableLine = styled(TouchableOpacity)`
	align-self: center;
	padding-horizontal: ${deviceWidth * 0.072};
	padding-vertical: ${deviceHeight * 0.0359};
`;

S.OpDetailsLine = styled.View`
	width: ${deviceWidth * 0.186};
	aspect-ratio: 16.75;
	background: white;
	opacity: 0.2;
	border-radius: 8;
	align-self: center;
`;

S.IconContainer = styled.TouchableOpacity`
	padding-horizontal: ${deviceWidth * 0.072};
	padding-top: ${deviceHeight * 0.0359};
	padding-bottom: ${deviceHeight * 0.0343};
`;

export default HeaderMenu;
