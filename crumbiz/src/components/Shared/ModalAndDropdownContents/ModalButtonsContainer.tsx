import React from 'react';
import styled from 'styled-components/native';
import { IChildren } from '../../../types/interfaces';
import { deviceHeight } from '../../../utils/dimensions';

interface IProps extends IChildren {}
const ModalButtonsContainer: React.FC<IProps> = props => {
	return <S.Container>{props.children}</S.Container>;
};

const S: any = {};
S.Container = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${deviceHeight * 0.046875};
	width: 100%;
`;

export default ModalButtonsContainer;
