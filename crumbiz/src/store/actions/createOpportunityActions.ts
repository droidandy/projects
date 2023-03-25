import { CreateOpportunityTypes } from '../constants';
import { ICreateOpInitialState } from '../reducers/createOpportunityReducer';
import { ITemplate } from '../sagas/createOpportunitySaga';
import {
	IOppType,
	IOppTemplateFieldPayload,
	PlainFunction
} from '../../types/interfaces';
import { TemplatesEnum } from '../../types/enums';
import { createErrorAction, createSuccessAction } from './utils';

export const updateOpportunity = (
	key: keyof ICreateOpInitialState,
	value: any
) => ({
	type: CreateOpportunityTypes.UPDATE_OPPORTUNITY,
	payload: {
		key,
		value: value
	}
});

export const getOppTypes = () => ({
	type: CreateOpportunityTypes.GET_OPP_TYPES
});

export const setOppTypes = (oppTypes: Array<IOppType>) => ({
	type: CreateOpportunityTypes.SET_OPP_TYPES,
	payload: oppTypes
});

export const getOppTemplateField = (templateFieldId: TemplatesEnum) => ({
	type: CreateOpportunityTypes.GET_TEMPLATE_FIELD,
	payload: templateFieldId
});

export const setOppTemplateField = (
	templateFieldPayload: IOppTemplateFieldPayload
) => ({
	type: CreateOpportunityTypes.SET_TEMPLATE_FIELD,
	payload: templateFieldPayload
});

export const submitOpportunity = (callback: PlainFunction) => {
	return {
		type: CreateOpportunityTypes.SUBMIT_OPPORTUNITY,
		payload: callback,
		meta: {
			loading: true
		}
	};
};

export const submitOpportunitySuccess = createSuccessAction(
	CreateOpportunityTypes.SUBMIT_OPPORTUNITY
);
export const submitOpportunityError = createErrorAction(
	CreateOpportunityTypes.SUBMIT_OPPORTUNITY
);

export const resetCreateOppState = () => ({
	type: CreateOpportunityTypes.RESET_CREATE_OPP_STATE
});

export const setAddNewConnectorConfig = () => ({
	type: CreateOpportunityTypes.SET_ADD_NEW_CONNECTOR_CONFIG
});

export const addNewConnector = (callback: PlainFunction) => ({
	type: CreateOpportunityTypes.ADD_NEW_CONNECTOR,
	payload: callback,
	meta: {
		loading: true
	}
});

export const addNewConnectorSuccess = createSuccessAction(
	CreateOpportunityTypes.ADD_NEW_CONNECTOR
);
export const addNewConnectorError = createErrorAction(
	CreateOpportunityTypes.ADD_NEW_CONNECTOR
);
