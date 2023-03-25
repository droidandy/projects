import React, { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components/native';
import { Animated, TouchableWithoutFeedback, View } from 'react-native';
import { useInterpolationGroup } from '../../hooks';
import {
	IChildren,
	IModalAndSlidingDropdownControls,
	IStyle
} from '../../types/interfaces';
import Icons from './Icons';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { PlainFunction } from '../../types/interfaces';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export interface IModalProps extends IChildren, IStyle {
	onClose?: PlainFunction;
}

const Modal = React.forwardRef<IModalAndSlidingDropdownControls, IModalProps>(
	(props, ref) => {
		const { children, style, onClose } = props;
		const [isOpen, setOpen] = useState(false);
		const animated = useRef(new Animated.Value(0)).current;

		const open = useCallback(() => {
			setOpen(true);
		}, []);

		const close = useCallback(() => {
			setOpen(false);
			typeof onClose == 'function' && onClose();
		}, []);

		useEffect(() => {
			Animated.spring(animated, {
				toValue: Number(isOpen),
				useNativeDriver: true
			}).start();
		}, [isOpen]);

		const interpolationGroup = useInterpolationGroup({
			animatedValue: animated,
			inputRange: [0, 1],
			groups: {
				translateY: [100, 0],
				opacity: [0, 1]
			}
		});

		useEffect(() => {
			// @ts-ignore
			ref.current = {
				open,
				close
			};
		}, []);

		return (
			<S.Container pointerEvents={isOpen ? 'auto' : 'none'}>
				<KeyboardAwareScrollView
					showsVerticalScrollIndicator={false}
					enableOnAndroid={true}
					style={{
						zIndex: 200
					}}
					contentContainerStyle={{
						alignItems: 'center',
						justifyContent: 'center',
						height: deviceHeight,
						width: deviceWidth
					}}
				>
					<S.Content
						style={[
							{
								transform: [
									{
										translateY: interpolationGroup.translateY
									}
								],
								opacity: interpolationGroup.opacity
							},
							style
						]}
					>
						<S.CloseBtnContainer>
							<S.CloseIcon onPress={close}>
								<Icons.XIcon />
							</S.CloseIcon>
						</S.CloseBtnContainer>
						{children}
					</S.Content>
				</KeyboardAwareScrollView>

				<TouchableWithoutFeedback onPress={close}>
					<S.Overlay style={{ opacity: interpolationGroup.opacity }} />
				</TouchableWithoutFeedback>
			</S.Container>
		);
	}
);

const S: any = {};
const sharedStyle = `
	position: absolute;
	top: 0;
	left: 0;
	width: ${deviceWidth};
	min-height: ${deviceHeight};
	z-index: 10;
`;

S.Container = styled(Animated.View)`
	${sharedStyle};
	z-index: 1;
	align-items: center;
	justify-content: center;
`;

S.Overlay = styled(Animated.View)`
	${sharedStyle};
	background: ${({ theme }) => theme.colors.blackOpacity};
`;

S.Content = styled(Animated.View)`
	background: ${({ theme }) => theme.colors.white};
	width: 86.1%;
	border-radius: 18px;
	z-index: 1;
	padding-horizontal: ${deviceWidth * 0.0694};
	padding-bottom: ${deviceHeight * 0.0390625};
	justify-content: center;
	align-items: center;
	z-index: 11;
`;

S.CloseBtnContainer = styled.View`
	align-self: flex-end;
`;

S.CloseIcon = styled.TouchableOpacity`
	margin-left: auto;
	padding-vertical: ${deviceHeight * 0.0390625};
`;

export default Modal;
