import React, { useCallback, useState } from 'react';
import { Alert, View } from 'react-native';

import { useCreateForgotTokenMutation, useResetPasswordMutation } from '../../../apollo/requests';
import { clearLogin, isLoginValid } from '../../../helpers/string';
import { useNavigation } from '../../../hooks/navigation';

import { AuthLayout } from '../../layouts/AuthLayout/AuthLayout';

import { Button } from '../../../components/buttons/Button/Button';
import { BackLink } from '../../../components/buttons/BackLink/BackLink';
import { DataChecker } from '../../../components/DataChecker/DataChecker';
import { InputFormItem } from '../../../components/inputs/InputFormItem/InputFormItem';

import { styles } from './ForgotPassword.style';

export const ForgotPassword = (): JSX.Element => {
  const navigation = useNavigation();
  const [mode, setMode] = useState<'send' | 'reset'>('send');
  const [login, setLogin] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [
    doCreateForgotToken,
    { loading: loadingSend, error: errorSend },
  ] = useCreateForgotTokenMutation();
  const [
    doResetPassword,
    { loading: loadingReset, error: errorReset },
  ] = useResetPasswordMutation();

  const isCurrentModeSend = mode === 'send';
  const onPressConfirm = useCallback(() => {
    if (isCurrentModeSend) {
      doCreateForgotToken({
        variables: {
          login: clearLogin(login),
        },
      }).then(response => {
        const num = response.data?.createForgotToken;

        if (num && Number.isFinite(num) && num > 0) {
          Alert.alert('Код выслан', 'Код восстановления пароля был выслан Вам', [
            {
              text: 'OK',
            },
          ]);
          setMode('reset');
        }
      });
    } else {
      doResetPassword({
        variables: {
          token,
          password,
          login: clearLogin(login),
        },
      }).then(response => {
        const num = response?.data?.resetPassword;

        if (num && Number.isFinite(num) && num > 0) {
          Alert.alert(
            'Пароль обновлён',
            'Пароль успешно обновлён, теперь Вы можете использовать новый пароль для входа в систему',
            [
              {
                text: 'Понятно',
              },
            ],
          );
          navigation.goBack();
        }
      });
    }
  }, [isCurrentModeSend, doCreateForgotToken, login, doResetPassword, token, password, navigation]);

  return (
    <AuthLayout key="container" title="Напомнить пароль">
      <View key="content" style={styles.content}>
        <View key="inputs">
          <InputFormItem
            key="email-or-phone"
            textContentType="telephoneNumber"
            placeholder="Эл. почта или телефон"
            keyboardType="email-address"
            style={styles.input}
            itemStyle={styles.inputItemStyle}
            error={!isLoginValid(login)}
            onChangeText={setLogin}
            required={true}
            autoCorrect={false}
            editable={isCurrentModeSend}
          />
          {!isCurrentModeSend ? (
            <InputFormItem
              key="token"
              placeholder="Код"
              style={styles.input}
              itemStyle={styles.inputItemStyle}
              onChangeText={setToken}
              required={true}
              autoCorrect={false}
            />
          ) : null}
          {!isCurrentModeSend ? (
            <InputFormItem
              key="password"
              placeholder="Новый пароль"
              style={styles.input}
              itemStyle={styles.inputItemStyle}
              onChangeText={setPassword}
              required={true}
              autoCorrect={false}
            />
          ) : null}
        </View>
        <Button
          key="confirm"
          style={styles.remindButton}
          disabled={
            (isCurrentModeSend ? !isLoginValid(login) : !token || !password) ||
            loadingSend ||
            loadingReset
          }
          title={isCurrentModeSend ? 'Напомнить' : 'Сохранить пароль'}
          onPress={onPressConfirm}
          loading={isCurrentModeSend ? loadingSend : loadingReset}
        />
      </View>
      <View
        key="data-checker"
        style={errorSend || errorReset ? styles.dataChecker : styles.dataCheckerEmpty}
      >
        <DataChecker
          loading={false}
          error={isCurrentModeSend ? errorSend : errorReset}
          loadingLabel=""
          noDataLabel=""
          useSimpleContainer={true}
        />
      </View>
      <BackLink key="link-back" title="Назад" />
    </AuthLayout>
  );
};
