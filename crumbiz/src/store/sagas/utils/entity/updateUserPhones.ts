import { ExistenceList } from '../../entitySaga';
import { IUserPhone } from '../../../../types/interfaces';

const updateUserPhones = (
	phoneExistenceRes: ExistenceList,
	userPhones: Array<IUserPhone>,
	entityId: string | null
) => {
	if (entityId) {
		userPhones.forEach((_, index) => {
			userPhones[index].userId = entityId;
		});
	}

	if (!phoneExistenceRes.length) return userPhones;

	phoneExistenceRes.forEach(phoneRes => {
		const phoneIndex = userPhones.findIndex(x => x.phone === phoneRes.Phone);
		if (phoneIndex !== -1) {
			userPhones[phoneIndex].id = phoneRes.UserPhoneId!;
			userPhones[
				phoneIndex
			].userPhonePreferences[0].userPhoneId = phoneRes.UserPhoneId!;
		}
	});

	return userPhones;
};

export default updateUserPhones;
