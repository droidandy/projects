import { EmailAddress } from 'react-native-contacts';
import store from '../../../../store/store';
import { IUserEmail } from '../../../../types/interfaces';

export const prepareContactEmails = (
	emailAddresses: EmailAddress[]
): IUserEmail[] => {
	//@ts-ignore
	const creatorUserId: string = store.getState().auth.userData.id!;

	return emailAddresses.map(emailAddresses => ({
		email: emailAddresses.email,
		asDefault: null,
		userEmailPreferences: [
			{
				creatorUserId,
				prefer: false
			}
		]
	}));
};
