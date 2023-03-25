// @flow
import React from 'react';
import { Flex, Box } from 'grid-styled';
import styled from 'styled-components';
import SubscriptionFormContainer from 'containers/subscription/Subscription/SubscriptionFormContainer';

const Title = styled.span`
  font-size: 30px;
  font-weight: bold;
`;

const SubscriptionFormWrapper = styled(Box)`padding-top: 65px;`;

export default () => (
  <Flex justify="center" direction="column" align="center">
    <Title>Buy and sell with one single account</Title>
    <SubscriptionFormWrapper>
      <SubscriptionFormContainer />
    </SubscriptionFormWrapper>
  </Flex>
);
