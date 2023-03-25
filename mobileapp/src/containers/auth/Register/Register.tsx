import React, { Reducer, useReducer } from 'react';
import { View } from 'react-native';
import { ApolloError } from 'apollo-client';
import { RegisterMutationVariables, useRegisterMutation } from '../../../apollo/requests';
import { getErrorFromGQLError } from '../../../helpers/error';
import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';
import { InputFormItem } from '../../../components/inputs/InputFormItem/InputFormItem';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { BackLink } from '../../../components/buttons/BackLink/BackLink';
import { Button } from '../../../components/buttons/Button/Button';
import { styles } from './Register.style';
import { isMailValid, isPhoneValid } from '../../../helpers/string';
import { useSetToken } from '../../../contexts/auth-context';

interface RegisterState extends RegisterMutationVariables {
  error?: Error;
  networkError?: string;
}

type Action =
  | {
      type: 'name' | 'email' | 'personalPhone' | 'password' | 'SetNetworkError';
      payload: string;
    }
  | {
      type: 'SetError';
      payload: Error;
    };

const initialState: RegisterState = {
  name: '',
  email: '',
  personalPhone: '',
  password: '',
};

const reducer: Reducer<RegisterState, Action> = (state, action): RegisterState => {
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

export const Register = (): JSX.Element => {
  const [doRegister, { loading }] = useRegisterMutation();
  const setToken = useSetToken();
  const [stateRegister, dispatchRegister] = useReducer<typeof reducer>(reducer, initialState);
  const { name, email, personalPhone, password, networkError, error } = stateRegister;

  const handleRegister = async () => {
    try {
      const { networkError, error, ...variables } = stateRegister;
      const result = await doRegister({ variables });
      const token = result?.data?.register;

      if (typeof token === 'string' && token.length > 0) {
        await setToken(token);
      }
    } catch (e) {
      if (e instanceof ApolloError && e.graphQLErrors[0]) {
        dispatchRegister({
          type: 'SetNetworkError',
          payload: getErrorFromGQLError(e.graphQLErrors[0]),
        });
      }

      dispatchRegister({ type: 'SetError', payload: e });
      console.log(e);
    }
  };

  return (
    <AuthLayout key="container">
      <View key="content" style={styles.content}>
        <InputFormItem
          placeholder="Имя"
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void => dispatchRegister({ type: 'name', payload: text })}
          value={name}
          textContentType="name"
          keyboardType="name-phone-pad"
          required={true}
        />
        <InputFormItem
          placeholder="Эл. почта"
          autoCorrect={false}
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void => dispatchRegister({ type: 'email', payload: text })}
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          error={!email || !isMailValid(email)}
        />
        <InputFormItem
          placeholder="Телефон"
          autoCorrect={false}
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void =>
            dispatchRegister({ type: 'personalPhone', payload: text })
          }
          value={personalPhone}
          textContentType="telephoneNumber"
          keyboardType="phone-pad"
          error={!personalPhone || !isPhoneValid(personalPhone)}
        />
        <InputFormItem
          placeholder="Пароль"
          autoCorrect={false}
          style={styles.input}
          itemStyle={styles.inputItemStyle}
          onChangeText={(text: string): void =>
            dispatchRegister({ type: 'password', payload: text })
          }
          value={password}
          textContentType="password"
          secureTextEntry={true}
          keyboardType="visible-password"
          required={true}
        />
        <Button
          disabled={
            !name ||
            !email ||
            !isMailValid(email) ||
            !personalPhone ||
            !isPhoneValid(personalPhone) ||
            !password ||
            loading
          }
          title="Зарегистрироваться"
          style={styles.registerButton}
          onPress={handleRegister}
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
        <BackLink title="Назад" style={styles.loginButton} />
      </View>
    </AuthLayout>
  );
};
