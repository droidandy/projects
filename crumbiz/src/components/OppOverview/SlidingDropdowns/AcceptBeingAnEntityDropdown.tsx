import React from 'react';
import { useTranslation } from 'react-i18next';
import {
	IModalAndSlidingDropdownControls,
	DelegatedRef,
	PlainFunction
} from '../../../types/interfaces';
import { CustomText, SlidingDropdown } from '../../Shared';
import { EntityEnum } from '../../../types/enums';
import { ModalLeftRightButtons } from '../../Shared/ModalAndDropdownContents';
import { entityNameMapper } from '../../Shared/ModalAndDropdownContents/Mappers';

interface IProps {
	asEntity: EntityEnum;
	areYouSureRef: DelegatedRef<IModalAndSlidingDropdownControls>;
	handleDecision: PlainFunction;
	buttonsDisabled: boolean;
}

const AcceptBeingAnEntityDropdown = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { asEntity, areYouSureRef, handleDecision, buttonsDisabled } = props;
	const { t } = useTranslation();

	return (
		<SlidingDropdown location='bottom' ref={ref} withoutOverlay>
			<CustomText
				text={t('oppOverview.dropdowns.acceptBeingAnEntity.text', {
					entityName: entityNameMapper[asEntity]
				})}
				size='s14'
				center
			/>

			<ModalLeftRightButtons
				leftButton={{
					disabled: buttonsDisabled,
					text: t('oppOverview.dropdowns.acceptBeingAnEntity.no'),
					callback: () => {
						areYouSureRef.current?.open();
					}
				}}
				rightButton={{
					disabled: buttonsDisabled,
					text: t('oppOverview.dropdowns.acceptBeingAnEntity.yes'),
					callback: () => {
						handleDecision(true);
					}
				}}
			/>
		</SlidingDropdown>
	);
});

export default AcceptBeingAnEntityDropdown;
