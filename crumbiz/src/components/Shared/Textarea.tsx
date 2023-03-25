import React from 'react';
import styled from 'styled-components/native';
import { calcWidth } from '../../utils/dimensions';
import { IStyle } from '../../types/interfaces';
import { getFontNameByPlatform } from './CustomText';

interface IProps extends IStyle {
	numberOfLines?: number;
	placeholder?: string;
	value?: string;
	onChange?: (text: string) => any;
	scrollEnabled?: boolean;
	defaultValue?: string;
}
const Textarea: React.FC<IProps> = React.forwardRef((props, ref) => {
	const {
		numberOfLines,
		placeholder,
		style,
		value,
		onChange,
		scrollEnabled,
		defaultValue
	} = props;

	return (
		<S.Input
			defaultValue={defaultValue ? defaultValue : null}
			placeholder={placeholder}
			numberOfLines={numberOfLines}
			textAlignVertical='top'
			multiline
			style={style}
			value={value}
			onChange={(e: any) =>
				typeof onChange === 'function' && onChange(e.nativeEvent.text)
			}
			ref={ref}
			scrollEnabled={scrollEnabled}
		/>
	);
});

Textarea.defaultProps = {
	numberOfLines: 10,
	scrollEnabled: true
};

const S: any = {};
S.Input = styled.TextInput`
	border-width: ${calcWidth(1)};
	border-color: ${props => props.theme.colors.gray2};
	background-color: white;
	font-family: ${getFontNameByPlatform(false, false)};
`;

export default Textarea;
