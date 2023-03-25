// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog';
import styled from 'styled-components';
import SignInFormContainer from 'containers/signin/SignIn/SignInFormContainer';

import Logo from 'components/styled/Logo';
import { Flex, Box } from 'grid-styled';
import { Title, BottomText, Close, MinorTitle, SocialButton, SwitchButton } from 'components/styled/auth';

import Clear from 'material-ui/svg-icons/content/clear';
import Google from '../../svg/google.svg';
import Facebook from '../../svg/facebook.svg';
import LinkedIn from '../../svg/linkedin.svg';

const StyledDialog = styled(Dialog).attrs({
  style: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  paperProps: {
    style: { borderRadius: '8px', width: 'calc(100% - 3em)', marginLeft: '1.5em' },
  },
  contentStyle: {
    width: '100%',
    minWidth: '360px',
  },
})``;

export default ({ onRequestClose, switchTo }) => (
  <StyledDialog open onRequestClose={onRequestClose}>
    <Flex direction="column" align="center">
      <Logo />
      <Title>Welcome back!</Title>
      <Box w={5 / 6}>
        <SignInFormContainer />
      </Box>
      <MinorTitle>or log in with:</MinorTitle>
      <Box w={5 / 6}>
        <SocialButton backgroundColor="#007FB1" noBorder>
          <LinkedIn />
        </SocialButton>
        <SocialButton backgroundColor="#F6F6F6">
          <Google />
        </SocialButton>
        <SocialButton backgroundColor="#3B5998" noBorder>
          <Facebook />
        </SocialButton>
      </Box>
      <BottomText>
        Need an account? <SwitchButton onClick={switchTo}>Register Free</SwitchButton>
      </BottomText>
    </Flex>
    <Close onClick={onRequestClose}>
      <Clear style={{ width: '30px', height: '30px', color: 'white' }} />
    </Close>
  </StyledDialog>
);
