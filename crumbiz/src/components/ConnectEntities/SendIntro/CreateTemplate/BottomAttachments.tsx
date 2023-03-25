import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { sendIntroAttachmentsSelector } from '../../../../store/selectors/sendIntroSelectors';
import { Attachment } from '../../../Shared';
import { AttachmentTypesEnum } from '../../../../types/enums';
import { sendIntroRemoveAttachment } from '../../../../store/actions/sendIntroActions';
import { PlainFunction, IAttachmentsObj } from '../../../../types/interfaces';

interface IProps {
	onAttachmentAdded: PlainFunction;
}

const BottomAttachments: React.FC<IProps> = props => {
	const dispatch = useDispatch();
	const attachments: IAttachmentsObj = useSelector(
		sendIntroAttachmentsSelector
	);
	const attachmentsLength = useRef<number>(0);

	useEffect(() => {
		const updatedAttachmentsLength = Object.keys(attachments).length;
		if (updatedAttachmentsLength > attachmentsLength.current) {
			props.onAttachmentAdded();
		}

		attachmentsLength.current = updatedAttachmentsLength;
	}, [attachments]);

	return (
		<S.Container>
			{Object.entries(attachments).map(([key, value]) => {
				const { title, content } = value;
				return (
					<Attachment
						showRemoveButton
						key={key}
						type={key as AttachmentTypesEnum}
						text={title}
						onRemoveButtonPress={key => {
							dispatch(sendIntroRemoveAttachment(key));
						}}
					/>
				);
			})}
		</S.Container>
	);
};

const S: any = {};
S.Container = styled.View`
	padding-horizontal: 25;
`;

export default BottomAttachments;
