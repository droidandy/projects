import React, { useState } from 'react';

import * as Styles from '~/app/signin/screens/module.styles';
import { SignInNavProps, SignInScreens } from '~/app/signin/types';
import * as s from '~/app/signup/containers/module.styles';
import { Button } from '~/components/atoms/button';
import { ErrorMessage } from '~/components/atoms/errorMessage';
import { Input } from '~/components/atoms/input';
import { LinkButton } from '~/components/atoms/linkButton';
import { useLogin } from '~/network/useLogin';
import { signup } from '~/store/auth';
import { useAppDispatch } from '~/store/hooks';

type Props = {
  navigation: SignInNavProps;
};

export const SignIn = ({ navigation }: Props): JSX.Element => {
  const dispatch = useAppDispatch();
  const [username, setUsername] = useState<string>('dalibi5144@bepureme.com');
  const [password, setPassword] = useState<string>('1qaz@WSX3edc');

  const [{ isLoading, error }, doLogin] = useLogin();
  const [isNameFocused, setIsNameFocused] = useState<boolean>();
  const [isUserFocused, setIsUserFocused] = useState<boolean>();

  const onPress = () => {
    if (username && password) doLogin({ username, password });
  };

  const onGetStartedPress = () => {
    dispatch(signup());
  };

  return (
    <Styles.Background>
      <s.KeyboardAvoidingViewContainer behavior="padding">
        <Styles.InputsContainer>
          <s.Label>Log in with an email</s.Label>

          <s.Text>Please provide your login details</s.Text>

          {error?.message && (
            <Styles.Message>
              <ErrorMessage
                label="Authentication error"
                text={error?.message || 'Incorrect authentication details'}
              />
            </Styles.Message>
          )}

          <s.Fields>
            <s.FieldsContainer>
              <Input
                label="Email:"
                placeholder="Your email address"
                autoCompleteType="email"
                textContentType="emailAddress"
                value={username}
                onChangeText={setUsername}
                onFocus={() => setIsNameFocused(true)}
                onBlur={() => setIsNameFocused(false)}
              />
              <Input
                label="Password:"
                placeholder="Password"
                autoCompleteType="password"
                textContentType="password"
                allowSecureTextEntry
                value={password}
                onChangeText={setPassword}
                onFocus={() => setIsUserFocused(true)}
                onBlur={() => setIsUserFocused(false)}
              />
            </s.FieldsContainer>

            <Styles.LinkButtonContainer>
              <LinkButton
                title="Forgot your password?"
                onPress={() => navigation.navigate(SignInScreens.ForgotPassword)}
              />
            </Styles.LinkButtonContainer>
          </s.Fields>
        </Styles.InputsContainer>

        <Styles.ButtonContainer>
          {!(isNameFocused || isUserFocused) && (
          <Styles.LinkButtonContainer>
            <LinkButton title="Create an account" onPress={onGetStartedPress} />
          </Styles.LinkButtonContainer>
          )}
          <Button title="LOGIN" face="primary" loading={isLoading} onPress={onPress} />
        </Styles.ButtonContainer>
      </s.KeyboardAvoidingViewContainer>
    </Styles.Background>
  );
};
