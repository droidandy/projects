import { PermissionsAndroid } from 'react-native';
import _Contacts, { Contact } from 'react-native-contacts';

class Contacts {
	public static getAll(): Promise<Array<Contact>> {
		return new Promise((resolve, reject) => {
			PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.READ_CONTACTS
			).then(() => {
				_Contacts.getAll((ex, contacts) => {
					if (ex) {
						reject(ex);
					} else {
						resolve(contacts);
					}
				});
			});
		});
	}

	public static openContactForm(
		filledContactForm: Partial<Contact> = {}
	): Promise<Contact> {
		return new Promise<Contact>((resolve, reject) => {
			_Contacts.openContactForm(
				filledContactForm as Contact,
				(ex, newContact) => {
					if (ex) {
						reject(ex);
					} else {
						resolve(newContact);
					}
				}
			);
		});
	}
}

export default Contacts;
