import RestApi from '../RestApi';
import crumbizApi from '../crumbizInstance';
import { IUserEmailPreferences, IEntity } from '../../../types/interfaces';
import {
	IUserPhone,
	IUserEmail,
	IUserPhonePreferences
} from '../../../types/interfaces';

interface IUsersPayload extends IEntity {}

class UsersEP extends RestApi<IUsersPayload> {
	routeName = 'Users';

	getUserIdByAuthId = async (authId: string) => {
		try {
			const response = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `authId eq ${authId}`,
					$expand: `UserAdditionals($top=1),userphones,useremails`
				}
			});
			return response.data;
		} catch (error) {}
	};

	getCrumbizUsers = async (userId: string) => {
		try {
			const response = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$expand: `UserAdditionals,userPhones($expand=userPhonePreferences($filter=creatorUserId eq ${userId})),userEmails($expand=userEmailPreferences($filter=creatorUserId eq ${userId}))`,
					$filter: `id ne ${userId}`
				}
			});
			return response.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getRelationshipsData = async (userId: string) => {
		try {
			const response = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$expand:
						'userPhones,userAdditionals($expand=country),OpportunityConnectors($count=true;$select=id,opportunityStatusId),OpportunityTargets($count=true;$select=id,opportunityTargetStatusId)',
					$filter: `id ne ${userId}`
				}
			});
			return response.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	getUserEmailsAndPhones = async (userId: string) => {
		try {
			const userEmailsAndPhones = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `id eq ${userId}`,
					$expand: `userPhones($expand=userPhonePreferences),userEmails($expand=userEmailPreferences),userAdditionals`,
					$select: `userPhones,userEmails,userAdditionals`
				}
			});
			return userEmailsAndPhones.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	postNewPhone = async (userPhone: IUserPhone) => {
		try {
			await crumbizApi.post('UserPhones', userPhone);
		} catch (ex) {
			throw new Error(ex);
		}
	};

	postNewEmail = async (userEmail: IUserEmail) => {
		try {
			await crumbizApi.post('UserEmails', userEmail);
		} catch (ex) {
			throw new Error(ex);
		}
	};

	putPhonePreference = async (userPhonePreference: IUserPhonePreferences) => {
		try {
			await crumbizApi.put(
				`UserPhonePreferences(${userPhonePreference.userPhoneId})`,
				userPhonePreference
			);
		} catch (ex) {
			throw new Error(ex);
		}
	};

	putEmailPreference = async (userEmailPreference: IUserEmailPreferences) => {
		try {
			await crumbizApi.put(
				`UserEmailPreferences(${userEmailPreference.userEmailId})`,
				userEmailPreference
			);
		} catch (ex) {
			throw new Error(ex);
		}
	};

	postNewPhonePreference = async (
		userPhonePreference: IUserPhonePreferences
	) => {
		try {
			await crumbizApi.post('UserPhonePreferences', userPhonePreference);
		} catch (ex) {
			throw new Error(ex);
		}
	};

	postNewEmailPreference = async (
		userEmailPreference: IUserEmailPreferences
	) => {
		try {
			await crumbizApi.post('UserEmailPreferences', userEmailPreference);
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const usersEP = new UsersEP();

export default usersEP;
