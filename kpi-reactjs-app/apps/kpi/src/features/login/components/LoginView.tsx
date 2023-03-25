import React from 'react';
import { Alert } from 'src/components/Alert';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/FormInput';
import { FormInput } from 'src/components/ReduxInput';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { LoginFormActions, LoginFormProvider } from '../login-form';
import { getLoginState } from '../interface';
import { LangDropdown } from 'src/components/LangDropdown';
import { Trans, useTranslation } from 'react-i18next';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;

  ${Input} {
    margin-bottom: 20px;
  }
`;

const Right = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const Form = styled.form`
  width: 100%;
  max-width: 450px;
  padding: 15px;
  margin: auto;
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 50px;
  font-weight: 400;
  color: #67666e;
  text-align: center;
`;

export const LoginView = () => {
  const { submit } = useActions(LoginFormActions);
  const { isLoading, error } = getLoginState.useState();
  const { t } = useTranslation();

  return (
    <Wrapper>
      <LoginFormProvider>
        <Form
          onSubmit={e => {
            e.preventDefault();
            submit();
          }}
        >
          <Title>
            <Trans>Sign in</Trans>
          </Title>
          {error && (
            <Alert>
              <Trans>{error}</Trans>
            </Alert>
          )}
          <FormInput
            name="username"
            placeholder={t('Username')}
            label={t('Username')}
          />
          <FormInput
            name="password"
            placeholder={t('Password')}
            label={t('Password')}
            type="password"
          />
          <Right>
            <Button large loading={isLoading}>
              <Trans>Sign in</Trans>
            </Button>
          </Right>
        </Form>
      </LoginFormProvider>

      <LangDropdown />
    </Wrapper>
  );
};
