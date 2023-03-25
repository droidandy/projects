// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog';
import styled from 'styled-components';
import { Link } from 'next-url-prettifier';

import { Flex, Box } from 'grid-styled';
import {
  Title,
  BottomText,
  Close,
  MinorTitle,
  SocialButton,
  SmallText,
  Terms,
  SwitchButton,
} from 'components/styled/auth';
import Logo from 'components/styled/Logo';

import SignUpFormContainer from 'containers/signup/SignUp/SignUpFormContainer';

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
  },
})``;

export default ({ onRequestClose, switchTo, data: { oauth_providers } }) => {
  const facebook = oauth_providers ? oauth_providers.edges.filter(o => o.description === 'Facebook') : [];
  const linkedin = oauth_providers ? oauth_providers.edges.filter(o => o.description === 'LinkedIn') : [];
  const google = oauth_providers ? oauth_providers.edges.filter(o => o.description === 'Google') : [];

  return (
    <StyledDialog open onRequestClose={onRequestClose}>
      <Flex direction="column" align="center">
        <Logo />
        <Title>Welcome to tradekoo!</Title>
        <Box w={4 / 6}>
          <SignUpFormContainer />
        </Box>
        <MinorTitle>or register with:</MinorTitle>
        <Box w={4 / 6}>
          <SocialButton
            backgroundColor="#007FB1"
            noBorder
            onClick={() => {
              if (linkedin.length > 0 && process.browser) {
                window.top.location = linkedin[0].authorization_url;
              }
            }}
          >
            <LinkedIn />
          </SocialButton>
          <SocialButton
            backgroundColor="#F6F6F6"
            onClick={() => {
              if (google.length > 0 && process.browser) {
                window.top.location = google[0].authorization_url;
              }
            }}
          >
            <Google />
          </SocialButton>
          <SocialButton
            backgroundColor="#3B5998"
            noBorder
            onClick={() => {
              if (facebook.length > 0 && process.browser) {
                window.top.location = facebook[0].authorization_url;
              }
            }}
          >
            <Facebook />
          </SocialButton>
        </Box>
        <SmallText>
          By registering you confirm that you have read and<br /> accepted our{' '}
          <Terms>
            <Link href="/general/termofuse">
              <a>Terms and Conditions</a>
            </Link>
          </Terms>
        </SmallText>
        <BottomText>
          Have an account? <SwitchButton onClick={switchTo}>Log In</SwitchButton>
        </BottomText>
      </Flex>
      <Close onClick={onRequestClose}>
        <Clear style={{ width: '30px', height: '30px', color: 'white' }} />
      </Close>
    </StyledDialog>
  );
};
