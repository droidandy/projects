import React from 'react';
import { useTranslation } from 'react-i18next';
import { IModalProps } from '../../Shared/Modal';
import { Modal, Button } from '../../Shared';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import {
	ModalHeaderText,
	ModalText,
	ModalButtonsContainer
} from '../../Shared/ModalAndDropdownContents';

interface IProps extends IModalProps {}

const NowWereTalkingModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText text={t('opps.done.nowWereTalking')} />
			<ModalText text={t('opps.done.text')} />
			{/* TODO All - replace lurem ipsum with the micro copy text */}
			<ModalButtonsContainer>
				<Button
					rounded
					onPress={() => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}}
					gradientBackground='orange'
					text={t('opps.done.buttonText')}
				/>
			</ModalButtonsContainer>
		</Modal>
	);
});

export default NowWereTalkingModal;
