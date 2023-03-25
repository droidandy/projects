import RestApi from '../RestApi';
import crumbizApi from '../crumbizInstance';
import { AxiosResponse } from 'axios';
import {
	IUserExistenceResponse,
	IIsUserInOppParams
} from '../../../types/interfaces';

interface IUserExistenceBody {
	email?: string;
	phone?: string;
}

class UtilsEP extends RestApi<string> {
	routeName = 'Utils';

	// First we check the Phone number, if the phone didnt return an id (404) and the entity had an email we will check if the Email exists.
	checkUserExistence = async (body: IUserExistenceBody) => {
		try {
			const userExistenceCall = await crumbizApi.post('/Utils/Exists', body);
			return userExistenceCall.data;
		} catch (ex) {
			return false;
		}
	};

	getSummaryData = async () => {
		const response = await crumbizApi.get(
			`${this.routeName}/CalcGeneralSumData`
		);
		return response.data.value;
	};

	isUserInOpp = async (params: IIsUserInOppParams) => {
		const response = await crumbizApi.get(`${this.routeName}/IsUserInOpp`, {
			params: {
				OpportunityId: params.oppId,
				UserId: params.entityId
			}
		});
		return response.data;
	};
}

const utilsEP = new UtilsEP();

export default utilsEP;
