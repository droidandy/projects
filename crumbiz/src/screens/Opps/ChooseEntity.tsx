import React, { useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { IModalAndSlidingDropdownControls } from '../../types/interfaces';
import { IStackNavigation, IEntity } from '../../types/interfaces';
import { ChooseEntityTabs } from '../../components/Shared';
import { updateOpportunity } from '../../store/actions/createOpportunityActions';
import { useDispatch, useSelector } from 'react-redux';
import { createOpportunitySelector } from '../../store/selectors/createOpportunitySelectors';
import { EntityEnum, ProccessTypeEnum } from '../../types/enums';
import {
	SelectContactTypeModal,
	EntityExistsModal
} from '../../components/Shared/Modals/';

import { ScreensEnum } from '../../navigation/screens';
import {
	initEntity,
	resetEntityState
} from '../../store/actions/entityActions';
import { oppIdSelector } from '../../store/selectors/oppOverviewSelector';
import { entityExistsSelector } from '../../store/selectors/entitySelector';
import { Keyboard } from 'react-native';

interface IProps extends IStackNavigation {}
const ChooseEntity: React.FC<IProps> = ({ navigation }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { role, processType } = useSelector(createOpportunitySelector);
	const isEntityExists = useSelector(entityExistsSelector);
	const oppoverviewOppId = useSelector(oppIdSelector);
	const selectContactTypeModalRed = useRef<IModalAndSlidingDropdownControls>(
		null
	);
	const entityExistModal = useRef<IModalAndSlidingDropdownControls>(null);

	useEffect(() => {
		if (isEntityExists) {
			selectContactTypeModalRed.current?.close();
			entityExistModal.current?.open();
		}
	}, [isEntityExists]);

	const handleContactSelection = (contact: IEntity) => {
		Keyboard.dismiss();
		const oppId =
			processType === ProccessTypeEnum.ADDING_NEW_CONNECTOR
				? oppoverviewOppId
				: null;
		dispatch(initEntity(contact, oppId));
		selectContactTypeModalRed.current?.open();
	};

	// Using the unmount callback to reset entity state.
	useEffect(
		() => () => {
			dispatch(resetEntityState());
		},
		[]
	);

	return (
		<>
			{role === EntityEnum.OWNER ? (
				<ChooseEntityTabs
					closeOnPress={() =>
						navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL)
					}
					preHeaderText={t('connectEntities.chooseEntity.letsChoose')}
					headerText={t('connectEntities.chooseEntity.yourConnector')}
					onItemPress={handleContactSelection}
				/>
			) : (
				<ChooseEntityTabs
					closeOnPress={() =>
						navigation.navigate(ScreensEnum.DELETE_CREATE_OPP_INFO_MODAL)
					}
					preInitiatorText={t(
						'connectEntities.chooseEntity.chooseTheInitiator'
					)}
					headerInitiatorText={t(
						'connectEntities.chooseEntity.ofThisOpportunity'
					)}
					onItemPress={handleContactSelection}
				/>
			)}
			<SelectContactTypeModal
				ref={selectContactTypeModalRed}
				screenToNavigate={ScreensEnum.SEND_MESSAGE_TO_ENTITY}
			/>
			<EntityExistsModal ref={entityExistModal} />
		</>
	);
};

export default ChooseEntity;
