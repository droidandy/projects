// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Flex, Box } from 'grid-styled';
import { Title, Close } from 'components/styled/auth';
import Layout from 'components/Layout';
import Clear from 'material-ui/svg-icons/content/clear';
import Router from 'next/router';
import styled from 'styled-components';
import CreateNewPasswordFormContainer from 'containers/create-new-password/CreateNewPassword/CreateNewPasswordFormContainer';

import Logo from 'components/styled/Logo';

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

export default () => (
  <Layout title="Reset password step 2" showText>
    <div>
      <StyledDialog open onRequestClose={() => ({})}>
        <Flex direction="column" align="center">
          <Logo />
          <Title showForSmall>Reset your password</Title>
          <Box w={7 / 8}>
            <CreateNewPasswordFormContainer />
          </Box>
        </Flex>
        <Close onClick={() => Router.push('/general/home', '/')}>
          <Clear style={{ width: '30px', height: '30px', color: 'white' }} />
        </Close>
      </StyledDialog>
    </div>
  </Layout>
);
