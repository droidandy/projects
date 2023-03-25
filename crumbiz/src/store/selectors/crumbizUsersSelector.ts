import {
	IUserData,
	IUserExpandedWithRelationships
} from '../../types/interfaces';

export interface ICrumbizUsersTypes {
	crumbizUsersList: Array<IUserData>;
	crumbizRelationshipsList: Array<IUserExpandedWithRelationships>;
	isLoading: boolean;
}

export const crumbizUsersSelector = (state: any) => state.crumbizUsers;

const createSelector = (chunk: string) => (state: any) =>
	crumbizUsersSelector(state)[chunk];
