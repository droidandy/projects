import { PhoneNumber } from 'react-native-contacts';
import store from '../../../../store/store';
import { IUserPhone } from '../../../../types/interfaces';

export const prepareContactPhones = (
	phoneNumbers: PhoneNumber[]
): IUserPhone[] => {
	//@ts-ignore
	const creatorUserId: string = store.getState().auth.userData.id!;
	const modifiedPhoneArr = phoneNumbers.map(phone => ({
		phone: phone.number,
		phoneTypeId: null,
		asDefault: null,
		userPhonePreferences: [
			{
				creatorUserId,
				prefer: false
			}
		]
	}));

	return modifiedPhoneArr as IUserPhone[];
};
