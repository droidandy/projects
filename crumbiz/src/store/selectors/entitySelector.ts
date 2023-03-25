import { IUserPhone, IUserEmail } from '../../types/interfaces';
export const entitySelector = (state: any) => state.entity;

export const entityDetailsSelector = (state: any) =>
	entitySelector(state).entity;

export const entityContactWaysSelector = (state: any) => {
	const userPhones = entitySelector(state).entity?.userPhones;
	const userEmails = entitySelector(state).entity?.userEmails;

	return {
		userPhones: userPhones || [],
		userEmails: userEmails || []
	};
};

export const atLeastOneContactWaySelector = (state: any) => {
	const userPhones: Array<IUserPhone> = entitySelector(state).entity
		?.userPhones;
	const userEmails: Array<IUserEmail> = entitySelector(state).entity
		?.userEmails;

	const atLeastOneEmailChecked = () =>
		userEmails.some(emailObj =>
			emailObj.userEmailPreferences.some(preference => preference.prefer)
		);

	const atLeastOnePhoneCheched = () =>
		userPhones?.some(phoneObj =>
			phoneObj.userPhonePreferences.some(prefernce => prefernce.prefer)
		);

	const atLeastOneChecked = () => {
		if (!userPhones?.length && !userEmails?.length) return false;
		return atLeastOneEmailChecked() || atLeastOnePhoneCheched();
	};

	return atLeastOneChecked();
};

export const entityExistsSelector = (state: any) =>
	entitySelector(state).isEntityExist;
