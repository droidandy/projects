import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef } from 'react';
import * as yup from 'yup';

import * as s from '~/app/signin/screens/module.styles';
import { SignInFields, SignInNavProps, SignInScreens } from '~/app/signin/types';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { Header } from '~/components/molecules/header';
import { useApiCall } from '~/hooks/useApiCall';
import { apiCallForgotPassword } from '~/network/apiCalls';

type Props = {
  navigation: SignInNavProps;
};

type FormData = {
  [SignInFields.EMAIL]: string;
};

const validationSchema = yup.object().shape({
  [SignInFields.EMAIL]: yup.string().email('Please enter valid email').required('Email Address is Required'),
});

export const ForgotPassword = ({ navigation }: Props): JSX.Element => {
  const [{ response, isLoading, error }, processCall] = useApiCall<string, void>(apiCallForgotPassword);

  useEffect(() => {
    if (response) {
      navigation.navigate(
        SignInScreens.SetNewPassword, { email: formRef.current?.values[SignInFields.EMAIL] },
      );
    }
  }, [response]);

  const toContinue = ({ email }: FormData) => {
    if (email) processCall(email);
  };

  const formRef = useRef<FormikProps<FormData>>(null);

  return (
    <s.Background>
      <Header title="Password reset" subtitle="Enter your email to reset your password" />
      <Formik
        initialValues={{ } as FormData}
        onSubmit={toContinue}
        validationSchema={validationSchema}
        validateOnMount
        innerRef={formRef}
      >
        {({
          handleChange, handleBlur, handleSubmit, values, errors, touched, isValid,
        }) => (
          <s.Form>
            <s.InputsContainer>
              <Input
                label="Email:"
                placeholder="Email address"
                autoCompleteType="email"
                textContentType="emailAddress"
                value={values[SignInFields.EMAIL]}
                onChangeText={handleChange(SignInFields.EMAIL)}
              />
            </s.InputsContainer>
            <s.ButtonContainer>
              <Button
                title="RESET PASSWORD"
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
