import {
	isValidNumber,
	parsePhoneNumberFromString,
	CountryCode
} from 'libphonenumber-js';
import * as RNLocalize from 'react-native-localize';
import { IUserPhone } from '../../../../types/interfaces';

const phoneInternationalPrefix = (userPhones: Array<IUserPhone>) => {
	userPhones.forEach((userPhone, index) => {
		if (!isValidNumber(userPhone.phone)) {
			const phoneInternationalPrefix = parsePhoneNumberFromString(
				userPhone.phone,
				RNLocalize.getCountry() as CountryCode
			)
				?.formatInternational()
				.replace(/ /g, '');

			if (phoneInternationalPrefix) {
				userPhones[index].phone = phoneInternationalPrefix;
			}
		} else {
			const phonePrefix = parsePhoneNumberFromString(userPhones[index].phone)
				?.formatInternational()
				.replace(/ /g, '');
			userPhones[index].phone = phonePrefix || userPhones[index].phone;
		}
	});

	// Remove phone duplicates
	const filteredPhoneArray = Object.values(
		userPhones.reduce((acc, item) => {
			if (!acc[item.phone]) {
				acc[item.phone] = item;
			}
			return acc;
		}, {} as { [key: string]: IUserPhone })
	);
	return filteredPhoneArray;
};

export default phoneInternationalPrefix;
