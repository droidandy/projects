import React from 'react';
import styled from 'styled-components/native';
import { Text } from 'react-native';

interface IProps {}
const LinkedInTab: React.FC<IProps> = props => {
	return (
		<S.Container>
			<Text>Welcome to LinkedInTab</Text>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
`;

export default LinkedInTab;
