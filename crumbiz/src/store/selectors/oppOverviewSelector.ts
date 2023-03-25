import {
	IOppFullDetails,
	IOpportunitySummary,
	IOppTargetDetails,
	IOppConnectorDetails,
	IPredefinedQuestion,
	IAssociatedOppsSection,
	ITemplate,
	IOppDetailsAndUsers, IVInteraction, SagaRequestsState
} from '../../types/interfaces';
import { EntityEnum } from '../../types/enums';
import { createSagaRequestSelectors } from './utils';

export interface IOppOverViewSelector {
	associatedOpps: IAssociatedOppsSection;
	associatedOppsArrived: boolean;
	selectedOppId: string;
	oppDetails: IOppFullDetails;
	oppSummary: IOpportunitySummary;
	role: EntityEnum;
	oppConnectors: Array<IOppConnectorDetails>;
	oppTargets: Array<IOppTargetDetails>;
	predefinedQuestions: Array<IPredefinedQuestion>;
	oppOverviewDataArrived: boolean;
	newInteractionMessage: ITemplate;
	newOppAndTargetProfile: IOppDetailsAndUsers;
	newOppAndTargetProfileDataArrived: boolean;
	canAddTargetsModal: boolean;
	newOppModal: boolean;
	ccToConnector: boolean;
}

type InteractionsStateType = SagaRequestsState<Array<IVInteraction>>;
export interface InteractionsState {
	opportunity: InteractionsStateType,
	targetProfile: InteractionsStateType,
	oppCrumb: InteractionsStateType
}

export const oppOverviewSelector = (state: any): IOppOverViewSelector =>
	state.oppOverview.overview

export const oppInteractionsGlobalSelector = (state: any): InteractionsState =>
	state.oppOverview.interactions

export const oppInteractionsSelectors = createSagaRequestSelectors('opportunity', (state: any) =>
	oppInteractionsGlobalSelector(state).opportunity
);

export const oppTargetProfileSelectors = createSagaRequestSelectors('targetProfile', (state: any) =>
	oppInteractionsGlobalSelector(state).targetProfile
);

export const oppCrumbSelectors = createSagaRequestSelectors('oppCrumb', (state: any) =>
	oppInteractionsGlobalSelector(state).oppCrumb
);

export const oppIdSelector = (state: any) =>
	oppOverviewSelector(state).selectedOppId;

export const roleSelector = (state: any) =>
	oppOverviewSelector(state).role;

export const oppTargetsSelector = (state: any) =>
	oppOverviewSelector(state).oppTargets;

export const predefinedMessagesSelector = (state: any) =>
	oppOverviewSelector(state).predefinedQuestions;

export const newIntroductionMessageSelector = (state: any) =>
	oppOverviewSelector(state).newInteractionMessage;
