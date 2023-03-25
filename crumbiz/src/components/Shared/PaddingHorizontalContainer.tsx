import React from 'react';
import styled from 'styled-components/native';
import { deviceWidth } from '../../utils/dimensions';
import { IChildren, IStyle } from '../../types/interfaces';

interface IProps extends IChildren, IStyle {}
const PaddingHorizontalContainer: React.FC<IProps> = props => {
	return <S.Container style={props.style}>{props.children}</S.Container>;
};

const S: any = {};
S.Container = styled.View`
	align-self: center;
	padding-horizontal: ${deviceWidth * 0.06666666666};
`;

export default PaddingHorizontalContainer;
