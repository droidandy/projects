import { StateModel } from 'store/types';

export const selectUser = (state: StateModel) => state.user;
export const selectUserId = (state: StateModel) => state.user.id;
export const selectUserPhone = (state: StateModel) => state.user.phone;
