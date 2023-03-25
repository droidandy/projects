import { ExistenceList } from '../../entitySaga';

const filterUserExistenceArr = (existenceList: Array<ExistenceList>) =>
	existenceList
		.map((x: ExistenceList) => {
			// server have bug and returns array, igor said to take index 0 obj

			if (x) return x[0];
			// filtering the false responses
		})
		.filter(x => x !== undefined);

export default filterUserExistenceArr;
