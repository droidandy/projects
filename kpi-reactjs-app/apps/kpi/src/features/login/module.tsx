import React from 'react';
import { RouterActions } from 'typeless-router';
import * as Rx from 'src/rx';
import { setAccessToken } from 'src/services/Storage';
import { GlobalActions } from '../global/interface';
import { LoginView } from './components/LoginView';
import { LoginActions, LoginState, handle } from './interface';
import {
  LoginFormActions,
  useLoginForm,
  getLoginFormState,
} from './login-form';
import { login, getLoggedUser } from 'src/services/API-next';
import { allPermissionMap } from 'src/const';

// --- Epic ---
handle
  .epic()
  .on(LoginActions.$mounted, () => LoginFormActions.reset())
  .on(LoginFormActions.setSubmitSucceeded, () => {
    const { values } = getLoginFormState();
    return Rx.concatObs(
      Rx.of(LoginActions.setLoading(true)),
      Rx.of(LoginActions.setError('')),
      login(values.username, values.password).pipe(
        Rx.mergeMap(({ token }) => {
          setAccessToken(token);
          return getLoggedUser().pipe(
            Rx.mergeMap(user => {
              return [
                // todo: permission map
                GlobalActions.loggedIn(user, allPermissionMap),
                RouterActions.push('/'),
              ];
            })
          );
        }),
        Rx.catchLog((e: any) => {
          const error = (e.response && e.response.message) || e.message;
          return Rx.of(LoginActions.setError(error));
        })
      ),
      Rx.of(LoginActions.setLoading(false))
    );
  });

// --- Reducer ---
const initialState: LoginState = {
  isLoading: false,
  error: '',
};

handle
  .reducer(initialState)
  .on(LoginActions.setLoading, (state, { isLoading }) => {
    state.isLoading = isLoading;
  })
  .on(LoginActions.setError, (state, { error }) => {
    state.error = error;
  });

// --- Module ---
export default () => {
  handle();
  useLoginForm();
  return <LoginView />;
};
