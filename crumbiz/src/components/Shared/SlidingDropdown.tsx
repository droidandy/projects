import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import {
	Animated,
	TouchableOpacity,
	TouchableWithoutFeedback
} from 'react-native';
import {
	IChildren,
	IModalAndSlidingDropdownControls,
	ITheme
} from '../../types/interfaces';
import { useEffectAfterMount, useInterpolationGroup } from '../../hooks';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import Icons from './Icons';

interface IProps extends IChildren {
	location: 'top' | 'bottom';
	displayCloseButton?: boolean;
	withoutOverlay?: boolean;
}

const SlidingDropdown = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const animated = useRef(new Animated.Value(0)).current;
	const [isOpen, setOpen] = useState(false);
	const { location, displayCloseButton, withoutOverlay } = props;

	const open = useCallback(() => {
		setOpen(true);
	}, []);

	const close = useCallback(() => {
		setOpen(false);
	}, []);

	useEffect(() => {
		// @ts-ignore
		ref.current = {
			open,
			close
		};
	}, []);

	useEffectAfterMount(() => {
		Animated.spring(animated, {
			toValue: Number(isOpen),
			useNativeDriver: true
		}).start();
	}, [isOpen]);

	const interpolationGroup = useInterpolationGroup({
		animatedValue: animated,
		inputRange: [0, 1],
		groups: {
			overlayOpacity: [0, 1],
			contentTranslateY: [location == 'top' ? -deviceHeight : deviceHeight, 0]
		}
	});

	return (
		<S.Container
			pointerEvents={isOpen ? 'auto' : 'none'}
			location={location}
			withoutOverlay={withoutOverlay}
		>
			{!withoutOverlay && (
				<TouchableWithoutFeedback onPress={close}>
					<S.Overlay style={{ opacity: interpolationGroup.overlayOpacity }} />
				</TouchableWithoutFeedback>
			)}
			<S.Content
				style={{
					transform: [{ translateY: interpolationGroup.contentTranslateY }]
				}}
				location={location}
				displayCloseButton={displayCloseButton}
			>
				{displayCloseButton && (
					<S.CloseButton onPress={close}>
						<Icons.XIcon pointerEvents='none' />
					</S.CloseButton>
				)}
				{props.children}
			</S.Content>
		</S.Container>
	);
});

const S: any = {};
const sharedStyles = `
 position: absolute;
	left: 0;
	width: ${deviceWidth};
`;

S.Container = styled(Animated.View)(
	({ location, withoutOverlay }: Partial<IProps>) => `
	${sharedStyles};
	z-index: 1;
	
	${
		location === 'bottom'
			? `
    bottom: 0;
    ${!withoutOverlay && `height: ${deviceHeight}`}
	`
			: ''
	}
  
	
	${
		location == 'top'
			? `
		height: ${deviceHeight};
		top: 0;
	`
			: ''
	}
`
);

S.Overlay = styled(Animated.View)`
	${sharedStyles};
	background: ${({ theme }) => theme.colors.blackOpacity};
	height: ${deviceHeight};
`;

S.Content = styled(Animated.View)(
	({ location, theme, displayCloseButton }: Partial<IProps> & ITheme) => `
	width: 100%;
	background: ${theme.colors.white};
	z-index: 200;
	padding-horizontal: ${deviceWidth * 0.083};
	padding-vertical: ${deviceHeight * 0.039};
  
	
	${location == 'top' &&
		`
		top: 0;
		border-bottom-left-radius: 20;
    border-bottom-right-radius: 20;
    position: absolute;
	`};
	
	${location == 'bottom' &&
		`
    margin-top: auto;
		border-top-left-radius: 20;
		border-top-right-radius: 20;
	`};
	
	${location == 'bottom' &&
		displayCloseButton &&
		`
		padding-top: ${deviceHeight * 0.07}
	`};
`
);

S.CloseButton = styled(TouchableOpacity)`
	position: absolute;
	top: 0;
	right: 0;
	padding-horizontal: ${deviceWidth * 0.0694};
	padding-vertical: ${deviceHeight * 0.039};
`;

export default SlidingDropdown;
