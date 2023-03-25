import { ExistenceList } from '../../entitySaga';

const returnValidId = (
	emailExistenceRes: ExistenceList,
	phoneExistenceRes: ExistenceList
) => {
	if (!emailExistenceRes.length && !phoneExistenceRes.length) return null;

	if (emailExistenceRes.length) return emailExistenceRes[0].Id;

	if (phoneExistenceRes.length) return phoneExistenceRes[0].Id;

	return null;
};

export default returnValidId;
