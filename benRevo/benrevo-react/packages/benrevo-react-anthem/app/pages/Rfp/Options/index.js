import React from 'react';
import {
  Options,
} from '@benrevo/benrevo-react-rfp';

class OptionsPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Options
        {...this.props}
      />
    );
  }
}

export default OptionsPage;
