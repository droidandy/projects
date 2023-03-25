import React, { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { Alert, Button } from 'reactstrap';
import { Form } from 'lib/form';
import { TextField } from 'lib/form/fields';

import { loginAction } from 'api/actions';

import { loginSchema } from 'schemas';
import AuthService from 'services/auth';

const LoginForm = () => {
  let [error, setError] = useState(null);
  let history = useHistory();
  let location = useLocation();

  return (
    <Form
      action={[loginAction]}
      initialValues={{ email: 'john@doe.com', password: 's3cr3t' }}
      validationSchema={loginSchema}
      onSubmitSuccess={result => AuthService.onLogin(result, { location, history })}
      onSubmitFail={err => setError(err)}
    >
      {({ isSubmitting }) => (
        <React.Fragment>
          <TextField type="email" name="email" label="Email" />
          <TextField type="password" name="password" label="Password" />
          {error && <Alert color="danger">{error.error}</Alert>}
          <Button type="submit" color="primary" disabled={isSubmitting}>
            Login in
          </Button>
        </React.Fragment>
      )}
    </Form>
  );
};

export default LoginForm;
