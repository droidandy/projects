import React from 'react';
import styled from 'styled-components/native';
import ModalButtonsContainer from './ModalButtonsContainer';
import { useTheme } from '../../../hooks';
import { PlainFunction } from '../../../types/interfaces';
import { Button } from '../index';
import { deviceWidth } from '../../../utils/dimensions';

interface IButton {
	text: string;
	callback: PlainFunction;
	color?: string;
	disabled?: boolean;
}

interface IProps {
	leftButton: IButton;
	rightButton: IButton;
}

const ModalLeftRightButtons: React.FC<IProps> = props => {
	const theme = useTheme();
	const { leftButton, rightButton } = props;

	return (
		<ModalButtonsContainer>
			<S.Button
				text={leftButton.text}
				gradientBackground={leftButton.color ? null : 'gray'}
				backgroundColor={leftButton.color}
				disabled={leftButton.disabled}
				onPress={leftButton.callback}
				rounded
				applyRatio
				textColor={theme.colors.gray15}
			/>

			<S.Button
				text={rightButton.text}
				gradientBackground={rightButton.color ? null : 'orange'}
				backgroundColor={rightButton.color}
				onPress={rightButton.callback}
				disabled={rightButton.disabled}
				rounded
				applyRatio
			/>
		</ModalButtonsContainer>
	);
};

const S: any = {};
S.Button = styled(Button)`
	width: ${deviceWidth * 0.33};
	aspect-ratio: 2;
`;

export default ModalLeftRightButtons;
