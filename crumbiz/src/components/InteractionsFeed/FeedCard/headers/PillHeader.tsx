import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import BaseHeader from './BaseHeader';
import { CustomText } from '../../../Shared';
import styled from 'styled-components/native';

interface IProps {
	interaction: IVInteraction;
	text: string;
}

const PillHeader: React.FC<IProps> = (props) => {
	const { text } = props;

	return (
		<BaseHeader {...props}>
			<S.Pill>
				<CustomText text={text} color="white" size="s11"/>
			</S.Pill>
		</BaseHeader>
	)
}

const S: any = {};

S.Container = styled.View`
	flex-direction: row;
	align-items: flex-end;
	margin-bottom: ${({ marginBottom }: { marginBottom: number }) => marginBottom || 20};
`;

S.Pill = styled.View`
	display: flex;
	justify-content: center;
	align-items: center;
	background-color: ${({ theme }) => theme.colors.red1};
	border-radius: 18px;
	padding-horizontal: 10;
	padding-top: 4;
	padding-bottom: 2;
`

export default PillHeader
