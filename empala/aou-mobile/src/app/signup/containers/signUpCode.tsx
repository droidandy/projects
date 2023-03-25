import { useNavigation } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';

import * as s from '~/app/signup/containers/module.styles';
import { SubmitFields } from '~/app/signup/types';
import { prepareUserInput } from '~/app/signup/utils';
import { CallbackType, Meta } from '~/components/StepContainer/types';
import { Button } from '~/components/atoms/button';
import { ErrorMessage } from '~/components/atoms/errorMessage';
import { Input } from '~/components/atoms/input';
import { Header } from '~/components/molecules/header';
import { StepIndicator } from '~/components/molecules/stepIndicator';
import { useSubmit } from '~/network/useSubmit';

type Props = {
  callback?: CallbackType;
  title: string;
  subtitle: string;
  meta: Meta;
  [SubmitFields.user_name]: string;
  [SubmitFields.password]: string;
};

export const SignUpCodeScreen = ({
  callback,
  title,
  subtitle,
  meta,
  [SubmitFields.user_name]: username,
  [SubmitFields.password]: password,
  ...rest
}: Props): JSX.Element => {
  const [code, setCode] = useState('');
  const [submit, isLoading, submitError] = useSubmit();

  const toContinue = useCallback(() => {
    submit({
      verificationCode: code, username, password, data: prepareUserInput(rest),
    });
  }, [code, submit, username, password, rest]);

  const navigation = useNavigation();
  const goBack = () => navigation.goBack();

  return (
    <>
      <s.KeyboardAvoidingViewContainer behavior="padding">
        <s.Slide edges={['bottom', 'right', 'left']}>
          <Header title={title} subtitle={subtitle} />
          <s.Form>
            {Boolean(submitError) && (
              <s.ErrorMessage>
                <ErrorMessage
                  label={submitError?.replace(/, please try again./i, '')}
                  text="Please try again"
                />
              </s.ErrorMessage>
            )}
            <s.Fields>
              <Input
                label="Code"
                placeholder="Code from email"
                value={code}
                onChangeText={setCode}
              />
            </s.Fields>
          </s.Form>

          <s.ButtonContainer>
            <Button
              title="CONTINUE"
              face="primary"
              loading={isLoading}
              disabled={code.length === 0}
              onPress={toContinue}
            />
          </s.ButtonContainer>
        </s.Slide>
      </s.KeyboardAvoidingViewContainer>
      <StepIndicator
        totalSteps={meta.totalScreens}
        activeIndex={meta.screenIndex}
        goPrevStep={goBack}
      />
    </>
  );
};
