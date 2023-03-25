import React from 'react';
import styled from 'styled-components/native';
import Typography from './Typography';
import { deviceHeight, deviceWidth } from '../../utils/dimensions';
import { defaultTheme } from '../../themes';

interface IProps {
	text: string;
	backgroundColor?: string;
	textColor?: string;
	textSize?: number;
}

const SectionListHeader: React.FC<IProps> = props => {
	const { text, backgroundColor, textColor, textSize } = props;
	return (
		<S.SectionHeaderContainer backgroundColor={backgroundColor}>
			<S.SectionHeaderTitle backgroundColor={backgroundColor} textColor={textColor} textSize={textSize}>
				{text}
			</S.SectionHeaderTitle>
		</S.SectionHeaderContainer>
	);
};

SectionListHeader.defaultProps = {
	backgroundColor: defaultTheme.colors.gray10,
	textColor: defaultTheme.colors.gray1,
	textSize: defaultTheme.fontSizes.s14
}

const S: any = {};
S.SectionHeaderContainer = styled.View(({ backgroundColor }: IProps) => `
	background-color: ${backgroundColor};
	padding-left: ${deviceWidth * 0.0544117647};
	padding-vertical: ${deviceHeight * 0.01};
`);

S.SectionHeaderTitle = styled(Typography.Text)(({ backgroundColor, textColor, textSize }: IProps) => `
	text-align: left;
	font-size: ${textSize};
	margin-top: 0;
	color: ${textColor};
	background-color: ${backgroundColor};
`);

export default SectionListHeader;
