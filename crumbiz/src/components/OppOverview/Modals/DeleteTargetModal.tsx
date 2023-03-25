import React from 'react';
import { useTranslation } from 'react-i18next';
import { IModalProps } from '../../Shared/Modal';
import {
	IModalAndSlidingDropdownControls,
	PlainFunction,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import { Modal } from '../../Shared';
import {
	ModalHeaderText,
	ModalLeftRightButtons,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import { useTheme } from '../../../hooks';

interface IProps extends IModalProps {
	targetUsername: string;
	handleDelete: PlainFunction;
}

const DeleteTargetModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const theme = useTheme();
	const { t } = useTranslation();
	const { targetUsername, handleDelete } = props;

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('oppOverview.modals.deleteTarget.headerText', {
					username: targetUsername
				})}
			/>
			<ModalText
				text={t('oppOverview.modals.deleteTarget.text', {
					username: targetUsername
				})}
			/>

			<ModalLeftRightButtons
				leftButton={{
					text: t('oppOverview.modals.deleteTarget.cancel'),
					callback: () => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
				rightButton={{
					color: theme.colors.red1,
					text: t('oppOverview.modals.deleteTarget.delete'),
					callback: () => {
						handleDelete();
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
			/>
		</Modal>
	);
});

export default DeleteTargetModal;
