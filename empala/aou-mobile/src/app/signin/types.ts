import { StackNavigationProp } from '@react-navigation/stack';

export enum SignInScreens {
  SignIn = 'SignIn',
  ForgotPassword = 'ForgotPassword',
  SetNewPassword = 'SetNewPassword',
}

export enum SignInFields {
  EMAIL = 'email',
  CODE = 'code',
  NEW_PASSWORD = 'newPassword',
}

export type SignInParamList = {
  [SignInScreens.SignIn]: undefined;
  [SignInScreens.ForgotPassword]: undefined;
  [SignInScreens.SetNewPassword]: { email: string | undefined };
};

export type SignInNavProps = StackNavigationProp<SignInParamList>;
