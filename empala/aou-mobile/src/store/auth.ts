import { ActionType } from './storeTypes';

import { Route } from '~/app/home/navigation/routes';
import { CredentialsType } from '~/types/user';

const SET_USER = 'SET_USER';
const SET_USER_AND_GOTO_APP = 'SET_USER_AND_PROCEED';
const GOTO_APP = 'GOTO_APP';
const SIGNIN = 'SIGNIN';
const SIGNUP = 'SIGNUP';
const WELCOME = 'WELCOME';

export const setUser = (credentials: CredentialsType | null, token: string, redirect = true): ActionType => ({
  type: redirect ? SET_USER_AND_GOTO_APP : SET_USER,
  value: { credentials, token },
});

const initState = {
  user: null,
  token: null,
  route: Route.AuthLoading,
};

export const gotoApp = (): ActionType => ({ type: GOTO_APP });
export const signin = (): ActionType => ({ type: SIGNIN });
export const signup = (): ActionType => ({ type: SIGNUP });
export const welcome = (): ActionType => ({ type: WELCOME });

export const auth = (state = initState, action: ActionType) => {
  switch (action.type) {
    case SET_USER:
      return {
        ...state,
        user: action.value?.credentials,
        token: action.value?.token,
      };
    case GOTO_APP:
      return {
        ...state,
        route: Route.App,
      };
    case SET_USER_AND_GOTO_APP:
      return {
        ...state,
        user: action.value?.credentials,
        token: action.value?.token,
        route: action.value ? Route.App : Route.Signin,
      };
    case SIGNIN:
      return {
        ...state,
        route: Route.Signin,
      };
    case SIGNUP:
      return {
        ...state,
        route: Route.Signup,
      };
    case WELCOME:
      return {
        ...state,
        route: Route.Welcome,
      };
    default:
      return state;
  }
};
