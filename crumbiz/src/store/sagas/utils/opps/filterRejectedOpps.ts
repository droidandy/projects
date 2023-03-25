import { IOppItem } from '../../../../types/interfaces';
import { EntityEnum, TargetStatusesEnum } from '../../../../types/enums';
import { OpportunityConnectorStatusesEnum } from '../../../../types/enums';

const filterRejectedOpps = (opps: IOppItem[]): IOppItem[] => {
	const filteredOpps = opps.filter(opp => {
		const connectorAndRejected =
			opp.role === EntityEnum.CONNECTOR &&
			opp.connectorStatusId === OpportunityConnectorStatusesEnum.DECLINED;

		const contributorAndRejected =
			opp.role === EntityEnum.TARGET &&
			opp.targetStatusId === TargetStatusesEnum.DELETE_AND_FORGOT;

		const rejectedOpp = connectorAndRejected || contributorAndRejected;

		return !rejectedOpp;
	});

	return filteredOpps;
};

export default filterRejectedOpps;
