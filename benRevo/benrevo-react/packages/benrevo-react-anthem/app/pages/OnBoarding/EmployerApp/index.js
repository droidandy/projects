import React from 'react';
import {
  EmployerApp,
} from '@benrevo/benrevo-react-onboarding';

class EmployerAppPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <EmployerApp
        {...this.props}
        urlName="anthem-blue-cross-employer-application"
      />
    );
  }
}

export default EmployerAppPage;
