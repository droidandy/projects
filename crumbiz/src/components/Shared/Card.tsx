import React, { SetStateAction } from 'react';
import styled from 'styled-components/native';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { IStyle, ITheme } from '../../types/interfaces';
import CustomText from './CustomText';
import { IColors } from '../../types/styled';

interface IProps extends IStyle {
	text: string;
	intro?: string;
	icon?: React.StatelessComponent;
	description?: string;
	selected?: boolean;
	onPress?: () => any;
}
const Card: React.FC<IProps> = props => {
	const { icon: Icon, style, selected } = props;

	return props.icon ? (
		<S.WithIconContainer selected={selected} onPress={props.onPress}>
			<S.TextContainer>
				<S.IntroText text={props.intro} color='gray15' size='s13' />
				<S.TitleText text={props.text} size='s15' bold/>
			</S.TextContainer>
			<S.IconContainer>
				{/*
        // @ts-ignore */}
				<Icon width={deviceWidth * 0.5} height={deviceHeight * 0.18}/>
			</S.IconContainer>
		</S.WithIconContainer>
	) : (
		<S.WithoutIconContainer
			selected={selected}
			onPress={props.onPress}
			style={style}
		>
			<CustomText text={props.text} size='s14' center />
		</S.WithoutIconContainer>
	);
};

const S: any = {};
S.WithoutIconContainer = styled.TouchableOpacity(
	({ theme, selected }: IProps & ITheme) => `
	border-radius: 25;
	background: ${selected ? theme.colors.gray18 : theme.colors.gray12};
	justify-content: center;
	align-items: center;
`);

S.WithIconContainer = styled.TouchableOpacity(
	({ theme, selected }: IProps & ITheme) => `
	flex-direction: row;
	background: ${selected ? theme.colors.gray18 : theme.colors.gray12};
	width: ${deviceWidth * 0.8611}
	height: ${deviceHeight * 0.234375}
	border-radius: 25px;
	margin-bottom: 20;
`);

S.IconContainer = styled.View`
	align-items: center;
	padding-vertical: ${deviceHeight * 0.0546875};
	padding-right: ${deviceWidth * 0.026};
`;

S.TextContainer = styled.View`
	flex: 1;
	marginTop: ${deviceHeight * 0.0468};
	marginLeft: ${deviceWidth * 0.0694};
`;

S.IntroText = styled(CustomText)`
	text-align: left;
`;

S.TitleText = styled(CustomText)`
	text-align: left;
`;

export default Card;
