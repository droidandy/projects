import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import BaseHeader from './BaseHeader';
import styled from 'styled-components/native';

interface IProps {
	interaction: IVInteraction;
	children?: React.ReactNode;
	styles: any,
	idProperty: string;
	icon: React.FC<any>;
}

const IconHeader: React.FC<IProps> = (props) => {
	const { styles, icon: Icon } = props;
	const iconStyles = styles.icon || {}

	return (
		<BaseHeader {...props}>
			<S.IconWrapper>
				<Icon {...iconStyles} />
			</S.IconWrapper>
		</BaseHeader>
	)
}

IconHeader.defaultProps = {
	idProperty: 'toUserId'
};

const S: any = {};

S.Container = styled.View`
	flex-direction: row;
	align-items: flex-end;
	margin-bottom: ${({ marginBottom }: { marginBottom: number }) => marginBottom || 20};
`;

S.IconWrapper = styled.View`
`

export default IconHeader
