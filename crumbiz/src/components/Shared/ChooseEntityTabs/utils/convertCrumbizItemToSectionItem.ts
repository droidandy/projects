import { IUserData, IEntity } from '../../../../types/interfaces';
import { fullName } from '../../../../utils';
import store from '../../../../store/store';
import createEmailPreferences from './createEmailPreferences';
import createPhonePreferences from './createPhonePreferences';

const userId = store.getState().auth.userData.id;

const convertCrumbizItemToSectionItem = (crumbizUser: IUserData): IEntity => {
	const { firstName, lastName, id } = crumbizUser;

	crumbizUser.userEmails?.forEach((userEmail, index) => {
		if (!userEmail.userEmailPreferences.length) {
			crumbizUser.userEmails![index].userEmailPreferences.push(
				createEmailPreferences(userId)
			);
		}
	});

	crumbizUser.userPhones?.forEach((userPhone, index) => {
		if (!userPhone.userPhonePreferences.length) {
			crumbizUser.userPhones![index].userPhonePreferences.push(
				createPhonePreferences(userId)
			);
		}
	});

	return {
		source: 'crumbiz',
		key: id!,
		text: fullName(firstName, lastName),
		userAdditionals: [],
		...crumbizUser
	};
};

export default convertCrumbizItemToSectionItem;
