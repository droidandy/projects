import { ISignUpResult } from 'amazon-cognito-identity-js';
import { Auth } from 'aws-amplify';

import { MOCKED_PHONE_NUMBER } from '~/app/signup/constants';
import { BasicSubmitFields } from '~/app/signup/types';

export const apiCallForgotPassword = (email: string): Promise<any> => Auth.forgotPassword(email);

export const apiCallForgotPasswordSubmit = (
  { email, code, password }: { email: string, code: string, password: string },
): Promise<Record<string, unknown>> => Auth.forgotPasswordSubmit(email, code, password).then((resp) => ({}));

export const apiCallSignUp = ({
  user_name, password, email, fullName,
}: BasicSubmitFields): Promise<ISignUpResult> => Auth.signUp({
  username: user_name || '',
  password: password || '',
  attributes: {
    email,
    name: fullName,
    phone_number: MOCKED_PHONE_NUMBER,
  },
});

export const apiCallResendCode = (email: string): Promise<any> => Auth.resendSignUp(email);
