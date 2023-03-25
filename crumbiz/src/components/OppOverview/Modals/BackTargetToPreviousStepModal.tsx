import React from 'react';
import { useTranslation } from 'react-i18next';
import { IModalProps } from '../../Shared/Modal';
import { Modal } from '../../Shared';
import {
	ModalHeaderText,
	ModalLeftRightButtons,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef,
	PlainFunction
} from '../../../types/interfaces';
import { revertTargetStatus } from '../../../mappers';
import { IntroStatusEnum, TargetStatusesEnum } from '../../../types/enums';
import i18n from '../../../locale/i18n';

interface IProps extends IModalProps {
	handleGoBack: PlainFunction;
	targetStatus: TargetStatusesEnum;
}

const textMapper = {
	[TargetStatusesEnum.DONE_DEAL]: i18n.t('global.introStatus.doneDeal'),
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: i18n.t('global.introStatus.goodToGo'),
	[TargetStatusesEnum.INTRO]: i18n.t('global.introStatus.intro')
};

// TODO Sason - Wrap the export
const BackTargetToPreviousStepModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();
	const { targetStatus } = props;
	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('oppOverview.modals.backToPrevStep.headerText')}
			/>
			{/* // TODO Yaron - change from - to status names */}
			<ModalText text={t('oppOverview.modals.backToPrevStep.text')} />

			<ModalLeftRightButtons
				leftButton={{
					text: t('oppOverview.modals.backToPrevStep.cancel'),
					callback: () => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
				rightButton={{
					text: t('oppOverview.modals.backToPrevStep.yes'),
					callback: () => {
						props.handleGoBack();
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
			/>
		</Modal>
	);
});

export default BackTargetToPreviousStepModal;
