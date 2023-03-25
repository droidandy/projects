import React from 'react';
import { useTranslation } from 'react-i18next';
import { IModalProps } from '../../Shared/Modal';
import { Button, Modal } from '../../Shared';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import {
	ModalButtonsContainer,
	ModalHeaderText,
	ModalText
} from '../../Shared/ModalAndDropdownContents';

interface IProps extends IModalProps {}
const NowYouCanAddTargetsModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('oppOverview.modals.nowYouCanAddTargets.headerText')}
			/>

			<ModalText text={t('oppOverview.modals.nowYouCanAddTargets.text')} />

			<ModalButtonsContainer>
				<Button
					rounded
					onPress={() => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}}
					gradientBackground='orange'
					text={t('oppOverview.modals.nowYouCanAddTargets.ok')}
				/>
			</ModalButtonsContainer>
		</Modal>
	);
});

export default NowYouCanAddTargetsModal;
