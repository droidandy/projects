import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { sendIntroSelector } from '../../../store/selectors/sendIntroSelectors';
import { Attachment, AudioPlayer, CustomText } from '../../Shared';
import { AttachmentTypesEnum, StackItemTypeEnum } from '../../../types/enums';
import { TouchableOpacity } from 'react-native';
import OppSummary from '../../Shared/OpSummary/OpSummary';
import { useAudioPlayer } from '../../../hooks';
import Stack, { StackItem } from '../../Shared/Stack';
import removeHTMLTags from '../../../utils/removeHTMLTags';
import styled from 'styled-components/native';
import { deviceWidth } from '../../../utils/dimensions';

interface IProps {
	onActiveCard: (index: number | null) => void;
	magnetExpanded: boolean;
}

const SummaryCards: React.FC<IProps> = props => {
	const { onActiveCard, magnetExpanded } = props;
	const {
		attachments,
		introMessage,
		recordingFilePath,
		oppSummary
	} = useSelector(sendIntroSelector);

	const [numStackItems, setNumStackItems] = useState(0);

	useEffect(() => {
		let size = 0;
		if (Object.keys(attachments).length) size += 1;
		if (introMessage.body) size += 1;
		else if (recordingFilePath) size += 1;
		if (oppSummary) size += 1;
		setNumStackItems(size);
	}, []);

	return (
		<View>
			<Stack>
				{({ currentIndex, setCurrentIndex }) =>
					Object.values(StackItemTypeEnum).map((stackItemName, index) => {
						let childrenToRender = null;

						switch (stackItemName) {
							case StackItemTypeEnum.ATTACHMENTS:
								if (Object.keys(attachments).length) {
									childrenToRender = Object.entries(
										attachments
									).map(([key, value]) => (
										<Attachment
											key={key}
											type={key as AttachmentTypesEnum}
											text={key}
										/>
									));
								}
								break;

							case StackItemTypeEnum.INTRO_MESSAGE:
								if (introMessage.body) {
									const introMessageText = removeHTMLTags(introMessage.body);
									childrenToRender = (
										<S.Text text={introMessageText} size='s13' color='gray15' />
									);
								} else if (recordingFilePath) {
									childrenToRender = (
										<>
											<AudioPlayer filePath={recordingFilePath} />
										</>
									);
								}
								break;

							case StackItemTypeEnum.OPP_DETAILS:
								if (oppSummary) {
									childrenToRender = (
										<OppSummary data={oppSummary} fromIntroSummary />
									);
								}
								break;
						}

						if (childrenToRender) {
							return (
								<StackItem
									key={stackItemName}
									title={stackItemName}
									onPress={() => {
										setCurrentIndex(currentIndex === index ? null : index);
										onActiveCard(currentIndex === index ? null : index);
									}}
									showChildren={currentIndex === index && !magnetExpanded}
									showLine={!(numStackItems - index === 1)}
								>
									{childrenToRender}
								</StackItem>
							);
						}
					})
				}
			</Stack>
		</View>
	);
};

const S: any = {};
S.Text = styled(CustomText)`
	padding-left: ${deviceWidth * 0.114};
`;

export default SummaryCards;
