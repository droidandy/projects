import React from 'react';
import styled from 'styled-components/native';
import { MagnetLoader } from './';

interface IProps {
	visible: boolean;
	absolute?: boolean;
}

const CoveringLoadingModal: React.FC<IProps> = ({ visible, absolute }) => {
	if (visible) {
		return (
			<S.Container absolute={absolute}>
				<MagnetLoader />
			</S.Container>
		);
	}
	return null;
};

CoveringLoadingModal.defaultProps = {
	absolute: true
};

const S: any = {};

S.Container = styled.View`
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.white};

	${({ absolute }: Partial<IProps>) =>
		absolute &&
		`
		position: absolute;
		z-index: 10000;
	`};
`;

export default CoveringLoadingModal;
