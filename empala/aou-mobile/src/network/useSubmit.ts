import { Auth } from 'aws-amplify';
import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { useAlert } from '~/components/hoc/withAlert';
import {
  CreateInvalidInputError,
  CreateUserAlreadyExistsError, CreateUserInput, InstNotFoundError, useCreateUserMutation,
} from '~/graphQL/core/generated-types';
import { useLogin } from '~/network/useLogin';
import { gotoApp } from '~/store/auth';
import store from '~/store/createStore';

const CreateUserSuccessTypename = 'CreateUserSuccess';
const CreateUserAlreadyExistsErrorTypename = 'CreateUserAlreadyExistsError';
const CreateInvalidInputErrorTypename = 'CreateInvalidInputError';
const InstNotFoundErrorTypename = 'InstNotFoundError';

type CreateUserBackendError =
  ({ __typename?: 'CreateUserAlreadyExistsError' } & Pick<CreateUserAlreadyExistsError, 'message'>)
  | ({ __typename?: 'CreateInvalidInputError' } & Pick<CreateInvalidInputError, 'message' | 'errorCode'>)
  | ({ __typename?: 'InstNotFoundError' } & Pick<InstNotFoundError, 'message'>);

const UserNotConfirmedException = 'UserNotConfirmedException';

type SubmitFuncArgs = {
  verificationCode: string,
  username: string,
  password: string,
  data: CreateUserInput,
};

export const useSubmit = (): [(arg: SubmitFuncArgs) => void, boolean, string | undefined] => {
  const [code, setCode] = useState('');
  const [userName, setUserName] = useState('');
  const [pwd, setPwd] = useState('');
  const [userData, setUserData] = useState<CreateUserInput | undefined>();
  const [authLoading, setAuthLoading] = useState(false);
  const [reducedError, setReducedError] = useState<string>();

  const [{ isLoading: isLoggingIn, error: loginError, response: loginResponse }, doLogin] = useLogin(false);
  const [doPost, { data: response, error, loading }] = useCreateUserMutation();

  const alert = useAlert();

  const submit = useCallback(({
    verificationCode, username, password, data,
  }: SubmitFuncArgs) => {
    setAuthLoading(true);
    setReducedError(undefined);

    setCode(verificationCode);
    setUserName(username);
    setPwd(password);
    setUserData(data);

    doLogin({ username, password });
  }, [isLoggingIn, doLogin]);

  const confirmUser = useCallback(async () => {
    await Auth.confirmSignUp(userName, code).then(
      () => {
        doLogin({ username: userName, password: pwd });
      },
      (err) => {
        setReducedError(err.message);
      },
    ).finally(() => setAuthLoading(false));
  }, [userName, code, pwd]);

  useEffect(() => {
    if (!loginError) return;

    if (loginError.code === UserNotConfirmedException) {
      confirmUser().catch(() => {});
    } else {
      setReducedError(loginError.message);
    }
  }, [loginError]);

  useEffect(() => {
    if (loginResponse && userData) doPost({ variables: { createUserData: userData } }).catch(() => {});
  }, [loginResponse, userData]);

  useEffect(() => {
    if (response) {
      const { __typename: typename } = response.createUser;

      switch (typename) {
        case CreateUserSuccessTypename: {
          const username = userData?.fullName || '';
          alert?.({
            title: `👋 Hello ${username}!`,
            message: 'Welcome to the All of Us platform. First things first, how about creating a stack?',
            duration: 5000,
          });
          store.dispatch(gotoApp());
          break;
        }
        case CreateUserAlreadyExistsErrorTypename:
        case CreateInvalidInputErrorTypename:
        case InstNotFoundErrorTypename: {
          const errorObj: CreateUserBackendError = response.createUser;
          const message = errorObj.message || 'Error while registering user';
          setReducedError(message);
        }
        // no default
      }
    }
  }, [response, userData]);

  useEffect(() => {
    if (!error) return;
    setReducedError(error?.toString());
  }, [error]);

  const reducedIsLoading = useMemo(
    () => authLoading || isLoggingIn || loading,
    [authLoading, isLoggingIn, loading],
  );

  return [submit, reducedIsLoading, reducedError];
};
