import {
	OpportunityConnectorStatusesEnum,
	TargetStatusesEnum
} from './../../../types/enums';
import RestApi from '../RestApi';
import { IOppFullDetails } from '../../../types/interfaces';
import { OpportunityStatusesEnum, EntityIdsEnum } from '../../../types/enums';
import crumbizApi from '../crumbizInstance';

interface IOpportunities {
	id: string;
	title: string;
	creatorUserId: string;
}

class OpportunitiesEP extends RestApi<IOpportunities> {
	routeName = 'Opportunities';
	getOppDetails = async (oppId: string) => {
		try {
			const res = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `id eq ${oppId}`,
					$expand: `opportunityStatus`
				}
			});
			return res.data.value;
		} catch (ex) {}
	};
	changeOppStatus = async (
		newStatus: OpportunityStatusesEnum,
		oppDetails: IOppFullDetails
	) => {
		const { oppId, oppTitle, creationTime, opportunityTypeId } = oppDetails;
		try {
			crumbizApi.put(`${this.routeName}(${oppId})`, {
				id: oppId,
				title: oppTitle,
				timestamp: creationTime,
				opportunityTypeId,
				opportunityStatusId: newStatus,
				roleId: EntityIdsEnum.OWNER
			});
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getMyOpps = async (authId: string) => {
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$expand: `opportunityConnectors($filter=((ownerUserId eq ${authId} or connectorUserId eq ${authId} or OpportunityTargets/any(c: c/TargetUserId eq ${authId})));$expand=opportunityTargets($select=opportunityTargetStatusId,targetUserId,id;$filter=targetUserId eq ${authId});$select=id,ownerUserId,connectorUserId,opportunityStatusId)`,
					$select: `id,title,timestamp,opportunityStatusId,opportunityTypeId`,
					$count: `true`,
					$orderby: `timestamp desc`
					// $filter: `opportunityConnectors/all(c: c/opportunityTargets/all( d: d/opportunityTargetStatusId ne ${TargetStatusesEnum.DELETE_AND_FORGOT}))`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const opportunitiesEP = new OpportunitiesEP();

export default opportunitiesEP;
