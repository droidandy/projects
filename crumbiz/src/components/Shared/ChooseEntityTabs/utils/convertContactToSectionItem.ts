import { Contact } from 'react-native-contacts';
import { IEntity } from '../../../../types/interfaces';
import { fullName } from '../../../../utils';
import { prepareContactEmails } from './prepareContactEmails';
import { prepareContactPhones } from './prepareContactPhones';

const convertContactToSectionItem = (contact: Contact): IEntity => {
	const {
		givenName,
		familyName,
		recordID,
		emailAddresses,
		phoneNumbers
	} = contact;

	return {
		text: fullName(givenName, familyName),
		key: givenName + recordID,
		source: 'contacts',
		id: '',
		userPhones: prepareContactPhones(phoneNumbers),
		userEmails: prepareContactEmails(emailAddresses),
		firstName: contact.givenName ? contact.givenName : '',
		lastName: contact.familyName ? contact.familyName : '',
		userAdditionals: []
	};
};

export default convertContactToSectionItem;
