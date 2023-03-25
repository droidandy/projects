import { OppOverviewTypes } from '../constants';
import { combineReducers } from 'redux';
import {
	IAction,
	IAssociatedOppsSection,
	IOppConnectorDetails,
	IOppDetailsAndUsers,
	IOppFullDetails,
	IOpportunitySummary,
	IOppTargetDetails,
	IPredefinedQuestion,
	ITemplate
} from '../../types/interfaces';
import { TargetStatusesEnum } from '../../types/enums';
import { createInteractionsReducer } from './utils';

export interface IOppOverViewState {
	associatedOpps: IAssociatedOppsSection;
	associatedOppsArrived: boolean;
	selectedOppId: string;
	oppDetails: IOppFullDetails | {};
	oppSummary: IOpportunitySummary | {};
	role: number | null;
	oppConnectors: Array<IOppConnectorDetails> | [];
	oppTargets: Array<IOppTargetDetails> | [];
	predefinedQuestions: Array<IPredefinedQuestion> | [];
	oppOverviewDataArrived: boolean;
	newInteractionMessage: {} | ITemplate;
	newOppAndTargetProfile: {} | IOppDetailsAndUsers;
	newOppAndTargetProfileDataArrived: boolean;
	canAddTargetsModal: boolean;
	newOppModal: boolean;
	ccToConnector: boolean;
}

interface payloads {
	interactionMessage: ITemplate;
	oppAndUsersData: IOppDetailsAndUsers;
	role: number;
	oppConnectors: Array<IOppConnectorDetails>;
	oppId: string;
	oppTargets: Array<IOppTargetDetails>;
	targetUserId: string;
	targetId: string;
	newStatus: TargetStatusesEnum;
}
// type payloads = IOppFullDetails | ITemplate | IOppDetailsAndUsers;
const initialState: IOppOverViewState = {
	associatedOpps: {},
	associatedOppsArrived: false,
	selectedOppId: '',
	oppDetails: {},
	oppSummary: {},
	oppConnectors: [],
	predefinedQuestions: [],
	oppTargets: [],
	oppOverviewDataArrived: false,
	role: null,
	newInteractionMessage: {},
	newOppAndTargetProfile: {},
	newOppAndTargetProfileDataArrived: false,
	canAddTargetsModal: false,
	newOppModal: false,
	ccToConnector: false
};

const oppInteractionsReducer = createInteractionsReducer(
	OppOverviewTypes.GET_OPP_INTERACTIONS
);
const targetInteractionsReducer = createInteractionsReducer(
	OppOverviewTypes.GET_TARGET_INTERACTIONS
);
const targetOverviewInteractionsReducer = createInteractionsReducer(
	OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS
);

const oppOverviewReducer = (
	state = initialState,
	action: IAction<keyof OppOverviewTypes, payloads>
) => {
	switch (action.type) {
		case OppOverviewTypes.SET_ASSOCIATED_OPPS:
			return {
				...state,
				associatedOpps: action.payload,
				associatedOppsArrived: true
			};

		case OppOverviewTypes.SET_OPP_ID_AND_ROLE:
			return {
				...state,
				selectedOppId: action.payload.oppId,
				role: action.payload.role,
				oppOverviewDataArrived: false
			};

		case OppOverviewTypes.SET_OPP_SUMMARY:
			return {
				...state,
				oppSummary: action.payload
			};

		case OppOverviewTypes.SET_TARGETS_AND_CONNECTORS:
			return {
				...state,
				oppConnectors: action.payload.oppConnectors,
				oppTargets: action.payload.oppTargets,
				oppOverviewDataArrived: true
			};
		case OppOverviewTypes.SET_OPP_DETAILS:
			return {
				...state,
				oppDetails: action.payload
			};

		case OppOverviewTypes.UPDATE_TARGET_STATUS:
			const targetsCopy = [...state.oppTargets];
			const targetIndex = targetsCopy.findIndex(
				target => target.oppTargetId === action.payload.targetId
			);
			targetsCopy[targetIndex] = {
				...targetsCopy[targetIndex],
				statusId: action.payload.newStatus
			};
			return {
				...state,
				oppTargets: [...targetsCopy]
			};

		case OppOverviewTypes.UPDATE_OPP_STATUS:
			return {
				...state,
				oppDetails: {
					...state.oppDetails,
					oppStatus: action.payload
				}
			};

		case OppOverviewTypes.RESET_OPP_OVERVIEW_STATE:
			return {
				...initialState
			};

		case OppOverviewTypes.SET_PREDEFINED_MESSAGES:
			return {
				...state,
				predefinedQuestions: action.payload
			};

		case OppOverviewTypes.SET_NEW_OPP_DATA: {
			return {
				...state,
				newInteractionMessage: action.payload.interactionMessage,
				newOppAndTargetProfile: action.payload.oppAndUsersData,
				newOppAndTargetProfileDataArrived: true
			};
		}

		case OppOverviewTypes.UPDATE_TARGET_STATUS_INSIDE_PROFILE:
			const updatedOppTargets =
				//@ts-ignore // TODO All - opportunityTargets does exists and it warns anyway
				state.newOppAndTargetProfile!.opportunityTargets;
			updatedOppTargets[0].opportunityTargetStatusId = action.payload;
			return {
				...state,
				newOppAndTargetProfile: {
					...state.newOppAndTargetProfile,
					opportunityTargets: updatedOppTargets
				}
			};

		case OppOverviewTypes.OPEN_CAN_ADD_TARGETS_MODAL:
			return {
				...state,
				canAddTargetsModal: true
			};

		case OppOverviewTypes.CC_TO_CONNECTOR_TOGGLE:
			return {
				...state,
				ccToConnector: action.payload
			};

		case OppOverviewTypes.SET_NEW_OPP_MODAL:
			return {
				...state,
				newOppModal: true
			};

		default:
			return state;
	}
};

const interactionsReducer = combineReducers({
	opportunity: oppInteractionsReducer,
	targetProfile: targetInteractionsReducer,
	oppCrumb: targetOverviewInteractionsReducer
});

export default combineReducers({
	overview: oppOverviewReducer,
	interactions: interactionsReducer
});
