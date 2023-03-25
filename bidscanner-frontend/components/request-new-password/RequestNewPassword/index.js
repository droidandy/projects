// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import { Title, Close, StyledDialog } from 'components/styled/auth';
import Layout from 'components/Layout';
import Clear from 'material-ui/svg-icons/content/clear';
import Router from 'next/router';

import RequestNewPasswordFormContainer from 'containers/request-new-password/RequestNewPassword/RequestNewPasswordFormContainer';

import Logo from 'components/styled/Logo';

export default () => (
  <Layout title="Reset password Step 1" showText>
    <div>
      <StyledDialog open onRequestClose={() => ({})}>
        <Flex direction="column" align="center">
          <Logo />
          <Title showForSmall>Request a new password</Title>
          <Box w={5 / 6}>
            <RequestNewPasswordFormContainer />
          </Box>
        </Flex>
        <Close onClick={() => Router.push('/general/home', '/')}>
          <Clear style={{ width: '30px', height: '30px', color: 'white' }} />
        </Close>
      </StyledDialog>
    </div>
  </Layout>
);
