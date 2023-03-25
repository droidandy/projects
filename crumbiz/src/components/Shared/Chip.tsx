import React from 'react';
import styled, { DefaultTheme } from 'styled-components/native';
import CustomText from './CustomText';

interface IProps {
	selected?: boolean;
	text: string;
	onPress?: () => any;
	theme?: DefaultTheme;
}

const Chip: React.FC<IProps> = props => {
	return (
		<S.Container onPress={props.onPress} selected={props.selected}>
			<CustomText
				text={props.text}
				color={props.selected ? 'white' : 'gray6'}
				size='s13'
			/>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.TouchableOpacity(
	({ theme, selected }: IProps) => `
	align-self: flex-start;
	padding-vertical: 9px;
	padding-horizontal: 23px;
	margin-right: 9px;
	margin-bottom: 9px;
	border-radius: 30px;
	background-color: ${selected ? theme!.colors.paleBlue2 : theme!.colors.gray12}	
`);

S.Text = styled.Text(
	({ theme, selected }: IProps) => `
	color: ${selected ? 'white' : theme!.colors.gray6}
`
);

export default Chip;
