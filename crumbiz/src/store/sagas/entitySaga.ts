import { put, all, takeLatest, call, select } from 'redux-saga/effects';
import { EntityTypes } from '../constants';
import {
	IPayload,
	IEntity,
	IUserEmail,
	IUserPhone
} from '../../types/interfaces';
import { UtilsEP, UsersEP } from '../../services/api/routes';
import {
	IUserExistenceResponse,
	IUserAdditional
} from '../../types/interfaces';
import returnValidId from './utils/entity/returnValidId';
import {
	updateUserEmails,
	updateUserPhones,
	filterUserExistenceArr,
	attachPhonePreferenceId,
	attachEmailPreferenceId
} from './utils';
import usersEP from '../../services/api/routes/Users';
import phoneInternationalPrefix from './utils/entity/phoneInternationalPrefix';
import utilsEP from '../../services/api/routes/Utils';
import { setEntityExist, resetEntityState } from '../actions/entityActions';
import { getUserDataSelector } from '../selectors/authSelector';
import {
	setEntity,
	initEntityError,
	initEntitySuccess
} from '../actions/entityActions';
export type ExistenceList = Array<IUserExistenceResponse>;
interface IExistenceResponses {
	emailsExistenceResponse: ExistenceList;
	phonesExistenceResponse: ExistenceList;
}

interface IUserPhonesAndEmails {
	userPhones: Array<IUserPhone>;
	userEmails: Array<IUserEmail>;
	userAdditionals: Array<IUserAdditional>;
}

interface IEntityPayload {
	oppId?: string | null;
	entity: IEntity;
}

function* initEntitySaga({ payload }: IPayload<IEntityPayload>) {
	const { entity, oppId } = payload;
	const { source } = entity;
	const { id: userId } = yield select(getUserDataSelector);
	yield put(resetEntityState());

	try {
		entity.userPhones = yield phoneInternationalPrefix(entity.userPhones!);
		if (source === 'contacts') {
			// 1. prefix the phone number and remove duplicates
			// 2. Checking for entity existence and get their Id if they do
			const {
				emailsExistenceResponse,
				phonesExistenceResponse
			}: IExistenceResponses = yield all({
				emailsExistenceResponse: call(
					checkForEmailsExistence,
					entity.userEmails!
				),
				phonesExistenceResponse: call(
					checkForPhonesExistence,
					entity.userPhones!
				)
			});
			// 3. Set entity id according to the existence responses
			entity.id = returnValidId(
				emailsExistenceResponse,
				phonesExistenceResponse
			);

			// 4. Set user emails and user phones ID's from the existence response
			entity.userEmails = updateUserEmails(
				emailsExistenceResponse,
				entity.userEmails!,
				entity.id
			);
			entity.userPhones = updateUserPhones(
				phonesExistenceResponse,
				entity.userPhones!,
				entity.id
			);

			// 5. If we have entity id, get the userEmails and userPhones in order to get the preferences id.
			let userEmailsPhonesAndAdditionals: Array<
				IUserPhonesAndEmails
			> | null = null;
			if (entity.id) {
				userEmailsPhonesAndAdditionals = yield usersEP.getUserEmailsAndPhones(
					entity.id
				);
			}

			if (userEmailsPhonesAndAdditionals) {
				entity.userAdditionals =
					userEmailsPhonesAndAdditionals[0].userAdditionals;
				if (userEmailsPhonesAndAdditionals[0]?.userPhones?.length) {
					entity.userPhones = attachPhonePreferenceId(
						entity.userPhones,
						userEmailsPhonesAndAdditionals[0].userPhones
					);
				}

				if (userEmailsPhonesAndAdditionals[0]?.userEmails?.length) {
					entity.userEmails = attachEmailPreferenceId(
						entity.userEmails,
						userEmailsPhonesAndAdditionals[0].userEmails
					);
				}
			}
		}

		let isUserExists: boolean;
		if (entity.id && oppId) {
			isUserExists = yield utilsEP.isUserInOpp({
				oppId,
				entityId: entity.id
			});
		}
		const isTheEntityEqualToUser = entity.id === userId;

		if (isUserExists! || isTheEntityEqualToUser) {
			yield put(setEntityExist());
		} else {
			const { text, key, source, ...restEntity } = entity;
			yield put(setEntity(restEntity));
		}

		yield put(initEntitySuccess());
	} catch (ex) {
		console.log(ex);
		yield put(initEntityError());
	}
}

function* checkForEmailsExistence(userEmails: Array<IUserEmail>) {
	try {
		const apiCalls = yield userEmails!.map(x =>
			UtilsEP.checkUserExistence({ email: x.email })
		);
		const emailLists = yield all(apiCalls);
		const filteredEmailList = filterUserExistenceArr(emailLists);
		return filteredEmailList;
	} catch (error) {
		console.log('error checkForEmailsExistence saga');
	}
}

function* checkForPhonesExistence(userPhones: Array<IUserPhone>) {
	try {
		const apiCalls = yield userPhones!.map(x =>
			UtilsEP.checkUserExistence({ phone: x.phone })
		);
		const phoneList = yield all(apiCalls);
		const filteredPhoneLists = filterUserExistenceArr(phoneList);
		return filteredPhoneLists;
	} catch (error) {
		console.log('error checkForPhonesExistence saga');
	}
}

export function* handleExistingUserPreferencesSaga(entity: IEntity) {
	const { userPhones, userEmails } = entity;

	try {
		userPhones?.forEach(userPhone => {
			if (userPhone.id) {
				if (userPhone.userPhonePreferences[0].id)
					UsersEP.putPhonePreference(userPhone.userPhonePreferences[0]);
				else UsersEP.postNewPhonePreference(userPhone.userPhonePreferences[0]);
			} else UsersEP.postNewPhone(userPhone);
		});

		userEmails?.forEach(userEmail => {
			if (userEmail.id) {
				if (userEmail.userEmailPreferences[0].id)
					UsersEP.putEmailPreference(userEmail.userEmailPreferences[0]);
				else UsersEP.postNewEmailPreference(userEmail.userEmailPreferences[0]);
			} else UsersEP.postNewEmail(userEmail);
		});
	} catch (ex) {
		console.log('Error handleExistingUserPreferencesSaga');
	}
}

export function* watchEntitySaga() {
	yield all([takeLatest(EntityTypes.INIT_ENTITY as any, initEntitySaga)]);
}
