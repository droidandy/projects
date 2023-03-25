import React from 'react';
import { OpportunityTypesEnum } from '../types/enums';
import { Icons } from '../components/Shared';
import { deviceWidth, deviceHeight } from '../utils/dimensions';

const props = {
	width: deviceWidth * 0.40555555555,
	height: deviceHeight * 0.1859375
};
const oppTypeIconsMapper = {
	[OpportunityTypesEnum.HIRING]: <Icons.HiringIcon {...props} />,
	[OpportunityTypesEnum.BUSINESS_DEVELOPMENT]: (
		<Icons.BusinessDevIcon {...props} />
	),
	[OpportunityTypesEnum.SERVICE_PROVIDER]: (
		<Icons.ServiceProviderIcon {...props} />
	),
	[OpportunityTypesEnum.FUNDRAISING]: <Icons.FundraisingIcon {...props} />
};

export default oppTypeIconsMapper;
