// @flow
import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Flex, Box } from 'grid-styled';
import { Title, Close, SmallText, Terms } from 'components/styled/auth';
import { Link } from 'next-url-prettifier';
import Layout from 'components/Layout';
import Clear from 'material-ui/svg-icons/content/clear';
import Router from 'next/router';
import styled from 'styled-components';
import CompleteAccountFormContainer from 'containers/complete-account/CompleteAccount/CompleteAccountFormContainer';

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
  <Layout title="Complete Account" showText>
    <div>
      <StyledDialog open onRequestClose={() => ({})}>
        <Flex direction="column" align="center">
          <Logo />
          <Title>Choose a password</Title>
          <Box w={5 / 6}>
            <CompleteAccountFormContainer />
          </Box>
          <SmallText>
            By registering you confirm that you have read and<br /> accepted our{' '}
            <Terms>
              <Link href="/general/termofuse" as="/termofuse">
                <a>Terms and Conditions</a>
              </Link>
            </Terms>
          </SmallText>
        </Flex>
        <Close onClick={() => Router.push('/general/home', '/')}>
          <Clear style={{ width: '30px', height: '30px', color: 'white' }} />
        </Close>
      </StyledDialog>
    </div>
  </Layout>
);
