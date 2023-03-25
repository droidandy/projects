import { Auth } from 'aws-amplify';
import { useState, useEffect, useCallback } from 'react';

import { setUser } from '~/store/auth';
import store from '~/store/createStore';
import { CredentialsType } from '~/types/user';

export const useLogin = (redirect = true): [
  {
    response: Record<string, unknown> | undefined;
    error: { message: string, code: string } | null;
    isLoading: boolean;
  },
  (credentials: CredentialsType) => void,
] => {
  const [response, setResponse] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [credentials, setCredentials] = useState<CredentialsType | undefined>();

  const doLogin = useCallback((data) => {
    setError(null);
    setCredentials(data);
    setIsLoading(true);
  }, []);

  useEffect(() => {
    if (!isLoading || !credentials) {
      return;
    }

    const login = async () => {
      const { username, password } = credentials;
      try {
        await Auth.signOut();
        const user = await Auth.signIn(username, password);
        const jwtToken = (await Auth.currentSession()).getIdToken().getJwtToken();
        console.log('### jwtToken:', jwtToken);
        store.dispatch(setUser(user, jwtToken, redirect));
        setResponse(user);
      } catch (err) {
        console.log('### error:', err);
        setError(err);
      }
      setIsLoading(false);
    };

    login().then(
      () => {},
      () => {},
    );
  }, [isLoading]);

  return [{ response, error, isLoading }, doLogin];
};
