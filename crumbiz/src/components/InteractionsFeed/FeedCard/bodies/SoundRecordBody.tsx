import React, { useEffect, useState } from 'react';
import { IVInteraction } from '../../../../types/interfaces';
import styled from 'styled-components/native';
import { removeHTMLTags } from '../../../../utils';
import { CustomText, AudioPlayer } from '../../../Shared';
import { IColors } from '../../../../types/styled';
import { InteractionsEP } from '../../../../services/api/routes';
import { InteractionTypesEnum } from '../../../../types/enums';
import { ActivityIndicator } from 'react-native';

export interface IBodyStyles {
	backgroundColor?: string;
	backgroundImage?: any;
	fontWeight?: string;
	color?: keyof IColors;
}

interface IProps {
	interaction: IVInteraction;
	styles?: IBodyStyles;
}

const SoundRecordBody: React.FC<IProps> = props => {
	const { interaction, styles = {} } = props;
	const { connectorUserId } = interaction;
	const [base64Record, setBase64Record] = useState('');
	const [fetching, setFetching] = useState(false);

	const fetchRecord = async () => {
		setFetching(true);
		try {
			const response = await InteractionsEP.getIntroMessage({
				oppId: interaction.opportunityId,
				TemplateType: InteractionTypesEnum.VOICE_INTRODUCTION
			});
			const recordValue =
				response[0].interactionTemplates[0]?.interactionTemplateFields[0]
					?.fileTextValue;
			setBase64Record(recordValue);
			setFetching(false);
		} catch (ex) {}
	};

	useEffect(() => {
		fetchRecord();
	}, []);

	return (
		<S.Container backgroundColor={styles.backgroundColor}>
			<S.SubjectWrapper>
				<CustomText
					text={interaction.subject ? removeHTMLTags(interaction.subject) : ''}
					color={styles.color}
					size='s14'
					bold={styles.fontWeight === 'bold'}
				/>
			</S.SubjectWrapper>
			<CustomText
				text={interaction.body ? removeHTMLTags(interaction.body) : ''}
				color={styles.color}
				size='s14'
				bold={styles.fontWeight === 'bold'}
			/>
			<S.AudioWrapper>
				{base64Record && !fetching ? (
					<AudioPlayer base64={base64Record} />
				) : null}
			</S.AudioWrapper>
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

S.AudioWrapper = styled.View``;

export default SoundRecordBody;
