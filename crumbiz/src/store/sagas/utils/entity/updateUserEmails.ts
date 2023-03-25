import { ExistenceList } from '../../entitySaga';
import { IUserEmail } from '../../../../types/interfaces';

const updateUserEmails = (
	emailExistenceRes: ExistenceList,
	userEmails: Array<IUserEmail>,
	entityId: string | null
) => {
	if (entityId) {
		userEmails.forEach((_, index) => {
			userEmails[index].userId = entityId;
		});
	}

	if (!emailExistenceRes.length) return userEmails;

	emailExistenceRes.forEach(emailRes => {
		const emailIndex = userEmails.findIndex(
			x => x.email.toLowerCase() === emailRes.Email?.toLowerCase()
		);
		if (emailIndex !== -1) {
			userEmails[emailIndex].id = emailRes.UserEmailId!;
			userEmails[
				emailIndex
			].userEmailPreferences[0].userEmailId = emailRes.UserEmailId!;
		}
	});

	return userEmails;
};

export default updateUserEmails;
