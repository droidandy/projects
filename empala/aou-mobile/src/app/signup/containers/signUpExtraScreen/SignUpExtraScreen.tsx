import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import React, {
  useCallback, useEffect, useState,
} from 'react';

import * as s from './signUpExtraScreenStyles';

import { TCButton } from '~/app/signup/components';
import { useOnboardingLoader } from '~/app/signup/hooks/useOnboardingLoader';
import { SignUpFormData, SubmitFields } from '~/app/signup/types';
import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { ErrorMessage } from '~/components/atoms/errorMessage';
import { Input } from '~/components/atoms/input';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from '~/components/molecules/stepIndicator';
import { CANNOT_CONFIRM_EMAIL, NOT_AUTHORIZED, useSignUp } from '~/network/useSignUp';
import { signin } from '~/store/auth';
import { useAppDispatch } from '~/store/hooks';

const notAuthorizesMessage = 'User already exists. You can login with your credentials';
const emailCorruptedMessage = 'Cannot confirm your email. Account canot be created';

type Props = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  meta: Meta;
  [SubmitFields.email]: string;
  [SubmitFields.password]: string;
};

export const SignUpExtraScreen = ({
  callback,
  title,
  subtitle,
  meta,
  [SubmitFields.email]: email,
  [SubmitFields.password]: password,
}: Props): JSX.Element => {
  const [formValues, setFormValues] = useState({} as SignUpFormData);
  const [errorText, setErrorText] = useState<string>();
  const [isNameFocused, setIsNameFocused] = useState<boolean>();
  const [isUserFocused, setIsUserFocused] = useState<boolean>();
  const [prevUser, setPrevUser] = useState<string>();
  const setLoading = useOnboardingLoader();

  const [{ response, error, isLoading }, doSignUp] = useSignUp();

  const toContinue = useCallback((values: SignUpFormData) => {
    setFormValues(values);
    doSignUp({ ...values, email, password });
  }, [doSignUp, email, password]);

  useEffect(() => {
    switch (error) {
      case NOT_AUTHORIZED:
        setErrorText(notAuthorizesMessage); break;
      case CANNOT_CONFIRM_EMAIL:
        setErrorText(emailCorruptedMessage); break;
      default:
        setErrorText(error);
    }
  }, [error]);

  useEffect(() => {
    if (response && response !== prevUser) {
      setPrevUser(response);
      callback?.({
        type: ActionTypes.NEXT_SCREEN,
        args: {
          ...formValues,
        },
      });
    }
  }, [response, callback, formValues, prevUser]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <>
      <s.Slide edges={['bottom', 'right', 'left']}>
        <s.KeyboardAvoidingViewContainer behavior="padding" keyboardVerticalOffset={15}>
          <Header title={title} subtitle={subtitle} />
          {errorText && (
            <s.ErrorMessage>
              <ErrorMessage
                label="User creation error"
                text={errorText}
              />
            </s.ErrorMessage>
          )}
          <Formik initialValues={{} as SignUpFormData} onSubmit={toContinue}>
            {({
              handleChange, handleBlur, handleSubmit, values, errors, touched, isValid,
            }) => (
              <s.Form>
                <s.Fields>
                  <s.FieldsContainer>
                    <Input
                      label="Full Name:"
                      placeholder="Full Name"
                      onChangeText={handleChange(SubmitFields.fullName)}
                      value={values[SubmitFields.fullName]}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                    />
                    <Input
                      label="Username:"
                      placeholder="@username"
                      onChangeText={handleChange(SubmitFields.user_name)}
                      value={values[SubmitFields.user_name]}
                      onFocus={() => setIsUserFocused(true)}
                      onBlur={() => setIsUserFocused(false)}
                    />
                  </s.FieldsContainer>
                  {errorText === notAuthorizesMessage
                    && <s.Link onPress={() => dispatch(signin())}>Login as existing user</s.Link>}
                </s.Fields>

                <Button disabled={false} title="Continue" loading={isLoading} face="primary" onPress={handleSubmit} />

                {!(isNameFocused || isUserFocused) && (
                  <s.TermsContainer>
                    <TCButton />
                  </s.TermsContainer>
                )}
              </s.Form>
            )}
          </Formik>
        </s.KeyboardAvoidingViewContainer>
      </s.Slide>
      <StepIndicator
        totalSteps={meta.totalScreens}
        activeIndex={meta.screenIndex}
        goPrevStep={goBack}
      />
    </>
  );
};
