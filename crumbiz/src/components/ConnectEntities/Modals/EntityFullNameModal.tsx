import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components/native';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import { Modal } from '../../Shared';
import { IModalProps } from '../../Shared/Modal';
import {
	ModalHeaderText,
	ModalLeftRightButtons
} from '../../Shared/ModalAndDropdownContents';
import { TextInput } from '../../Shared/Form@2.0';
import { deviceHeight } from '../../../utils/dimensions';

interface IProps extends IModalProps {}

const EntityFullNameModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();
	const [firstName, setFirstName] = useState('');
	const [lastName, setLastName] = useState('');

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('connectEntities.modals.entityFullName.headerText')}
			/>

			<S.InputsContainer>
				<S.Input
					onChange={setFirstName}
					value={firstName}
					placeholder={t('connectEntities.modals.entityFullName.firstName')}
					name='firstName'
					withMarginBottom
				/>

				<S.Input
					onChange={setLastName}
					value={lastName}
					placeholder={t('connectEntities.modals.entityFullName.lastName')}
					name='lastName'
				/>
			</S.InputsContainer>

			<ModalLeftRightButtons
				leftButton={{
					text: t('global.cancel'),
					callback: () => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
				rightButton={{
					text: t('global.ok'),
					callback: () => {}
				}}
			/>
		</Modal>
	);
});

const S: any = {};
S.InputsContainer = styled.View`
	margin-top: ${deviceHeight * 0.034375};
`;

S.Input = styled(TextInput)<{ withMarginBottom: boolean }>`
	padding: 0;
	border: none;
	${({ withMarginBottom, theme }) =>
		withMarginBottom &&
		`
			margin-bottom: ${deviceHeight * 0.046875};
	`};
	border-bottom-width: 1;
	border-bottom-color: ${({ theme }) => theme.colors.gray17};
	min-height: ${deviceHeight * 0.046875};
`;

export default EntityFullNameModal;
