import React, { useState } from 'react';
import styled from 'styled-components/native';
// @ts-ignore
import ToggleSwitch from 'toggle-switch-react-native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import defaultTheme from '../../themes/defaultTheme';
import { PlainFunction } from '../../types/interfaces';

interface IProps {
	isOn?: boolean;
	onColor?: string;
	offColor?: string;
	size?: string;
	onToggle: PlainFunction;
}

const SwitchOnAndOff: React.FC<IProps> = props => {
	const { isOn, onColor, offColor, size, onToggle } = props;
	
	return (
		<S.Container>
			<ToggleSwitch
				onColor={onColor}
				offColor={offColor}
				size={size}
				isOn={isOn}
				onToggle={() => onToggle(!isOn)}
			/>
		</S.Container>
	);
};

SwitchOnAndOff.defaultProps = {
	isOn: false,
	onColor: defaultTheme.colors.darkerBlue1,
	offColor: defaultTheme.colors.gray16,
	size: 'medium'
};

const S: any = {};
S.Container = styled.View`
	transform: scale(${deviceHeight / 640}) translateX(${deviceWidth * 0.1}px);
	width: ${deviceWidth * 0.2};
`;

export default SwitchOnAndOff;
