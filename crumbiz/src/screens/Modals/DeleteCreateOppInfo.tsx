import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Modal from '../../components/Shared/Modal';
import { useTheme } from '../../hooks';
import {
	ModalHeaderText,
	ModalText,
	ModalLeftRightButtons
} from '../../components/Shared/ModalAndDropdownContents';
import { IModalAndSlidingDropdownControls } from '../../types/interfaces';
import { IStackNavigation } from '../../types/interfaces';

const DeleteCreateOppInfo: React.FC<IStackNavigation> = ({ navigation }) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const deleteCreateOppInfoRef = useRef<IModalAndSlidingDropdownControls>(null);

	useEffect(() => {
		deleteCreateOppInfoRef.current!.open();
	}, []);

	return (
		<Modal ref={deleteCreateOppInfoRef} onClose={navigation.goBack}>
			<ModalHeaderText
				text={t('oppOverview.modals.deleteCreateOppInfo.headerText')}
			/>

			<ModalText text={t('oppOverview.modals.deleteCreateOppInfo.text')} />

			<ModalLeftRightButtons
				leftButton={{
					text: t('oppOverview.modals.deleteCreateOppInfo.pressCancel'),
					callback: () => {
						deleteCreateOppInfoRef.current!.close();
					}
				}}
				rightButton={{
					color: theme.colors.red1,
					text: t('oppOverview.modals.deleteCreateOppInfo.pressDelete'),
					callback: () => {
						deleteCreateOppInfoRef.current!.close();
						navigation.dismiss();
					}
				}}
			/>
		</Modal>
	);
};

export default DeleteCreateOppInfo;
