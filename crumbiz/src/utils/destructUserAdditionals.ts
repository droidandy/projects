import { IUserAdditional } from '../types/interfaces';

// const defaultValues: IUserAdditional = {
//   id: '',
//   userId: '',m
//   avatar: '',
//   avatarType: '',
//   userGenderId: '',
//   birthday: '',
//   countryId: '',
//   stateId: '',
//   cityId: '',
//   linkedIn: '',
//   facebook: '',
//   twitter: '',
//   about: '',
//   introduction: '',
//   country: '',
//   score: 0
// };
const destructUserAdditionals = (
	userAdditionals: Array<IUserAdditional>
): Partial<IUserAdditional> => {
	if (userAdditionals[0]) {
		//TODO Yaron - fix the util to the new method
		// const userData:IUserAdditional = userAdditionals[0] || {};
		// return Object.entries(defaultValues).reduce((total, [key, value]) => {
		//   total[key] = userData[key] || value;
		//   return total;
		// }, {});
		const {
			avatar,
			avatarType,
			userGenderId,
			birthday,
			countryId,
			stateId,
			cityId,
			linkedIn,
			facebook,
			twitter,
			about,
			introduction,
			country,
			score
		} = userAdditionals[0];
		return {
			avatar: avatar || '',
			avatarType: avatarType || '',
			userGenderId: userGenderId || '',
			birthday: birthday || '',
			countryId: countryId || '',
			stateId: stateId || '',
			cityId: cityId || '',
			linkedIn: linkedIn || '',
			facebook: facebook || '',
			twitter: twitter || '',
			about: about || '',
			introduction: introduction || '',
			country: country || '',
			score: score || 0
		};
	}
	return {
		avatar: '',
		avatarType: '',
		userGenderId: '',
		birthday: '',
		countryId: '',
		stateId: '',
		cityId: '',
		linkedIn: '',
		facebook: '',
		twitter: '',
		about: '',
		introduction: '',
		country: '',
		score: 4
	};
};
export default destructUserAdditionals;
