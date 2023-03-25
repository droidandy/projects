import { Formik } from 'formik';
import React, { useState, useCallback } from 'react';
import * as yup from 'yup';

import { PASSWORD_CHECKLIST } from '../constants';
import { SignUpFormData, SubmitFields } from '../types';

import * as s from './module.styles';

import { TCButton } from '~/app/signup/components';
import { ActionTypes, CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { Input } from '~/components/atoms/input';
import { Header } from '~/components/molecules/header';
import { ValidationBadges } from '~/components/molecules/validationBadges';
import { ChecklistItem } from '~/components/molecules/validationBadges/types';
import { StepIndicator } from "~/components/molecules/stepIndicator";
import { useNavigation } from "@react-navigation/native";

type Props = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  meta: Meta;
};

const validatePassword = (value: string | undefined) => PASSWORD_CHECKLIST.map((checklistItem) => ({
  ...checklistItem,
  ok: Boolean(value && checklistItem.pattern.test(value)),
}));

export const SignUpScreen = ({ callback, title, subtitle, meta }: Props): JSX.Element => {
  const [passwordValidationData, setPasswordValidationData] = useState<ChecklistItem[]>(validatePassword(''));
  const [isNameFocused, setIsNameFocused] = useState<boolean>();
  const [isUserFocused, setIsUserFocused] = useState<boolean>();

  const isValidPassword = (password: string | undefined) => {
    const validationResult = validatePassword(password);
    setPasswordValidationData(validationResult);
    return validationResult.every((item) => item.ok);
  };

  const signupValidationSchema = useCallback(
    () => yup.object().shape({
      email: yup.string().email('Please enter valid email').required('Email Address is Required'),
      password: yup.string().test('passwordValidation', 'Invalid password', isValidPassword),
    }),
    [isValidPassword],
  );

  const toContinue = useCallback((values: SignUpFormData) => {
    callback?.({
      type: ActionTypes.NEXT_SCREEN,
      args: {
        ...values,
      },
    });
  }, [callback]);

  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <>
      <s.Slide edges={['bottom', 'right', 'left']}>
        <Header title={title} subtitle={subtitle} showSubtitle={!(isNameFocused || isUserFocused)} />
        <s.KeyboardAvoidingViewContainer behavior="padding" keyboardVerticalOffset={15}>
          <Formik
            initialValues={{} as SignUpFormData}
            onSubmit={toContinue}
            validationSchema={signupValidationSchema}
            validateOnMount
          >
            {({
              handleChange,
              handleSubmit,
              values,
              errors,
              isValid,
            }) => (

              <s.Form>
                <s.Fields>
                  <s.FieldsContainer>
                    <Input
                      label="Email:"
                      placeholder="Your email address"
                      autoCompleteType="email"
                      textContentType="emailAddress"
                      onChangeText={handleChange(SubmitFields.email)}
                      value={values[SubmitFields.email]}
                      error={values?.email?.length > 0 ? errors?.email : undefined}
                      onFocus={() => setIsNameFocused(true)}
                      onBlur={() => setIsNameFocused(false)}
                    />
                    <Input
                      label="Password:"
                      placeholder="Password"
                      autoCompleteType="password"
                      textContentType="password"
                      allowSecureTextEntry
                      onChangeText={handleChange(SubmitFields.password)}
                      value={values[SubmitFields.password]}
                      error={values?.password?.length > 0 ? errors?.password : undefined}
                      onFocus={() => setIsUserFocused(true)}
                      onBlur={() => setIsUserFocused(false)}
                    />
                  </s.FieldsContainer>

                  <ValidationBadges data={passwordValidationData} />
                </s.Fields>

                <Button disabled={!isValid} title="Continue" face="primary" onPress={handleSubmit} />

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
