import RestApi from '../RestApi';
import {
	IGetTargetsPayload,
	IChangeEntityDecisionPayload
} from '../../../types/interfaces';
import {
	EntityEnum,
	OpportunityConnectorStatusesEnum
} from '../../../types/enums';
import crumbizApi from '../crumbizInstance';

interface IOppConnectors {
	userId: string;
}
interface IgetOppDetailsAndUsersPayload {
	oppId: string;
	userId?: string;
}

interface IChangeEntityBody {
	opportunityStatusId?: string;
	opportunityTargetStatusId?: string;
}

class OppConnectorsEP extends RestApi<IOppConnectors> {
	routeName = 'OpportunityConnectors';

	// For when connector navigate to intro (adding targets and the data is not already there);
	getOppDetailsAndTemplates = async (oppId: string) => {
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `opportunityId eq ${oppId}`,
					$expand: `User($expand=userAdditionals),Opportunity($expand=OpportunityTemplates($expand=OpportunityTemplateFields($expand=TemplateField)))`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getAssociatedOpps = async (userId: string) => {
		try {
			const res = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$expand: `OpportunityConnectorStatus,Opportunity($expand=OpportunityStatus),OpportunityTargets($filter=targetUserId eq ${userId};$expand=OpportunityTargetStatus)`,
					$filter: `ownerUserId eq ${userId} or connectorUserId eq ${userId} or OpportunityTargets/all(c: c/TargetUserId eq ${userId})`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};
	getOppDetailsTargetsAndConnectors = async (params: IGetTargetsPayload) => {
		const { userId, oppId, role } = params;
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `${
						role === EntityEnum.CONNECTOR ? 'connectorUserId' : 'ownerUserId'
					} eq ${userId} and opportunityId eq ${oppId}`,
					$expand:
						'OpportunityTargets($expand=user($expand=userPhones,userAdditionals($select=Avatar,AvatarType);$select=FirstName,LastName,id,email),opportunityTargetStatus),user1($expand=userAdditionals($select=Avatar,AvatarType);$select=FirstName,LastName,id)'
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getOppDetailsAndUsers = async ({ oppId }: IgetOppDetailsAndUsersPayload) => {
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `OpportunityId eq ${oppId}`,
					$expand: `opportunity,user1,user,OpportunityTargets`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getOppDetailsForNewOppAndTargetProfile = async ({
		oppId,
		userId
	}: IgetOppDetailsAndUsersPayload) => {
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `OpportunityId eq ${oppId}`,
					$expand: `opportunity,user1($expand=userAdditionals),user($expand=userAdditionals),OpportunityTargets($filter=targetUserId eq ${userId})`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	changeEntityDecision = async ({
		newStatus,
		entityId,
		role
	}: IChangeEntityDecisionPayload) => {
		let endpointRoute;

		const body: IChangeEntityBody = {};
		if (role === EntityEnum.CONNECTOR) {
			endpointRoute = this.routeName;
			body.opportunityStatusId = newStatus;
		} else {
			endpointRoute = 'OpportunityTargets';
			body.opportunityTargetStatusId = newStatus;
		}

		try {
			await crumbizApi.patch(`${endpointRoute}(${entityId})`, body);
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const oppConnectorsEP = new OppConnectorsEP();

export default oppConnectorsEP;
