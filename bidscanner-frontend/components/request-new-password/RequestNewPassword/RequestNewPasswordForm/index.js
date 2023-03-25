// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Box } from 'grid-styled';
import { Button } from 'components/styled/auth';

import Input from 'components/forms-components/Input';

export default ({ handleSubmit, submitting, error }) =>
  <form onSubmit={handleSubmit}>
    <Box mt={3}>
      <Field name="email" component={Input} type="text" placeholder="your email" />
    </Box>
    {error}
    <Box mt={3} mb={2}>
      <Button type="submit" disabled={submitting}>
        Reset Password
      </Button>
    </Box>
  </form>;
