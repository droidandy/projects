import {
  useCallback, useEffect, useMemo, useState,
} from 'react';

import { apiCallResendCode, apiCallSignUp } from './apiCalls';
import { useLogin } from './useLogin';

import { BasicSubmitFields } from '~/app/signup/types';
import { useApiCall } from '~/hooks/useApiCall';

const COGNITO_SIGNUP_ERROR_PREFIX = 'PreSignUp failed with error ';
const EMAIL_EXISTS_MESSAGE = 'Email already exists';
export const NOT_AUTHORIZED = 'NotAuthorizedException';
export const USER_NOT_FOUND = 'UserNotFoundException';
export const CANNOT_CONFIRM_EMAIL = 'Cannot confirm email';

export const useSignUp = (): [
  { response: string | undefined, error: string | undefined, isLoading: boolean }, (data: BasicSubmitFields) => void,
] => {
  const [signupData, setSignupData] = useState<BasicSubmitFields>({});
  const [error, setError] = useState<string>();

  const [{
    response: signupResponse,
    error: signupError,
    isLoading: isSigningUp,
  }, doSignUp] = useApiCall(apiCallSignUp);
  const [{
    response: resendResponse,
    error: resendError,
    isLoading: isResendingCode,
  }, doResend] = useApiCall(apiCallResendCode);
  const [{ isLoading: isLoggingIn, error: loginError, response: loginResponse }, doLogin] = useLogin();

  const resultingResponse = useMemo(
    () => signupResponse?.userSub || (resendResponse as Record<string, unknown>)?.toString(),
    [signupResponse, resendResponse],
  );

  const reducedIsLoading = useMemo(
    () => isSigningUp || isResendingCode || isLoggingIn,
    [isSigningUp, isResendingCode, isLoggingIn],
  );

  const signUp = useCallback((data: BasicSubmitFields) => {
    setError(undefined);
    setSignupData(data);
    doSignUp(data);
  }, []);

  useEffect(() => {
    if (!signupError) return;

    const message = signupError.message as string || 'Unknown error';
    const errorText = message.startsWith(COGNITO_SIGNUP_ERROR_PREFIX)
      ? message.replace(COGNITO_SIGNUP_ERROR_PREFIX, '') : message;

    if (RegExp(EMAIL_EXISTS_MESSAGE).exec(errorText)) {
      const { email, password } = signupData;
      if (email && password) doLogin({ username: email, password });
    } else {
      setError(errorText);
    }
  }, [signupError, signupData]);

  useEffect(() => {
    if (!loginError) return;

    if (loginError.code === NOT_AUTHORIZED) {
      setError(NOT_AUTHORIZED);
    } else if (loginError.code === USER_NOT_FOUND && signupData.user_name) {
      doResend(signupData.user_name);
    } else {
      setError(loginError.message);
    };
  }, [loginError, signupData]);

  useEffect(() => {
    if (!resendError) return;

    if (resendError.code === USER_NOT_FOUND) setError(CANNOT_CONFIRM_EMAIL);
    else setError(resendError.message);
  }, [resendError]);

  return [{ response: resultingResponse, error, isLoading: reducedIsLoading }, signUp];
};
