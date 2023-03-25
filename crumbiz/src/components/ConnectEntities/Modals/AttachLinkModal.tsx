import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import { Modal } from '../../Shared';
import { IModalProps } from '../../Shared/Modal';
import {
	ModalHeaderText,
	ModalLeftRightButtons
} from '../../Shared/ModalAndDropdownContents';
import { TextInput } from '../../Shared/Form@2.0';
import { deviceHeight } from '../../../utils/dimensions';

interface IProps extends IModalProps {
	onPressOk: (link: string, linkName: string) => void;
}

const AttachLinkModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { onPressOk } = props;
	const { t } = useTranslation();
	const [link, setLink] = useState('');
	const [linkName, setLinkName] = useState('');

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('connectEntities.modals.attachLink.headerText')}
			/>

			<S.InputsContainer>
				<S.Input
					onChange={setLink}
					value={link}
					placeholder={t('connectEntities.modals.attachLink.pastAnyLink')}
					name='link'
					withMarginBottom
				/>

				<S.Input
					onChange={setLinkName}
					value={linkName}
					placeholder={t('connectEntities.modals.attachLink.linkName')}
					name='linkName'
				/>
			</S.InputsContainer>

			<ModalLeftRightButtons
				leftButton={{
					text: t('global.cancel'),
					callback: () => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
				rightButton={{
					text: t('global.allSet'),
					callback: () => onPressOk(link, linkName)
				}}
			/>
		</Modal>
	);
});

const S: any = {};
S.InputsContainer = styled.View`
	margin-top: ${deviceHeight * 0.034375};
`;

S.Input = styled(TextInput)<{ withMarginBottom: boolean }>`
	padding: 0;
	border: none;
	${({ withMarginBottom, theme }) =>
		withMarginBottom &&
		`
			margin-bottom: ${deviceHeight * 0.046875};
	`};
	border-bottom-width: 1;
	border-bottom-color: ${({ theme }) => theme.colors.gray17};
	min-height: ${deviceHeight * 0.046875};
`;

export default AttachLinkModal;
