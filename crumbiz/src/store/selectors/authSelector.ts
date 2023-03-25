import { IStoreProps } from '../../types/interfaces';
import destructUserAdditionals from '../../utils/destructUserAdditionals';
export const restoreStepperSelector = (state: IStoreProps) =>
	state.auth.restorePassStepper;

export const getAuthStateSelector = (state: IStoreProps) => state.auth;
export const getUserDataSelector = (state: IStoreProps) => state.auth.userData;
export const userAuthenticatedSelector = (state: IStoreProps) =>
	getAuthStateSelector(state).userAuthenticated;

export const getUserAdditionals = (state: IStoreProps) =>
	getAuthStateSelector(state).userData.userAdditionals;

export const getUserAvatarAndName = (state: IStoreProps) => {
	const { firstName, lastName } = getUserDataSelector(state);
	const userAdditionals = getUserAdditionals(state);
	const { avatar, avatarType } = destructUserAdditionals(userAdditionals!);

	return {
		avatar,
		avatarType,
		firstName,
		lastName
	};
};
