import React from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../index';
import { deviceHeight } from '../../../utils/dimensions';

interface IProps {
	text: string;
}

const ModalText: React.FC<IProps> = props => {
	const { text } = props;
	return (
		<S.Container>
			<CustomText center text={text} size='s13' color='gray15' />
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	margin-top: ${deviceHeight * 0.015};
	text-align: center;
`;

export default ModalText;
