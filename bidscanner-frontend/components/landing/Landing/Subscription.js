// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import SubscriptionFormContainer from 'containers/landing/Landing/SubscriptionFormContainer';

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const Wrapper = styled(Flex)`margin-top: 200px;`;

const SubscriptionFormWrapper = styled(Box)`padding-top: 65px;`;

export default () => (
  <Wrapper justify="center" direction="column" align="center">
    <Title>Buy and sell with one single account</Title>
    <SubscriptionFormWrapper>
      <SubscriptionFormContainer />
    </SubscriptionFormWrapper>
  </Wrapper>
);
