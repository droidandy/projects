import {
	EntityEnum,
	TargetStatusesEnum,
	OpportunityConnectorStatusesEnum
} from '../types/enums';

interface ISetNewStatus {
	role: EntityEnum;
	decision: boolean;
}
const setEntityNewSatatus = ({ role, decision }: ISetNewStatus) => {
	if (role === EntityEnum.CONNECTOR) {
		if (decision) return OpportunityConnectorStatusesEnum.APPROVED;
		return OpportunityConnectorStatusesEnum.DECLINED;
	}

	if (role === EntityEnum.TARGET) {
		if (decision) return TargetStatusesEnum.INTRO;
		return TargetStatusesEnum.DELETE_AND_FORGOT;
	}
};

export default setEntityNewSatatus;
