import { IUserPhone } from '../../../../types/interfaces';

const attachPhonePreferenceId = (
	currentUserPhones: Array<IUserPhone>,
	userPhonesFromDB: Array<IUserPhone>
) => {
	currentUserPhones.forEach((currPhone, index) => {
		const matchedDBPhone = userPhonesFromDB.find(
			DBPhone => DBPhone.phone.indexOf(currPhone.phone) !== -1
		);

		const preferenceId = matchedDBPhone?.userPhonePreferences[0]?.id || null;

		if (matchedDBPhone?.id) {
			currentUserPhones[index].id = matchedDBPhone?.id;
			currentUserPhones[index].userPhonePreferences[0].userPhoneId =
				matchedDBPhone?.id;
		}

		if (preferenceId) {
			currentUserPhones[index].userPhonePreferences[0].id = preferenceId;
			currentUserPhones[
				index
			].userPhonePreferences[0].userPhoneId = currPhone.id!;
		}
	});

	return currentUserPhones;
};

export default attachPhonePreferenceId;
