import React from 'react';
import styled from 'styled-components/native';
import { CustomText } from '../../../Shared';
import { IBodyStyles } from './BaseBody';
import { IVInteraction } from '../../../../types/interfaces';

interface IProps {
	styles?: IBodyStyles;
	interaction: IVInteraction;
};

const NewOppBody: React.FC<IProps> = (props) => {
	const { interaction,  styles = {} } = props;

	const title = interaction.subject || 'You created a new opportunity';
	return (
		<S.Container backgroundColor={styles.backgroundColor}>
			<CustomText
				text={title}
				color={styles.color}
				size="s14"
				bold
			/>
		</S.Container>
	)
}

const S: any = {};
S.Container = styled.View`
	width: 100%;
	flex: 1;
	
	${({ backgroundColor }: { backgroundColor: string }) => `
		background-color: ${backgroundColor};
	`}
`;

export default NewOppBody;
