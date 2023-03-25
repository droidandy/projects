import styled from 'styled-components/native';
import { DefaultTheme, StyledComponent } from 'styled-components';
import * as React from 'react';
import { ITheme } from '../../types/interfaces';
import { calcFontSize } from '../../utils/dimensions';

import { Dimensions } from 'react-native';

const { width, fontScale } = Dimensions.get('window');

interface ITextProps {
	theme: DefaultTheme;
	grayedOut?: boolean;
}

interface IGenericText {
	fontSize: number;
	fontWeight: 'normal' | 'bold';
}

interface ITypography {
	HeaderText: React.ComponentType;
	Text: React.ComponentType<{ grayedOut?: boolean }>;
	H1: React.ComponentType;
	H2: React.ComponentType;
	H4: React.ComponentType;
	H5: React.ComponentType;
	H6: React.ComponentType;
	H7: React.ComponentType;
	GenericText: ({ fontSize, fontWeight }: IGenericText) => React.ComponentType;
}

const S: any = {};
S.HeaderText = styled.Text.attrs({
	adjustFontSizeToFit: true
})`
	font-weight: bold;
	font-size: ${calcFontSize(18)};
	margin-top: 55px;
	text-align: center;
	width: 100%;
`;

S.Text = styled.Text.attrs({ adjustFontSizeToFit: true })(
	({ grayedOut, theme }: ITextProps) => `
	font-size: ${calcFontSize(15)};
	line-height: 23px;
	text-align: center;
	margin-top: 9px;
	padding-horizontal: 10px;
	color: ${grayedOut && theme.colors.gray1}
`
);

S.H1 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(52)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.H2 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(44)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.H4 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(28)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.H5 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(22)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.H6 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(18)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.H7 = styled.Text.attrs({ adjustFontSizeToFit: true })`
	font-size: ${calcFontSize(16)};
	font-weight: bold;
	width: 100%;
	text-align: center;
`;

S.GenericText = ({
	fontSize,
	fontWeight
}: IGenericText & ITheme): React.ComponentType => {
	return styled.Text.attrs({ adjustFontSizeToFit: true })`
		font-size: ${calcFontSize(fontSize)};
		font-weight: ${fontWeight};
		text-align: center;
		width: 100%;
	`;
};

export default S as ITypography;
