import React from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import styled from 'styled-components/native';
import { removeHTMLTags } from '../../../../utils';
import { CustomText } from '../../../Shared';
import { IBodyStyles } from './BaseBody';

interface IProps {
	interaction: IVInteraction;
	styles?: IBodyStyles;
}

const SendInviteBody: React.FC<IProps> = props => {
	const { interaction, styles = {} } = props;

	return (
		<S.Container backgroundColor={styles.backgroundColor}>
			<S.SubjectWrapper>
				<CustomText
					text={
						interaction.subject
							? removeHTMLTags(interaction.subject)
							: interaction.body || ''
					}
					color={styles.color}
					size='s14'
					bold={styles.fontWeight === 'bold'}
				/>
			</S.SubjectWrapper>
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	width: 100%;
	flex: 1;

	${({ backgroundColor }: { backgroundColor: string }) => `
		background-color: ${backgroundColor};
	`}
`;

S.SubjectWrapper = styled.View`
	margin-bottom: 5;
`;

export default SendInviteBody;
