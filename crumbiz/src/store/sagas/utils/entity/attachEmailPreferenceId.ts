import { IUserEmail } from '../../../../types/interfaces';

const attachEmailPreferencesId = (
	currentUserEmails: Array<IUserEmail>,
	userEmailsFromDB: Array<IUserEmail>
) => {
	currentUserEmails.forEach((currEmail, index) => {
		const matchedDBEmail = userEmailsFromDB.find(
			DBPhone => DBPhone.email.indexOf(currEmail.email) !== -1
		);

		const preferenceId = matchedDBEmail?.userEmailPreferences[0]?.id || null;

		if (matchedDBEmail?.id) {
			currentUserEmails[index].id = matchedDBEmail?.id;
			currentUserEmails[index].userEmailPreferences[0].userEmailId =
				matchedDBEmail?.id;
		}
		if (preferenceId) {
			currentUserEmails[index].userEmailPreferences[0].id = preferenceId;
			currentUserEmails[
				index
			].userEmailPreferences[0].userEmailId = currEmail.id!;
		}
	});

	return currentUserEmails;
};

export default attachEmailPreferencesId;
