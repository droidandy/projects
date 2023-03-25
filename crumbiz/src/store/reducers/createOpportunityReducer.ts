import { EntityEnum, ProccessTypeEnum, TemplatesEnum } from '../../types/enums';
import { CreateOpportunityTypes } from '../constants';
import { DynamicObject, IReduxAction, IOppInfo } from '../../types/interfaces';

export interface ICreateOpInitialState {
	[TemplatesEnum.SERVICE_PROVIDER_ID]: [];
	[TemplatesEnum.BUDGET_ID]: [];
	[TemplatesEnum.BUSINESS_TYPE_ID]: [];
	[TemplatesEnum.VERTICAL_ID]: [];
	oppTypes: [];
	isTemplateArrived: boolean;
	opType: IOppInfo;
	opTitle: string;
	businessType: IOppInfo;
	verticals: DynamicObject<string>;
	provider: IOppInfo;
	budget: number | null;
	role: EntityEnum | null;

	msgTextToEntity: string;
	processType: ProccessTypeEnum;
}

const initialState: ICreateOpInitialState = {
	[TemplatesEnum.SERVICE_PROVIDER_ID]: [],
	[TemplatesEnum.BUDGET_ID]: [],
	[TemplatesEnum.BUSINESS_TYPE_ID]: [],
	[TemplatesEnum.VERTICAL_ID]: [],
	oppTypes: [],
	isTemplateArrived: false,
	opType: { id: '', title: '' },
	opTitle: '',
	businessType: { id: '', title: '' },
	verticals: {},
	provider: { id: '', title: '' },
	budget: null,
	role: null,
	msgTextToEntity: '',

	processType: ProccessTypeEnum.CREATING_NEW_OPP
};

const createOpportunityReducer = (
	state = initialState,
	action: IReduxAction<CreateOpportunityTypes>
) => {
	switch (action.type) {
		case CreateOpportunityTypes.UPDATE_OPPORTUNITY:
			return {
				...state,
				[action.payload.key]: action.payload.value
			};
		case CreateOpportunityTypes.RESET_CREATE_OPP_STATE:
			return {
				...initialState
			};

		case CreateOpportunityTypes.SET_ADD_NEW_CONNECTOR_CONFIG:
			return {
				...state,
				role: EntityEnum.OWNER,
				processType: ProccessTypeEnum.ADDING_NEW_CONNECTOR
			};
		case CreateOpportunityTypes.SET_TEMPLATE_FIELD:
			return {
				...state,
				[action.payload.key]: action.payload.value
			};
		case CreateOpportunityTypes.SET_OPP_TYPES:
			return {
				...state,
				oppTypes: action.payload
			};

		default:
			return state;
	}
};

export default createOpportunityReducer;
