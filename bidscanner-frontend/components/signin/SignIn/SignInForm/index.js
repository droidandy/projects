// @flow
import React from 'react';
import { Field } from 'redux-form';
import { Box } from 'grid-styled';

import { Button } from 'components/styled/auth';

import Checkbox from 'components/forms-components/Checkbox';
import Input from 'components/forms-components/Input';

import InputWithForgot from 'components/signin/SignIn/SignInForm/InputWithForgot';

const SignInForm = ({ handleSubmit, submitting, error }) =>
  <form onSubmit={handleSubmit}>
    <Box>
      <Field name="email" component={Input} type="text" placeholder="Your email" value="" />
    </Box>
    <Box mt={1}>
      <Field name="password" component={InputWithForgot} type="password" placeholder="Your password" />
    </Box>
    <Box mt={1}>
      <Field name="stayConnected" component={Checkbox} type="checkbox" />
    </Box>
    {error}
    <Box>
      <Button type="submit" disabled={submitting}>
        Log In
      </Button>
    </Box>
  </form>;

export default SignInForm;
