import React from 'react';
import styled from 'styled-components/native';
import { format } from 'date-fns';
import { IVInteraction } from '../../../../types/interfaces';
import { CustomText } from '../../../Shared';

interface IProps {
	interaction: IVInteraction;
	children?: React.ReactNode;
	styles?: any
}

const BaseHeader: React.FC<IProps> = (props) => {
	const { interaction, styles, children } = props;

	return (
		<S.Container>
			<CustomText
				text={format(new Date(interaction.timestamp), 'p')}
				color={styles.dateColor || 'darkerBlue1'}
				size='s11'
			/>
			{children}
		</S.Container>
	)
}

const S: any = {};

S.Container = styled.View`
	flex: 1;
	flex-direction: row-reverse;
	justify-content: space-between;
`;


export default BaseHeader