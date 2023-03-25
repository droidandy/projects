import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView } from 'react-native';
import styled from 'styled-components/native';
import {
	IModalAndSlidingDropdownControls,
	ModalAndSlidingDropdownRef
} from '../../../types/interfaces';
import { Modal, CustomText } from '../../Shared';
import { IModalProps } from '../../Shared/Modal';
import {
	ModalHeaderText,
	ModalText,
	ModalLeftRightButtons,
	ModalCheckBox
} from '../../Shared/ModalAndDropdownContents';
import { deviceHeight } from '../../../utils/dimensions';
import { useShallowEqualSelector } from '../../../hooks/useShallowEqualSelector';
import { IUserPhone, IUserEmail } from '../../../types/interfaces';
import { initEntityLoadingSelector } from '../../../store/selectors/pendingSelectors';
import CoveringLoadingModal from '../CoveringLoadingModal';
import {
	entityContactWaysSelector,
	entityDetailsSelector
} from '../../../store/selectors/entitySelector';
import { useDispatch, useSelector } from 'react-redux';
import { ScreensEnum } from '../../../navigation/screens';
import { useNavigation } from 'react-navigation-hooks';
import {
	togglePhonePreference,
	toggleEmailPreference
} from '../../../store/actions/entityActions';
import { format } from 'libphonenumber-js';
import { atLeastOneContactWaySelector } from '../../../store/selectors/entitySelector';

enum ListTypesEnum {
	PHONE = 'PHONE',
	EMAIL = 'EMAIL'
}

interface IContactWays {
	userPhones: Array<IUserPhone>;
	userEmails: Array<IUserEmail>;
}

interface IProps extends IModalProps {
	ref: IModalAndSlidingDropdownControls;
	screenToNavigate: ScreensEnum;
}

const SelectContactTypeModal = React.forwardRef<
	IModalAndSlidingDropdownControls,
	IProps
>((props, ref) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const navigation = useNavigation();

	const { userPhones, userEmails }: IContactWays = useSelector(
		entityContactWaysSelector
	);
	const entity = useShallowEqualSelector(entityDetailsSelector);
	const pendingInitEntity = useShallowEqualSelector(initEntityLoadingSelector);
	const atLeastOneChecked = useSelector(atLeastOneContactWaySelector);

	const renderCheckBoxList = (listType: ListTypesEnum) => {
		return (
			<React.Fragment>
				<S.HeaderText
					color='gray15'
					text={t(
						`connectEntities.modals.contactWays.${
							listType === ListTypesEnum.EMAIL ? 'emailAddress' : 'phone'
						}`
					)}
					size='s13'
				/>

				{listType === ListTypesEnum.EMAIL &&
					userEmails.map((item, index) => (
						<ModalCheckBox
							key={item.email + index}
							checked={item.userEmailPreferences[0].prefer}
							onChange={() => {
								dispatch(toggleEmailPreference(item.email));
							}}
							text={item.email}
						/>
					))}

				{listType === ListTypesEnum.PHONE &&
					userPhones.map((item, index) => (
						<ModalCheckBox
							key={item.phone + index}
							checked={item.userPhonePreferences[0].prefer}
							onChange={() => {
								dispatch(togglePhonePreference(item.phone));
							}}
							text={format(item.phone, 'NATIONAL') || item.phone}
						/>
					))}
			</React.Fragment>
		);
	};

	return (
		<Modal {...props} ref={ref}>
			<ModalHeaderText
				text={t('connectEntities.modals.contactWays.headerText')}
			/>
			<ModalText
				text={t('connectEntities.modals.contactWays.text', {
					entityName: entity?.firstName || ''
				})}
			/>

			{pendingInitEntity ? (
				<CoveringLoadingModal visible={true} />
			) : (
				<S.CheckBoxs>
					<ScrollView style={{ maxHeight: deviceHeight * 0.4 }}>
						{!!userEmails.length && renderCheckBoxList(ListTypesEnum.EMAIL)}
						{!!userEmails.length && !!userPhones.length && <S.Divider />}
						{!!userPhones.length && renderCheckBoxList(ListTypesEnum.PHONE)}
					</ScrollView>
				</S.CheckBoxs>
			)}
			<ModalLeftRightButtons
				leftButton={{
					text: t('global.cancel'),
					callback: () => {
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
				rightButton={{
					text: t('global.ok'),
					disabled: !atLeastOneChecked,
					callback: () => {
						navigation.navigate(props.screenToNavigate);
						(ref as ModalAndSlidingDropdownRef).current!.close();
					}
				}}
			/>
		</Modal>
	);
});

const S: any = {};

S.HeaderText = styled(CustomText)`
	margin-bottom: ${deviceHeight * 0.0156};
`;
S.CheckBoxs = styled.View`
	margin-top: ${deviceHeight * 0.034375};
	width: 100%;
`;

S.Divider = styled.View`
	border: none;
	border-bottom-width: 1;
	border-bottom-color: ${({ theme }) => theme.colors.gray17};
	margin-bottom: ${deviceHeight * 0.02};
`;

export default SelectContactTypeModal;
