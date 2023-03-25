import { IUserEmailPreferences } from '../../../../types/interfaces';
const createEmailPreferences = (userId: string): IUserEmailPreferences => {
	return {
		userEmailId: null,
		creatorUserId: userId,
		prefer: false
	};
};

export default createEmailPreferences;
