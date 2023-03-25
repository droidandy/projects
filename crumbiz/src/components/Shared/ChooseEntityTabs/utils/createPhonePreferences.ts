import { IUserPhonePreferences } from '../../../../types/interfaces';

const createPhonePreferences = (userId: string): IUserPhonePreferences => {
	return {
		userPhoneId: null,
		creatorUserId: userId,
		prefer: false
	};
};

export default createPhonePreferences;
