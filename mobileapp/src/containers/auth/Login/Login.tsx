import React, { Reducer, useReducer } from 'react';
import { View } from 'react-native';
import { ApolloError } from 'apollo-client';
import { LoginMutationVariables, useLoginMutation } from '../../../apollo/requests';
import { DEV_LOGIN, DEV_PASS } from '../../../configs/environments';
import { forgotPasswordRoute, registerRoute } from '../../../configs/routeName';
import { getErrorFromGQLError } from '../../../helpers/error';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { InputFormItem } from '../../../components/inputs/InputFormItem/InputFormItem';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { Button } from '../../../components/buttons/Button/Button';
import { Link } from '../../../components/buttons/Link/Link';
import { styles } from './Login.style';
import { useSetToken } from '../../../contexts/auth-context';

interface LoginState extends LoginMutationVariables {
  error?: Error;
  networkError?: string;
}

type Action =
  | {
      type: 'emailOrPhone' | 'password' | 'SetNetworkError';
      payload: string;
    }
  | {
      type: 'SetError';
      payload: Error;
    };

const initialState: LoginState = {
  emailOrPhone: DEV_LOGIN,
  password: DEV_PASS,
};

const reducer: Reducer<LoginState, Action> = (state, action): LoginState => {
  switch (action.type) {
    case 'SetError': {
      return {
        ...state,
        error: action.payload,
      };
    }
    case 'SetNetworkError': {
      return {
        ...state,
        networkError: action.payload,
      };
    }
    default: {
      return {
        ...state,
        error: undefined,
        networkError: undefined,
        [action.type]: action.payload,
      };
    }
  }
};

export const Login = (): JSX.Element => {
  const [doLogin, { loading }] = useLoginMutation();
  const setToken = useSetToken();

  const [stateLogin, dispatchLogin] = useReducer<typeof reducer>(reducer, initialState);
  const { emailOrPhone, password, networkError, error } = stateLogin;

  const handleLogin = async (): Promise<void> => {
    try {
      const result = await doLogin({ variables: { emailOrPhone, password } });
      const loginData = result?.data?.login;

      if (loginData) {
        await setToken(loginData);
      }
    } catch (e) {
      if (e instanceof ApolloError && e.graphQLErrors[0]) {
        dispatchLogin({
          type: 'SetNetworkError',
          payload: getErrorFromGQLError(e.graphQLErrors[0]),
        });
      }

      dispatchLogin({ type: 'SetError', payload: e });
      console.log(e);
    }
  };

  return (
    <AuthLayout key="container">
      <View key="content" style={styles.content}>
        <InputFormItem
          placeholder="Эл. почта"
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void =>
            dispatchLogin({ type: 'emailOrPhone', payload: text })
          }
          value={emailOrPhone}
          required={true}
        />
        <InputFormItem
          placeholder="Пароль"
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void => dispatchLogin({ type: 'password', payload: text })}
          value={password}
          textContentType="password"
          secureTextEntry={true}
          required={true}
        />
        <Button
          style={styles.loginButton}
          disabled={!emailOrPhone || !password || (loading && !error)}
          title="Войти"
          onPress={handleLogin}
          loading={loading}
        />
        <View
          key="data-checker"
          style={error || networkError ? styles.dataChecker : styles.dataCheckerEmpty}
        >
          <DataChecker
            loading={false}
            error={error ? error : networkError}
            loadingLabel=""
            noDataLabel=""
            useSimpleContainer={true}
          />
        </View>
        <View>
          <Link style={styles.registerLink} title="Зарегистрироваться" link={registerRoute} />
          <Link title="Забыли пароль?" link={forgotPasswordRoute} />
        </View>
      </View>
    </AuthLayout>
  );
};
