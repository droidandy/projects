import React from 'react';
import styled from 'styled-components/native';
import { deviceHeight } from '../../../../utils/dimensions';
import { IChildren, IStyle } from '../../../../types/interfaces';

interface IProps extends IChildren, IStyle {}
const SectionHeader: React.FC<IProps> = props => {
	const { style, children } = props;
	return <S.Container style={style}>{children}</S.Container>;
};

const S: any = {};
S.Container = styled.View`
	flex-direction: row;
	justify-content: space-between;
	margin-top: ${deviceHeight * 0.065};
	margin-bottom: ${deviceHeight * 0.03};
	align-items: center;
`;

export default SectionHeader;
