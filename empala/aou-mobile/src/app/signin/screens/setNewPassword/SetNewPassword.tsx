import { RouteProp } from '@react-navigation/native';
import { Formik } from 'formik';
import React, { useCallback, useEffect } from 'react';
import * as yup from 'yup';

import * as s from '~/app/signin/screens/module.styles';
import {
  SignInFields, SignInNavProps, SignInParamList, SignInScreens,
} from '~/app/signin/types';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { useAlert } from '~/components/hoc/withAlert';
import { Header } from '~/components/molecules/header';
import { ValidationBadges } from '~/components/molecules/validationBadges';
import { useApiCall } from '~/hooks/useApiCall';
import { usePasswordValidation } from '~/hooks/usePasswordValidation';
import { apiCallForgotPasswordSubmit } from '~/network/apiCalls';

export type RouteProps = RouteProp<SignInParamList, SignInScreens.SetNewPassword>;

type Props = {
  navigation: SignInNavProps;
  route: RouteProps;
};

type FormData = {
  [SignInFields.CODE]: string;
  [SignInFields.NEW_PASSWORD]: string;
};

export const SetNewPassword = ({ navigation, route }: Props): JSX.Element => {
  const alert = useAlert();
  const [{ response, isLoading, error }, processCall] = useApiCall(apiCallForgotPasswordSubmit);
  const { passwordValidationData, passwordValidationSchema } = usePasswordValidation();

  const validationSchema = useCallback(() => yup.object().shape({
    [SignInFields.CODE]: yup.string().required('Please enter recovery code here'),
    [SignInFields.NEW_PASSWORD]: passwordValidationSchema,
  }), [passwordValidationSchema]);

  useEffect(() => {
    if (response) {
      alert && alert({ title: 'Password updated successfully', message: 'Login with your new password' });
      navigation.navigate(SignInScreens.SignIn);
    }
  }, [response]);

  const toContinue = ({ code, newPassword }: FormData) => {
    const { email } = route.params;
    if (email && code && newPassword) processCall({ email, code, password: newPassword });
  };

  return (
    <s.Background>
      <Header title="Password reset" subtitle="You should receive an email with the code" />
      <Formik
        initialValues={{ } as FormData}
        onSubmit={toContinue}
        validationSchema={validationSchema}
        validateOnMount
      >
        {({
          handleChange, handleBlur, handleSubmit, values, errors, touched, isValid,
        }) => (
          <s.Form>
            <s.InputsContainer>
              <Input
                label="Code:"
                placeholder="Code from email"
                value={values[SignInFields.CODE]}
                onChangeText={handleChange(SignInFields.CODE)}
              />
              <Input
                label="Password:"
                placeholder="Password"
                autoCompleteType="password"
                textContentType="password"
                allowSecureTextEntry
                onChangeText={handleChange(SignInFields.NEW_PASSWORD)}
                value={values[SignInFields.NEW_PASSWORD]}
                error={(values?.newPassword?.length) > 0 ? errors?.newPassword : undefined}
              />
              <ValidationBadges data={passwordValidationData} />
            </s.InputsContainer>
            <s.ButtonContainer>
              <Button
                title="CONFIRM PASSWORD"
                face="primary"
                disabled={!isValid}
                loading={isLoading}
                onPress={handleSubmit}
              />
            </s.ButtonContainer>
          </s.Form>
        )}
      </Formik>
    </s.Background>
  );
};
