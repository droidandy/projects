import { TargetStatusesEnum } from '../types/enums';

const revertTargetStatus = {
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: TargetStatusesEnum.INTRO,
	[TargetStatusesEnum.DONE_DEAL]: TargetStatusesEnum.WE_ARE_GOOD_TO_GO,
	[TargetStatusesEnum.PENDING]: TargetStatusesEnum.PENDING,
	[TargetStatusesEnum.INTRO]: TargetStatusesEnum.PENDING,
	[TargetStatusesEnum.DELETE_AND_FORGOT]: TargetStatusesEnum.DELETE_AND_FORGOT,
	[TargetStatusesEnum.MY_PART_IS_DONE]: TargetStatusesEnum.INTRO
};

export default revertTargetStatus;
