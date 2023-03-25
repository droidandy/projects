// @flow

// as an example for the future
export type State = {
  view: "signIn" | "signUp"
};

export type Action = { type: "SHOW_SIGN_IN_VIEW" | "SHOW_SIGN_UP_VIEW" };

// reducer
export default (state: State = { view: 'signIn' }, action: Action): State => {
  switch (action.type) {
    case 'SHOW_SIGN_IN_VIEW':
      return {
        ...state,
        view: 'signIn',
      };

    case 'SHOW_SIGN_UP_VIEW':
      return {
        ...state,
        view: 'signUp',
      };

    default:
      return state;
  }
};

// action creators
export const showSignIn = (): Action => ({ type: 'SHOW_SIGN_IN_VIEW' });
export const showSignUp = (): Action => ({ type: 'SHOW_SIGN_UP_VIEW' });
