import { OpportunityStatusesEnum } from '../types/enums';

const oppStatusTitleMapper = {
	[OpportunityStatusesEnum.OPEN]: 'Open',
	[OpportunityStatusesEnum.START]: 'Start',
	[OpportunityStatusesEnum.IN_PROGRESS]: 'In Progress',
	[OpportunityStatusesEnum.ON_HOLD]: 'On Hold',
	[OpportunityStatusesEnum.COMPLETE]: 'Completed'
};

export default oppStatusTitleMapper;
