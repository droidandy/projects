import React from 'react';
import { Alert } from 'src/components/Alert';
import { Button } from 'src/components/Button';
import { Input } from 'src/components/FormInput';
import { FormInput } from 'src/components/ReduxInput';
import styled from 'styled-components';
import { useActions } from 'typeless';
import { LoginFormActions, LoginFormProvider } from '../login-form';
import { getLoginState } from '../interface';
import { Trans, useTranslation } from 'react-i18next';
import { ErrorMessage } from 'src/components/ErrorMessage';

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 6% 2rem 1rem 2rem;
  background-image: url(${require('./bg.jpg')});
  ${Input} {
    margin-bottom: 20px;
  }
`;

const SubmitButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;

  ${Button} {
    height: 50px;
    padding-left: 2.5rem;
    padding-right: 2.5rem;
  }
`;

const Form = styled.form`
  width: 100%;
  max-width: 450px;
  margin: 0 auto;

  ${Input} {
    height: auto;
    padding: 0;
    margin: 0;
    background: none;
    border: none;

    input {
      height: 46px;
      border: none;
      padding-left: 1.5rem;
      padding-right: 1.5rem;
      margin-top: 1.5rem;
      background: rgba(235, 237, 242, 0.4);
    }
  }

  ${ErrorMessage} {
    font-weight: 500;
    font-size: 0.9rem;
    padding: 0 1.6rem;
  }
`;

const Logo = styled.div`
  text-align: center;
  margin: 0 auto 4rem auto;
  height: 80px;
  img {
    height: 100%;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  margin-bottom: 50px;
  font-weight: 500;
  color: #595d6e;
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
          <Logo>
            <img src={require('../../../../assets/adfd-logo-black.png')} />
          </Logo>
          <Title>{t('Sign In To PMP')}</Title>
          {error && (
            <Alert>
              <Trans>{error}</Trans>
            </Alert>
          )}
          <FormInput name="username" placeholder={t('Username')} />
          <FormInput
            name="password"
            placeholder={t('Password')}
            type="password"
          />
          <SubmitButtonWrapper>
            <Button elevate large loading={isLoading} styling="brand2">
              <Trans>Sign in</Trans>
            </Button>
          </SubmitButtonWrapper>
        </Form>
      </LoginFormProvider>
    </Wrapper>
  );
};
