import RestApi from '../RestApi';
import { IChangeTargetStatusPayload } from '../../../types/interfaces';
import crumbizApi from '../crumbizInstance';

interface IOppTargets {
	id: string;
	parentOpportunityTargetId: string;
	opportunityConnectorId: string;
	targetUserId: string;
	opportunityTargetStatusId: string;
}

class OppTargetsEP extends RestApi<IOppTargets> {
	routeName = 'OpportunityTargets';

	changeTargetStatus = async ({
		targetId,
		newStatus
	}: IChangeTargetStatusPayload) => {
		try {
			await crumbizApi.patch(`${this.routeName}(${targetId})`, {
				opportunityTargetStatusId: newStatus
			});
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const oppTargetsEP = new OppTargetsEP();

export default oppTargetsEP;
