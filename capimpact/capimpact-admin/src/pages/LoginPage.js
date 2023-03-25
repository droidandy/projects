import React from 'react';

import Paper from 'components/Paper';
import LoginForm from 'components/LoginForm';

const LoginPage = () => {
  return (
    <div className="d-flex align-items-center h-100">
      <div className="form-signin">
        <Paper>
          <h2 className="text-center">Admin Portal</h2>
          <LoginForm />
        </Paper>
      </div>
    </div>
  );
};

export default LoginPage;
