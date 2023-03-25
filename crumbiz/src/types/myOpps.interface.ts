import {
	OpportunityStatusesEnum,
	OpportunityTypesEnum,
	OpportunityConnectorStatusesEnum,
	TargetStatusesEnum,
	EntityEnum
} from './enums';

export interface IMyOpp {
	id: string;
	title: string;
	timestamp: string;
	opportunityStatusId: OpportunityStatusesEnum;
	opportunityTypeId: OpportunityTypesEnum;
	opportunityConnectors: IMyOppConnector[];
}
interface IMyOppConnector {
	ownerUserId: string;
	connectorUserId: string;
	opportunityStatusId: OpportunityConnectorStatusesEnum;
	opportunityTargets: IMyOppTarget[];
}

interface IMyOppTarget {
	targetUserId: string;
	opportunityTargetStatusId: TargetStatusesEnum;
}

export interface IMyOppData {
	id: string;
	title: string;
	timestamp: string;
	role: EntityEnum;
	opportunityTypeId: OpportunityTypesEnum;
	targetStatusId?: TargetStatusesEnum;
	connectorStatusId: OpportunityConnectorStatusesEnum;
	opportunityStatusId: OpportunityStatusesEnum;

	// statusId: TargetStatusesEnum | OpportunityStatusesEnum;
}
