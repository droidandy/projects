// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Box } from 'grid-styled';
import { Button } from 'components/styled/auth';

import Input from 'components/forms-components/Input';

export default ({ error, submitting, handleSubmit }) =>
  <form onSubmit={handleSubmit}>
    <Box>
      <Field name="password" component={Input} type="password" placeholder="Choose a password" />
    </Box>
    <Box mt={1}>
      <Field name="confirmPassword" component={Input} type="password" placeholder="Confirm password" />
    </Box>
    {error}
    <Box>
      <Button type="submit" disabled={submitting}>
        Start Trading
      </Button>
    </Box>
  </form>;
