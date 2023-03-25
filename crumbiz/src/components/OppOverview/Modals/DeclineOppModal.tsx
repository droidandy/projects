import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import Modal, { IModalProps } from '../../Shared/Modal';
import { Button, CustomText } from '../../Shared';
import { useTheme } from '../../../hooks';
import { deviceHeight } from '../../../utils/dimensions';
import {
	ModalButtonsContainer,
	ModalHeaderText,
	ModalText
} from '../../Shared/ModalAndDropdownContents';
import {
	IModalAndSlidingDropdownControls,
	PlainFunction
} from '../../../types/interfaces';
import { EntityEnum } from '../../../types/enums';
import { entityNameMapper } from '../../Shared/ModalAndDropdownContents/Mappers';

interface IProps extends IModalProps {
	declinedUser: string;
	asEntity: EntityEnum;
	handleDecision: PlainFunction;
	buttonsDisabled: boolean;
}

const DeclineOppModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();
	const theme = useTheme();
	const { declinedUser, handleDecision, asEntity, buttonsDisabled } =
		props || {};

	const textPath =
		asEntity === EntityEnum.CONNECTOR ? 'asConnector' : 'asContributer';

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t(`oppOverview.modals.declineOpp.${textPath}.headerText`, {
					username: declinedUser
				})}
			/>

			<ModalText text={t(`oppOverview.modals.declineOpp.${textPath}.text`)} />

			<ModalButtonsContainer>
				<Button
					text={t(`oppOverview.modals.declineOpp.${textPath}.deleteAndForget`)}
					onPress={() => handleDecision(false)}
					backgroundColor={theme.colors.red1}
					rounded
					disabled={buttonsDisabled}
				/>
			</ModalButtonsContainer>

			<S.WellWell
				touchable
				onPress={() => {
					if (!buttonsDisabled) return handleDecision(true);
				}}
				text={t(`oppOverview.modals.declineOpp.${textPath}.wellWell`, {
					entityName: entityNameMapper[asEntity]
				})}
				size='s12'
			/>
		</Modal>
	);
});

const S: any = {};
S.WellWell = styled(CustomText)`
	margin-top: ${deviceHeight * 0.03125};
	color: ${({ theme }) => theme.colors.gray15};
`;

export default DeclineOppModal;
