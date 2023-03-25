import { OpportunityStatusesEnum } from '../types/enums';
import theme from '../themes/defaultTheme';
const statusColorMapper = {
	[OpportunityStatusesEnum.OPEN]: theme.colors.gray17,
	[OpportunityStatusesEnum.START]: theme.colors.lightBlue3,
	[OpportunityStatusesEnum.IN_PROGRESS]: theme.colors.orange2,
	[OpportunityStatusesEnum.ON_HOLD]: theme.colors.red1,
	[OpportunityStatusesEnum.COMPLETE]: theme.colors.green1
};

export default statusColorMapper;
