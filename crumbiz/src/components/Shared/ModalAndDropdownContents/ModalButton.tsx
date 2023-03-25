import React from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { Text } from 'react-native';

// TODO - Delete

interface IProps {}
const ModalButton: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const dispatch = useDispatch();

	return (
		<S.Container>
			<Text>Welcome to ModalButton</Text>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	flex: 1;
	background-color: ${({ theme }) => theme.colors.mainBackgroundColor};
`;

export default ModalButton;