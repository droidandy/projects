import React, { useEffect } from 'react';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import {
	ModalHeaderText,
	ModalText,
	ModalButtonsContainer
} from '../../Shared/ModalAndDropdownContents';
import { Modal, Button } from '../../Shared';

import { useTranslation } from 'react-i18next';

const EntityExistsModal = React.forwardRef<IModalAndSlidingDropdownControls>(
	(props, ref) => {
		const { t } = useTranslation();
		return (
			<Modal ref={ref}>
				<ModalHeaderText
					text={t('connectEntities.modals.contactWays.userExistsHeader')}
				/>
				<ModalText
					text={t('connectEntities.modals.contactWays.userExistsText')}
				/>
				<ModalButtonsContainer>
					<Button
						rounded
						onPress={() => {
							(ref as ModalAndSlidingDropdownRef).current!.close();
						}}
						gradientBackground='orange'
						text={t('connectEntities.modals.contactWays.userExistsButton')}
					/>
				</ModalButtonsContainer>
			</Modal>
		);
	}
);

export default EntityExistsModal;
