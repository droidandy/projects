import i18n from '../../../locale/i18n';
import {
	EntityEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum,
	OpportunityTypesEnum
} from '../../../types/enums';
import { defaultTheme } from '../../../themes';

export const entityNameMapper = {
	[EntityEnum.CONNECTOR]: i18n.t('global.connector'),
	[EntityEnum.TARGET]: i18n.t('global.target'),
	[EntityEnum.OWNER]: i18n.t('global.owner')
};

export const oppTypeMapper = {
	[OpportunityTypesEnum.HIRING]: 'Hiring',
	[OpportunityTypesEnum.FUNDRAISING]: 'Fundrasing',
	[OpportunityTypesEnum.SERVICE_PROVIDER]: 'Service provider',
	[OpportunityTypesEnum.BUSINESS_DEVELOPMENT]: 'Buisness development'
};

type keyMapper = OpportunityStatusesEnum | TargetStatusesEnum;
type mapper = { [key in keyMapper]: { color: string; btnText: string } };

export const entityStatusMapper: mapper = {
	[OpportunityStatusesEnum.OPEN]: {
		color: defaultTheme.colors.gray17,
		btnText: 'Open'
	},
	[OpportunityStatusesEnum.START]: {
		color: defaultTheme.colors.lightBlue3,
		btnText: 'Start'
	},
	[OpportunityStatusesEnum.IN_PROGRESS]: {
		color: defaultTheme.colors.orange2,
		btnText: 'In Progress'
	},
	[OpportunityStatusesEnum.ON_HOLD]: {
		color: defaultTheme.colors.red1,
		btnText: 'On Hold'
	},
	[OpportunityStatusesEnum.COMPLETE]: {
		color: defaultTheme.colors.green1,
		btnText: 'Completed'
	},
	[TargetStatusesEnum.INTRO]: {
		color: defaultTheme.colors.blue,
		btnText: i18n.t('global.introStatus.intro')
	},
	[TargetStatusesEnum.WE_ARE_GOOD_TO_GO]: {
		color: defaultTheme.colors.purple1,
		btnText: i18n.t('global.introStatus.goodToGo')
	},
	[TargetStatusesEnum.MY_PART_IS_DONE]: {
		color: defaultTheme.colors.purple1,
		btnText: i18n.t('global.introStatus.goodToGo')
	},
	[TargetStatusesEnum.DONE_DEAL]: {
		color: defaultTheme.colors.orange,
		btnText: i18n.t('global.introStatus.doneDeal')
	},
	[TargetStatusesEnum.PENDING]: {
		color: defaultTheme.colors.orange,
		btnText: i18n.t('global.introStatus.pending')
	},
	[TargetStatusesEnum.DELETE_AND_FORGOT]: {
		color: defaultTheme.colors.red1,
		btnText: i18n.t('global.introStatus.declined')
	}
};
