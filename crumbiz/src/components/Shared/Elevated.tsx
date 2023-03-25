import React from 'react';
import styled, { css } from 'styled-components/native';
import { createShadow } from '../../utils';
import { IStyle, PlainFunction } from '../../types/interfaces';

interface IProps extends IStyle {
	children: React.ReactNode;
	touchable?: boolean;
	onPress?: PlainFunction;
}
const Elevated: React.FC<IProps> = props => {
	const { children, touchable, onPress, style } = props;
	return touchable ? (
		<S.TouchableContainer style={style} onPress={onPress}>
			{children}
		</S.TouchableContainer>
	) : (
		<S.Container style={style}>{children}</S.Container>
	);
};

const S: any = {};
const sharedContainerStyles = css`
	background-color: white;
	${createShadow({ elevation: 0.3 })};
`;

S.Container = styled.View`
	${sharedContainerStyles}
`;

S.TouchableContainer = styled.TouchableOpacity`
	${sharedContainerStyles}
`;

export default Elevated;
