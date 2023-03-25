import { OppOverviewTypes } from '../constants';
import { createErrorAction } from './utils';
import {
	IAssociatedOppsSection,
	IChangeEntityDecisionPayload,
	IChangeTargetStatusPayload,
	IGetProfileDataPayload,
	IGetTargetsPayload,
	IOppFullDetails,
	IOpportunitySummary,
	IPredefinedQuestion,
	ISendInteractionPayload,
	ISetNewOppDataPayload,
	ISetTargetsAndConnectorsPayload,
	ISpecialInteractionPayload,
	IUpdateTargetStatusPayload
} from '../../types/interfaces';
import {
	EntityEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum
} from '../../types/enums';
import {
	createInteractionsAction,
	createClearAction,
	createSuccessAction
} from './utils';

export const getAssociatedOpps = () => ({
	type: OppOverviewTypes.GET_ASSOCIATED_OPPS
});

export const setAssociatedOpps = (associatedOpps: IAssociatedOppsSection) => ({
	type: OppOverviewTypes.SET_ASSOCIATED_OPPS,
	payload: associatedOpps
});

// TODO Yaron - remove if unused
export const getTargetProfile = ({ role, oppId }: IGetProfileDataPayload) => ({
	type: OppOverviewTypes.GET_TARGET_PROFILE,
	payload: { role, oppId }
});

export const setSelectedOppAndRole = (params: {
	oppId: string;
	role: EntityEnum;
}) => ({
	type: OppOverviewTypes.SET_OPP_ID_AND_ROLE,
	payload: params
});

export const getOppDetailsTargetsAndConnectors = (
	params: IGetTargetsPayload
) => ({
	type: OppOverviewTypes.GET_OPP_DETAILS_TARGETS_AND_CONNECTORS,
	payload: params,
	meta: {
		loading: true
	}
});

export const getOppDetailsTargetsAndConnectorsSuccess = createSuccessAction(
	OppOverviewTypes.GET_OPP_DETAILS_TARGETS_AND_CONNECTORS
);

export const getOppDetailsTargetsAndConnectorsError = createErrorAction(
	OppOverviewTypes.GET_OPP_DETAILS_TARGETS_AND_CONNECTORS
);

export const setTargetsAndConnectors = (
	params: ISetTargetsAndConnectorsPayload
) => ({
	type: OppOverviewTypes.SET_TARGETS_AND_CONNECTORS,
	payload: params
});

export const getOppSummary = (oppId: string) => ({
	type: OppOverviewTypes.GET_OPP_SUMMARY,
	payload: oppId
});

export const setOppSummary = (oppSummary: IOpportunitySummary) => ({
	type: OppOverviewTypes.SET_OPP_SUMMARY,
	payload: oppSummary
});

export const setOppDetails = (oppDetails: IOppFullDetails) => ({
	type: OppOverviewTypes.SET_OPP_DETAILS,
	payload: oppDetails
});

export const resetOppOverviewState = () => ({
	type: OppOverviewTypes.RESET_OPP_OVERVIEW_STATE
});

export const resetOppInteractions = createClearAction(
	OppOverviewTypes.GET_OPP_INTERACTIONS
);

export const resetTargetProfileInteractions = createClearAction(
	OppOverviewTypes.GET_TARGET_INTERACTIONS
);
export const resetTargetOverviewInteractions = createClearAction(
	OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS
);

export const changeTargetStatus = (params: IChangeTargetStatusPayload) => ({
	type: OppOverviewTypes.CHANGE_TARGET_STATUS,
	payload: params
});

export const updateTargetStatusId = (payload: IUpdateTargetStatusPayload) => ({
	type: OppOverviewTypes.UPDATE_TARGET_STATUS,
	payload
});

export const changeEntityDecision = (
	payload: IChangeEntityDecisionPayload
) => ({
	type: OppOverviewTypes.CHANGE_ENTITY_DECISION,
	payload
});

export const updateTargetStatusInsideProfile = (
	newStatus: TargetStatusesEnum
) => ({
	type: OppOverviewTypes.UPDATE_TARGET_STATUS_INSIDE_PROFILE,
	payload: newStatus
});

export const openCanAddTargetsModal = () => ({
	type: OppOverviewTypes.OPEN_CAN_ADD_TARGETS_MODAL
});

export const changeOppStatus = (newStatus: string) => ({
	type: OppOverviewTypes.CHANGE_OPP_STATUS,
	payload: newStatus
});

export const updateOppStatus = (newStatus: OpportunityStatusesEnum) => ({
	type: OppOverviewTypes.UPDATE_OPP_STATUS,
	payload: newStatus
});

export const getPredefinedQuestions = () => ({
	type: OppOverviewTypes.GET_PREDEFINED_MESSAGES
});

export const setPredefinedQuestions = (
	predefinedQuestions: Array<IPredefinedQuestion>
) => ({
	type: OppOverviewTypes.SET_PREDEFINED_MESSAGES,
	payload: predefinedQuestions
});

export const sendInteraction = (params: ISendInteractionPayload) => ({
	type: OppOverviewTypes.SEND_INTERACTION,
	payload: params
});

export const getNewOppAndTargetProfile = () => ({
	type: OppOverviewTypes.GET_NEW_OPP_DATA
});

export const setNewOppData = (payload: ISetNewOppDataPayload) => ({
	type: OppOverviewTypes.SET_NEW_OPP_DATA,
	payload
});

export const ccToConnectorToggle = (payload: boolean) => ({
	type: OppOverviewTypes.CC_TO_CONNECTOR_TOGGLE,
	payload
});

export const setNewOppForModal = () => ({
	type: OppOverviewTypes.SET_NEW_OPP_MODAL
});

export const sendSpacielInteraction = (
	payload: ISpecialInteractionPayload
) => ({
	type: OppOverviewTypes.SEND_SPACIEL_INTERACTION,
	payload
});

export const getOppInteractionsData = createInteractionsAction(
	OppOverviewTypes.GET_OPP_INTERACTIONS,
	(params: any) => ({
		$filter: `opportunityId eq ${params.oppId}`
	})
);

export const getTargetInteractionsData = createInteractionsAction(
	OppOverviewTypes.GET_TARGET_INTERACTIONS,
	(params: any) => {
		const { selectedOppId, userId, targetUserId, role } = params;
		const $filter = `opportunityId eq ${selectedOppId} and targetUserId eq ${targetUserId} and ${
			role === EntityEnum.CONNECTOR ? 'connectorUserId' : 'ownerUserId'
		} eq ${userId}`;

		return { $filter };
	}
);

export const getTargetOverviewInteractionsData = createInteractionsAction(
	OppOverviewTypes.GET_TARGET_OVERVIEW_INTERACTIONS,
	(params: any) => {
		const { ownerUserId, targetUserId, oppId } = params;
		const $filter = `targetUserId eq ${targetUserId} and ownerUserId eq ${ownerUserId} and opportunityId eq ${oppId}`;
		return { $filter };
	}
);
