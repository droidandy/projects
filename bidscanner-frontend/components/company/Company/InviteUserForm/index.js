// @flow
import React from 'react';
import styled from 'styled-components';

import { Box, Flex } from 'grid-styled';
import { Field } from 'redux-form';
import BlackButton from 'components/styled/BlackButton';
import Input from 'components/forms-components/new/Input';

const Container = styled.form`text-align: center;`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 1.75em;
  margin-bottom: 1em;
`;

const FieldBox = styled(Flex).attrs({ mb: 1 })`
  text-align: left;
`;

const Error = styled(Box)`
  color: #ff2929;
  font-size: 12px;
`;

export default ({ handleSubmit, submitting, error }) => (
  <Container onSubmit={handleSubmit}>
    <Title>Invite User</Title>
    <FieldBox>
      <Field
        name="email"
        component={Input}
        type="text"
        placeholder="User Email"
        infoText="Info about this field"
      />
    </FieldBox>
    <Error p={1}>{error}</Error>
    <Box mt={2}>
      <BlackButton type="submit" disabled={submitting}>
        Invite
      </BlackButton>
    </Box>
  </Container>
);
