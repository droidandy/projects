import React from 'react';
import styled, { css } from 'styled-components/native';
import { ITheme } from '../../types/interfaces';
import { extractInitials } from '../../utils';
import {
	calcFontSize,
	deviceWidth,
	deviceHeight
} from '../../utils/dimensions';
import { defaultTheme } from '../../themes';
import CustomText from './CustomText';
import { IColors, IFontSizes } from '../../types/styled';

interface IProps {
	/*
	 * #initials will take the first letter the first two words
	 * */
	selected?: boolean;
	icon?: React.StatelessComponent | 'initials';
	text: string;
	onPress?: () => any;
	backgroundColor?: string;
	textSize?: keyof IFontSizes;
	bold?: boolean;
}
const ListItem: React.FC<IProps> = props => {
	const {
		text,
		icon,
		onPress,
		selected,
		backgroundColor,
		textSize,
		bold
	} = props;

	return (
		<S.Container
			backgroundColor={backgroundColor}
			selected={selected}
			icon={icon}
			onPress={onPress}
		>
			{icon && (
				<S.IconContainer>
					<S.IconText>{extractInitials(text)}</S.IconText>
				</S.IconContainer>
			)}

			<S.Text>
				<CustomText text={text} size={textSize} bold={bold} />
			</S.Text>
		</S.Container>
	);
};

ListItem.defaultProps = {
	backgroundColor: defaultTheme.colors.gray12
};

ListItem.defaultProps = {
	textSize: 's15'
};

const S: any = {};
S.Container = styled.TouchableOpacity(
	({ theme, icon, selected, backgroundColor }: IProps & ITheme) => `
	border-bottom-color: ${theme.colors.gray2};
	background-color: ${selected ? theme.colors.gray7 : backgroundColor};
	border-bottom-width: 1px;
	width: 100%;
	flex-direction: row;
	align-items: center;
	padding-top: ${deviceHeight * 0.025};
	padding-left: ${deviceWidth * 0.0544117647};
	
	${icon &&
		css`
			padding-left: 32px;
		`}
`
);

S.Text = styled.Text`
	padding-top: 21.33px;
	padding-bottom: 28px;
	color: black;
`;

S.IconContainer = styled.View`
	background: #a1a1a1;
	width: 34px;
	height: 34px;
	border-radius: 17px;
	justify-content: center;
	align-items: center;
	margin-right: ${deviceWidth * 0.0544117647};
	margin-top: -6px;
`;

S.IconText = styled.Text`
	color: white;
`;

export default ListItem;
