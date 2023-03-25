// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import { Button } from 'components/styled/auth';
import styled from 'styled-components';
import Input from 'components/landing/Landing/SubscriptionForm/Input';

const StyledButton = styled(Button)`
  margin-top: 0;
  outline: none;
`;

export default ({ error, submitting, handleSubmit }) => (
  <form onSubmit={handleSubmit}>
    <Flex align="center" justify="center">
      <Field name="mail" component={Input} placeholder="Your Email" />
      {error}
      <Box ml={1}>
        <StyledButton type="submit" disabled={submitting}>
          Inform me
        </StyledButton>
      </Box>
    </Flex>
  </form>
);
