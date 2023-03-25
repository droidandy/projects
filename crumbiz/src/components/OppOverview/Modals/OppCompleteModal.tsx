import React from 'react';
import { Button, CustomText, Modal } from '../../Shared';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import { IModalProps } from '../../Shared/Modal';
import { deviceHeight, deviceWidth } from '../../../utils/dimensions';
import {
	ModalHeaderText,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import {
	DelegatedRef,
	IModalAndSlidingDropdownControls
} from '../../../types/interfaces';

interface IProps extends IModalProps {}

const OppCompleteModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText text={t('oppOverview.modals.oppComplete.headerText')} />

			<ModalText text={t('oppOverview.modals.oppComplete.text')} />

			<S.OppCompleteButton
				text={t('oppOverview.modals.oppComplete.setOppAsComplete')}
				rounded
				gradientBackground='orange'
				applyRatio
			/>

			<CustomText
				text={t('oppOverview.modals.oppComplete.leaveOppAsProgress')}
				color='gray15'
				size='s12'
				touchable
				onPress={() => {
					// Todo Sason - use the new interface
					(ref as DelegatedRef<
						IModalAndSlidingDropdownControls
					>).current!.close();
				}}
			/>
		</Modal>
	);
});

const S: any = {};
S.OppCompleteButton = styled(Button)`
	width: ${deviceWidth * 0.72};
	aspect-ratio: 4.3;
	margin-top: ${deviceHeight * 0.046875};
	margin-bottom: ${deviceHeight * 0.03125};
`;

export default OppCompleteModal;
