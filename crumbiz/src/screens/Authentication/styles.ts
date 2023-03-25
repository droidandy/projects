import styled from 'styled-components/native';
import { DefaultTheme } from 'styled-components';
import { calcFontSize, calcHeight, calcWidth, deviceWidth, deviceHeight } from '../../utils/dimensions';
import { Form as _Form } from '../../components/Shared';
import { TextInput } from '../../components/Shared/Form@2.0';

interface IProps {
	theme: DefaultTheme;
}

export const LoginFieldsWrapper = styled.View`
	display: flex;
	flex-direction: column;
	height: ${calcHeight(134)};
	justify-content: space-between;
`;

export const LoginButtonWrapper = styled.View`
	margin-top: ${calcHeight(38)};
	margin-bottom: ${calcHeight(38)};
`;

export const WidthLimiter = styled.View`
	flex-direction: column;
	justify-content: center;
`;
export const HeaderText = styled.View`
	padding-left: ${deviceWidth * 0.0972};
	width: ${deviceWidth * 0.8611};
`;

export const ScrollWrapper = styled.ScrollView``;

export const Wrapper = styled.View`
	flex: 1;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	background-color: ${(props: IProps) => props.theme.colors.white};
	padding-horizontal: ${deviceWidth * 0.0972};
`;

export const OrLineContainer = styled.View`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	height: ${deviceHeight * 0.09};
`;

export const OrLine = styled.View`
	width: ${calcWidth(125)};
	height: ${calcHeight(1)};
	background-color: ${(props: IProps) => props.theme.colors.gray16};
`;

export const OrText = styled.Text`
	font-size: ${calcFontSize(14)};
	color: ${(props: IProps) => props.theme.colors.gray16};
	font-weight: 500;
	flex: 1;
	text-align: center;
`;

export const ForgotPasswordLinkContainer = styled.View`
	align-self: flex-end;
`;

export const SignUpContainer = styled.View`
	align-items: center;
	justify-content: center;
`;

export const Input = styled(TextInput)`
	align-self: flex-start;
	flex-shrink: 0;
	background-color: ${(props: IProps) => props.theme.colors.white};
	border-top-width: 0;
	border-left-width: 0;
	border-right-width: 0;
	border-bottom-color: ${(props: IProps) => props.theme.colors.gray16};
	padding-left: 0;
`;

export const SignUpText = styled.Text`
	color: ${(props: IProps) => props.theme.colors.gray1};
	font-size: ${({ theme }) => theme.fontSizes.s13};
`;

export const Form = styled(_Form)`
	flex: 0 1 auto;
`;
