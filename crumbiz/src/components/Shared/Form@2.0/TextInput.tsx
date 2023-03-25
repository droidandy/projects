import React, { useState } from 'react';
import styled, { css } from 'styled-components/native';
import { IStyle, ITheme } from '../../../types/interfaces';
import {
	calcFontSize,
	calcHeight,
	calcWidth,
	deviceHeight,
	deviceWidth
} from '../../../utils/dimensions';
import Icons from '../Icons';
import { useTheme } from '../../../hooks';
import { TouchableOpacity } from 'react-native';
import PasswordStrength from '../PasswordStrength';
import { IColors } from '../../../types/styled';
import { defaultTheme } from '../../../themes';

interface IProps extends IStyle {
	editable?: boolean;
	name: string;
	placeholder: string;
	type?: 'password' | 'text';
	displayPasswordStrengthMeter?: boolean;
	displayEmailValidMeter?: boolean;
	onChange: (inputValue: string) => any;
	value: string;
	textColor?: string | keyof IColors;
	textSize?: number;
	inputBoxWidth?: number;
	maxLength?: number;
	marginBottom?: number;
}

const TextInput: React.FC<IProps> = props => {
	const {
		name,
		placeholder,
		type,
		displayPasswordStrengthMeter,
		displayEmailValidMeter,
		value,
		onChange,
		textColor,
		textSize,
		style,
		inputBoxWidth,
		maxLength,
		marginBottom,
		editable
	} = props;

	const theme = useTheme();
	const [isValueHidden, setValueHidden] = useState<boolean>(
		type === 'password'
	);
	const secureEntryIconIndicatorColor = value.length
		? theme.colors.darkGray
		: theme.colors.gray8;

	return (
		<S.Container
			style={style}
			inputBoxWidth={inputBoxWidth}
			marginBottom={marginBottom}
		>
			<S.Input
				editable={editable}
				value={value}
				textColor={textColor}
				textSize={textSize}
				maxLength={maxLength}
				placeholder={placeholder}
				secureTextEntry={isValueHidden}
				displayStrengthMeter={displayPasswordStrengthMeter}
				displayEmailValidMeter={displayEmailValidMeter}
				onChange={(e: any) => onChange(e.nativeEvent.text)}
				placeholderTextColor='gray'
			/>

			{type === 'password' && (
				<TouchableOpacity onPress={() => setValueHidden(!isValueHidden)}>
					{isValueHidden ? (
						<Icons.HiddenPasswordIcon fill={secureEntryIconIndicatorColor} />
					) : (
						<Icons.PasswordVisibleIcon fill={secureEntryIconIndicatorColor} />
					)}
				</TouchableOpacity>
			)}

			{displayPasswordStrengthMeter && Boolean(value.length) && (
				<PasswordStrength inputValue={value} />
			)}

			{displayEmailValidMeter && (
				<Icons.CheckWithoutCircleIcon
					fill={theme.colors.green1}
					width={deviceWidth * 0.038527}
					height={deviceHeight * 0.01626}
				/>
			)}
		</S.Container>
	);
};

TextInput.defaultProps = {
	type: 'text',
	textColor: defaultTheme.colors.gray1,
	textSize: 14,
	inputBoxWidth: calcWidth(310)
};

const S: any = {};
S.Container = styled.View(
	({ inputBoxWidth, theme }: Partial<IProps> & ITheme) => `
	height: ${calcHeight(35)};
	width: ${inputBoxWidth};
	max-width: 100%;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	background-color: white;
	border-width: ${calcWidth(1)};
	border-color: ${theme.colors.gray2};
`
);

S.Input = styled.TextInput(
	(props: Partial<IProps> & ITheme) => `
	 font-size: ${calcFontSize(props.textSize!)};
	 color: ${props.textColor};
	 flex: 1;
	 padding:0;
	${props.displayPasswordStrengthMeter &&
		css`
			padding-right: 80;
		`};
	${props.displayEmailValidMeter && css``}
`
);

S.HidePasswordIcon = styled.TouchableOpacity`
	height: ${calcHeight(30)};
	width: ${calcWidth(30)};
	position: absolute;
	right: 5px;
`;

export default TextInput;
