// @flow
import React from 'react';
import styled from 'styled-components';
import { Field } from 'redux-form';
import { Flex, Box } from 'grid-styled';
import { Button } from 'components/styled/auth';

import Input from 'components/forms-components/Input';

const Name = styled(Flex)`
  input[name='firstName'] {
    border-radius: 4px 0 0 4px;
  }

  input[name='lastName'] {
    border-radius: 0 4px 4px 0;
  }

  @media (max-width: 500px) {
    margin-top: 5px;
  }
`;

export default ({ handleSubmit, submitting, error }) => (
  <Flex direction="flex-column">
    <form onSubmit={handleSubmit}>
      <Name justify="center">
        <Box w={1 / 2}>
          <Field name="firstName" component={Input} type="text" placeholder="First Name" />
        </Box>
        <Box w={1 / 2}>
          <Field name="lastName" component={Input} type="text" placeholder="Last Name" />
        </Box>
      </Name>
      <Box mt={1}>
        <Field name="email" component={Input} type="email" placeholder="Email" />
      </Box>
      {error}
      <Box mt={1}>
        <Button type="submit" disabled={submitting}>
          Register Free
        </Button>
      </Box>
    </form>
  </Flex>
);
