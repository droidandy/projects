import { SendIntroTypes } from '../constants';
import { AttachmentTypesEnum } from '../../types/enums';
import { ITemplate, IOpportunity } from '../../types/interfaces';
import { ISendIntroInitialState } from '../reducers/sendIntroReducer';

export const updateIntroAction = (
	key: keyof ISendIntroInitialState,
	value: any
) => ({
	type: SendIntroTypes.UPDATE_INTRO,
	payload: {
		key,
		value
	}
});

export const sendIntroAddAttachment = (
	key: AttachmentTypesEnum,
	value: any
) => ({
	type: SendIntroTypes.ADD_ATTACHMENT,
	payload: {
		key,
		value
	}
});

export const sendIntroRemoveAttachment = (key: AttachmentTypesEnum) => ({
	type: SendIntroTypes.REMOVE_ATTACHMENT,
	payload: {
		key
	}
});

export const sendIntroResetState = () => ({
	type: SendIntroTypes.RESET_INTRO_STATE
});

export const setOppData = (payload: IOpportunity) => ({
	type: SendIntroTypes.SET_OPP_DATA,
	payload: payload
});

export const chooseOppId = (oppId: string) => ({
	type: SendIntroTypes.CHOOSE_OPP_ID,
	payload: oppId
});

export const checkForEntityExistence = () => ({
	type: SendIntroTypes.CHECK_FOR_ENTITY_EXISTENCE
});

export const prepareTemplates = () => ({
	type: SendIntroTypes.PREPARE_TEMPLATES
});

export const setTemplates = (templates: Array<{}>) => ({
	type: SendIntroTypes.SET_TEMPLATES,
	payload: templates
});

export const saveNewTemplate = (newTemplate: ITemplate) => ({
	type: SendIntroTypes.SAVE_NEW_TEMPLATE,
	payload: newTemplate
});

export const addSavedTemplate = (newTemplate: ITemplate) => ({
	type: SendIntroTypes.ADD_SAVED_TEMPLATE,
	payload: newTemplate
});

export const connectTarget = () => ({
	type: SendIntroTypes.CONNECT_TARGET
});

export const getOppDetailsAndTemplates = () => ({
	type: SendIntroTypes.GET_OPP_DETAILS_AND_TEMPLATES
});
