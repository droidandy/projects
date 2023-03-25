import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal, { IModalProps } from '../../Shared/Modal';

import { Button } from '../../Shared';
import {
	ModalButtonsContainer,
	ModalHeaderText,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';

interface IProps extends IModalProps {}
const NowYouCanInteractWithTheOwnerModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('oppOverview.modals.nowYouCanInteractWithTheOwner.headerText')}
			/>

			<ModalText
				text={t('oppOverview.modals.nowYouCanInteractWithTheOwner.text')}
			/>

			<ModalButtonsContainer>
				<Button
					gradientBackground='orange'
					text={t('oppOverview.modals.nowYouCanInteractWithTheOwner.ok')}
					onPress={() => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}}
					rounded
				/>
			</ModalButtonsContainer>
		</Modal>
	);
});

export default NowYouCanInteractWithTheOwnerModal;
