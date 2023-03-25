import { user } from 'type';

export const authorizeSuccessAction = payload => ({ type: user.USER_AUTHORIZE_SUCCESS, payload });

export const userCollectionLoad = payload => ({ type: user.USER_COLLECTION_LOAD, payload });
