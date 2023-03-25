import { IUserData } from '../types/interfaces';

const extractAvatarFromUser = (userObj: IUserData) => {
	const avatarCheck =
		userObj.userAdditionals && userObj.userAdditionals!.length && userObj.userAdditionals![0].avatar;
	const avatar = avatarCheck ? avatarCheck : '';
	const avatarType = avatarCheck ? userObj.userAdditionals![0].avatarType : '';

	return [avatar, avatarType];
};

export default extractAvatarFromUser;
