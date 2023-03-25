import React, { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
	IEntityData,
	IStackNavigation,
	IEntity,
	IModalAndSlidingDropdownControls
} from '../../types/interfaces';
import {
	ChooseEntityTabs,
	CoveringLoadingModal
} from '../../components/Shared';
import { useDispatch, useSelector } from 'react-redux';
import {
	getOppDetailsAndTemplates,
	sendIntroResetState
} from '../../store/actions/sendIntroActions';
import { sendIntroSelector } from '../../store/selectors/sendIntroSelectors';
import { ScreensEnum } from '../../navigation/screens';
import {
	SelectContactTypeModal,
	EntityExistsModal
} from '../../components/Shared/Modals';
import {
	initEntity,
	resetEntityState
} from '../../store/actions/entityActions';
import { entityExistsSelector } from '../../store/selectors/entitySelector';
import { Keyboard } from 'react-native';
import navigationService from '../../services/NavigationService';

interface IProps extends IStackNavigation {}

const ChooseEntity: React.FC<IProps> = props => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { isOppsArrived, chosenOppId } = useSelector(sendIntroSelector);
	const isEntityExists = useSelector(entityExistsSelector);
	const selectContactTypeModalRed = useRef<IModalAndSlidingDropdownControls>(
		null
	);
	const entityExistModal = useRef<IModalAndSlidingDropdownControls>(null);

	useEffect(() => {
		if (chosenOppId) {
			dispatch(getOppDetailsAndTemplates());
		}
	}, [chosenOppId]);

	useEffect(() => {
		if (isEntityExists) {
			selectContactTypeModalRed.current?.close();
			entityExistModal.current?.open();
		}
	}, [isEntityExists]);
	const fullNameModalRef = useRef<any>(null);
	const EmailModalRef = useRef<any>(null);

	// Using the unmount callback to reset entity and intro state.
	useEffect(
		() => () => {
			dispatch(resetEntityState());
			dispatch(sendIntroResetState());
		},
		[]
	);

	if (!isOppsArrived) return <CoveringLoadingModal visible />;

	return (
		<>
			<ChooseEntityTabs
				closeOnPress={() => {
					navigationService.goBack();
				}}
				preHeaderText={t('connectEntities.chooseEntity.choose')}
				headerText={t('connectEntities.chooseEntity.theContributor')}
				onItemPress={(contact: IEntity) => {
					Keyboard.dismiss();
					dispatch(initEntity(contact, chosenOppId));
					selectContactTypeModalRed.current?.open();
				}}
			/>
			<SelectContactTypeModal
				ref={selectContactTypeModalRed}
				screenToNavigate={ScreensEnum.SEND_INTRO}
			/>
			<EntityExistsModal ref={entityExistModal} />

			{/* The modals are commented out because we ditched it according to the priorities */}
			{/* <EntityFullNameModal ref={fullNameModalRef} />
			<EntityEmailModal ref={EmailModalRef} /> */}
		</>
	);
};

export default ChooseEntity;
