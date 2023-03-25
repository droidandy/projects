import { put, all, takeLatest, call, select } from 'redux-saga/effects';
import { CrumbizUsersTypes } from '../constants';
import usersEP from '../../services/api/routes/Users';
import {
	IupdateUserInfoPayload,
	IPayload,
	IUpdateUserAdditionalsPayload
} from '../../types/interfaces';
import {
	updateuserAdditionalInfoSuccess,
	updateuserAdditionalInfoError,
	getCrumbizUsersSuccess,
	getCrumbizUsersError
} from '../actions/crumbizUsersActions';
import {
	getUserDataSelector,
	getUserAdditionals
} from '../selectors/authSelector';
import RestApi from '../../services/api/RestApi';
import { updateUserDetails } from '../actions/authActions';
import userAdditionalsEP from '../../services/api/routes/UserAdditionals';
import extractIdFromResponseHeaders from '../../utils/extractIdFromResponseHeaders';
import AsyncStorage from '@react-native-community/async-storage';
import {
	setCrumbizUsers,
	setRelationshipsData
} from '../actions/crumbizUsersActions';
import {
	IUserData,
	IUserExpandedWithRelationships
} from '../../types/interfaces';

//------------------------------------//
//  Watched Sagas                     //
//------------------------------------//

function* getCrumbizUsersSaga() {
	const userData = yield select(getUserDataSelector);
	try {
		const crumbizUsers: Array<IUserData> = yield usersEP.getCrumbizUsers(
			userData.id
		);

		const sortedCrumbizUsers = crumbizUsers.sort((contactA, contactB) => {
			if (contactA.firstName && contactB.firstName) {
				return contactA.firstName.localeCompare(contactB.firstName);
			}
			// firstname can be null
			return 0;
		});

		yield put(setCrumbizUsers(sortedCrumbizUsers));
		yield put(getCrumbizUsersSuccess());
	} catch (ex) {
		yield put(getCrumbizUsersError());
		console.log('Error getCrumbizUsersSaga', ex);
	}
}

function* getRelationshipsDataSaga() {
	const userData = yield select(getUserDataSelector);
	try {
		const usersList: Array<IUserExpandedWithRelationships> = yield usersEP.getRelationshipsData(
			userData.id
		);
		yield put(setRelationshipsData(usersList));
	} catch (ex) {
		console.log('Error fetching getRelationshipsDataSaga ', ex);
	}
}

function* updateUserInfoSaga({ payload }: IPayload<IupdateUserInfoPayload>) {
	const userData = yield select(getUserDataSelector);
	const { userAdditionals, ...restUserData } = userData;

	try {
		const { updatedUserObject } = payload;
		const newUserObj = {
			...restUserData,
			...updatedUserObject
		};
		yield usersEP.putById(userData.id, newUserObj);
		yield put(updateUserDetails({ ...userData, ...newUserObj }));
	} catch (ex) {
		console.log('Failed to updateUserInfoSaga', ex);
	}
}

function* updateUserAdditionalsSaga({
	payload
}: IPayload<IUpdateUserAdditionalsPayload>) {
	const userAdditionals = yield select(getUserAdditionals);
	const userData = yield select(getUserDataSelector);
	const { updatedUserAdditionalsKeys } = payload;

	try {
		if (userAdditionals.length && userAdditionals[0].id) {
			const userAdditionalsData = {
				...userAdditionals[0],
				...updatedUserAdditionalsKeys
			};
			yield userAdditionalsEP.putById(
				userAdditionals[0].id,
				userAdditionalsData
			);
			yield put(
				updateUserDetails({
					...userData,
					userAdditionals: [
						{
							...userAdditionals[0],
							...updatedUserAdditionalsKeys
						}
					]
				})
			);
		} else {
			const userAdditionalsData = {
				...updatedUserAdditionalsKeys,
				userId: userData.id
			};
			const response = yield userAdditionalsEP.create(userAdditionalsData);
			const userAdditionalsId = extractIdFromResponseHeaders(response.headers);
			yield put(
				updateUserDetails({
					...userData,
					userAdditionals: [
						{ ...updatedUserAdditionalsKeys, id: userAdditionalsId }
					]
				})
			);
		}
		const userCachedDetailsKey = `userDetails-${userData.authId}`;
		yield AsyncStorage.removeItem(userCachedDetailsKey);
		yield put(updateuserAdditionalInfoSuccess());
	} catch (ex) {
		console.log('Error updateUserAdditionalsSaga', ex);
		yield put(updateuserAdditionalInfoError());
	}
}

export function* watchCrumbizUsersSaga() {
	yield all([
		takeLatest(CrumbizUsersTypes.GET_CRUMBIZ_USERS as any, getCrumbizUsersSaga),
		takeLatest(
			CrumbizUsersTypes.GET_RELATIONSHIPS_DATA as any,
			getRelationshipsDataSaga
		),
		takeLatest(CrumbizUsersTypes.UPDATE_USER_INFO as any, updateUserInfoSaga),
		takeLatest(
			CrumbizUsersTypes.UPDATE_USER_ADDITIONALS_INFO as any,
			updateUserAdditionalsSaga
		)
	]);
}
