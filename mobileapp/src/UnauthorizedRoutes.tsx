import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import { Login } from './containers/auth/Login/Login';
import { Register } from './containers/auth/Register/Register';
import { Initialize } from './containers/auth/Initialize/Initialize';
import { ForgotPassword } from './containers/auth/ForgotPassword/ForgotPassword';

import { loginPath, registerPath, forgotPasswordPath, initializePath } from './configs/paths';
import {
  forgotPasswordRoute,
  initializeRoute,
  loginRoute,
  registerRoute,
} from './configs/routeName';

const AuthNavigator = createStackNavigator(
  {
    [loginRoute]: {
      screen: Login,
      path: loginPath,
      navigationOptions: {
        headerTitle: 'Вход',
      },
    },
    [forgotPasswordRoute]: {
      screen: ForgotPassword,
      path: forgotPasswordPath,
      navigationOptions: {
        headerTitle: 'Напомнить пароль',
      },
    },
    [registerRoute]: {
      screen: Register,
      path: registerPath,
      navigationOptions: {
        headerTitle: 'Регистрация',
      },
    },
    [initializeRoute]: {
      screen: Initialize,
      path: initializePath,
      navigationOptions: {
        headerTitle: 'Добро пожаловать',
      },
    },
  },
  {
    initialRouteName: initializeRoute,
    headerMode: 'none',
    navigationOptions: {
      headerVisible: false,
    },
  },
);

export const UnauthorizedRoutes = createAppContainer(AuthNavigator);
