import React from 'react';
import { IModalProps } from '../../Shared/Modal';
import { Button, SlidingDropdown } from '../../Shared';
import { View } from 'react-native';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import {
	ModalButtonsContainer,
	ModalHeaderText,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import { useTranslation } from 'react-i18next';
import { EntityEnum, OpportunityStatusesEnum } from '../../../types/enums';
import styled from 'styled-components/native';
import { deviceWidth } from '../../../utils/dimensions';
import { useDispatch } from 'react-redux';
import { changeOppStatus } from '../../../store/actions/oppOverviewActions';

interface IProps extends IModalProps {
	asEntity: EntityEnum;
}
const OppOnHoldDropdown = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();
	const { asEntity } = props;

	const buttonTextMapper = {
		[EntityEnum.OWNER]: t('oppOverview.dropdowns.oppOnHold.bringItBackToLife'),
		[EntityEnum.CONNECTOR]: t('oppOverview.dropdowns.oppOnHold.ok'),
		[EntityEnum.TARGET]: ''
	};
	const dispatch = useDispatch();

	return (
		<SlidingDropdown ref={ref} location='bottom' displayCloseButton>
			<ModalHeaderText text={t('oppOverview.dropdowns.oppOnHold.headerText')} />
			<ModalText text={t('oppOverview.dropdowns.oppOnHold.text')} />
			<ModalButtonsContainer>
				<S.Button
					gradientBackground='orange'
					text={buttonTextMapper[props.asEntity]}
					// TODO Sason - useCallback
					onPress={() => {
						if (asEntity !== EntityEnum.OWNER) {
							(ref as ModalAndSlidingDropdownRef).current!.close();
						} else {
							dispatch(changeOppStatus(OpportunityStatusesEnum.IN_PROGRESS));
							(ref as ModalAndSlidingDropdownRef).current!.close();
						}
					}}
					rounded
					applyRatio
				/>
			</ModalButtonsContainer>
		</SlidingDropdown>
	);
});

const S: any = {};
S.Button = styled(Button)`
	width: ${deviceWidth * 0.67222222222};
	aspect-ratio: 4.03333333333;
	margin: auto;
`;

export default OppOnHoldDropdown;
