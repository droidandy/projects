import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { PlainFunction } from '../../types/interfaces';
import { IColors } from '../../types/styled';
import { Icons } from './';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import useTheme from '../../hooks/useTheme';

export interface CheckBoxProps {
	checked: boolean;
	onChange: PlainFunction;
	checkedBackgroundColor?: keyof IColors;
	name?: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({
	checked,
	onChange,
	checkedBackgroundColor,
	name
}) => {
	const theme = useTheme();
	return (
		<S.CheckBox checked={checked} onPress={onChange}>
			{checked && (
				<Icons.VIcon
					fill={theme.colors.white}
					height={0.0375 * deviceHeight}
					width={0.035 * deviceWidth}
				/>
			)}
		</S.CheckBox>
	);
};

export default CheckBox;

const S: any = {};

S.CheckBox = styled(TouchableOpacity)<{ checked: boolean }>`
	width: ${deviceHeight * 0.0375};
	height: ${deviceHeight * 0.0375};
	background-color: ${({ theme, checked }) =>
		checked ? theme.colors.darkerBlue1 : theme.colors.gray16};
	justify-content: center;
	align-items: center;
	border-radius: 5;
`;
