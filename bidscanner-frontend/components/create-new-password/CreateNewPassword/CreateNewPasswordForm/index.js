// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Box } from 'grid-styled';
import { Button } from 'components/styled/auth';

import Input from 'components/forms-components/Input';

export default ({ error, submitting, handleSubmit }) =>
  <form onSubmit={handleSubmit}>
    <Box>
      <Field name="password" component={Input} type="password" placeholder="choose password" />
    </Box>
    <Box mt={2}>
      <Field name="confirmPassword" component={Input} type="password" placeholder="confirm password" />
    </Box>
    {error}
    <Box mt={3} mb={3}>
      <Button type="submit" disabled={submitting}>
        Set New Password
      </Button>
    </Box>
  </form>;
