import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Animated, View } from 'react-native';
import {
	IStackNavigation,
	IModalAndSlidingDropdownControls
} from '../types/interfaces';
import { useTranslation } from 'react-i18next';
import { TextInput } from '../components/Shared/Form@2.0';
import styled from 'styled-components/native';
import { Typography, Button, Icons } from '../components/Shared';
import ModalLayout from '../components/Shared/Modal';
import {
	ModalHeaderText,
	ModalText
} from '../components/Shared/ModalAndDropdownContents';
import {
	calcFontSize,
	calcHeight,
	calcWidth,
	verticalScale,
	scale1,
	deviceHeight
} from '../utils/dimensions';

interface INavigationParams {
	headerText: string;
	message: string;
	inputPlaceholder: string;
	actionButtonText: string;
	onActionButtonPress?: () => any;
}

interface IProps extends IStackNavigation {}

const Modal: React.FC<IProps> = props => {
	const {
		headerText,
		message,
		inputPlaceholder,
		actionButtonText,
		onActionButtonPress
	} = props.navigation!.state.params! || {};
	const { t } = useTranslation();
	const [input, setInput] = useState('');
	const handleActionButtonPress = useCallback(() => {
		if (onActionButtonPress) {
			typeof onActionButtonPress === 'function' && onActionButtonPress(input);
			return;
		}

		props.navigation.goBack(null);
	}, [input]);

	const modalRef = useRef<IModalAndSlidingDropdownControls>(null);

	useEffect(() => {
		modalRef.current!.open();
	}, []);

	// prettier-ignore
	return (
		<ModalLayout ref={modalRef} onClose={props.navigation.goBack}>
		
				<View >
        <ModalHeaderText text={headerText}/>
					{message && <ModalText text={message}/>}
					{inputPlaceholder && (
						<S.Input
							onChange={setInput}
							value={input}
							placeholder={inputPlaceholder}
							name='modal-input'
							textColor='black'
						/>
					)}
				</View>

				<S.ActionButton
					upperCase
					borderRadius='100px'
					disabled={inputPlaceholder && !input}
					gradientBackground={!(inputPlaceholder && !input) ? 'orange' : 'gray2'}
					text={actionButtonText ? actionButtonText : t('modal.actionButtonText')}
					onPress={handleActionButtonPress}
				/>
		
		</ModalLayout>
	);
};

const S: any = {};

S.HeaderText = styled(Typography.HeaderText)`
	font-size: ${calcFontSize(18)};
	align-self: center;
	width: 100%;
`;

S.Input = styled(TextInput)`
	max-width: 80%;
	align-self: center;
	margin-top: ${verticalScale(25)};
	padding-left: ${scale1(15)};
`;

S.Text = styled(Typography.Text)`
	font-size: ${calcFontSize(15)};
`;

S.ActionButton = styled(Button)`
	/* width: 80%; */
	margin-top: ${verticalScale(20)};
`;

export default Modal;
