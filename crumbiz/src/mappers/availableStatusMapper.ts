import { OpportunityStatusesEnum } from '../types/enums';

const availableStatusMapper = {
	[OpportunityStatusesEnum.OPEN]: [OpportunityStatusesEnum.ON_HOLD],
	[OpportunityStatusesEnum.START]: [OpportunityStatusesEnum.ON_HOLD],
	[OpportunityStatusesEnum.IN_PROGRESS]: [
		OpportunityStatusesEnum.COMPLETE,
		OpportunityStatusesEnum.ON_HOLD
	],
	[OpportunityStatusesEnum.ON_HOLD]: [
		OpportunityStatusesEnum.IN_PROGRESS,
		OpportunityStatusesEnum.COMPLETE
	],
	[OpportunityStatusesEnum.COMPLETE]: [
		OpportunityStatusesEnum.IN_PROGRESS,
		OpportunityStatusesEnum.ON_HOLD
	]
};

export default availableStatusMapper;
