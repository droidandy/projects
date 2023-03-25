import React from 'react';
import PropTypes from 'prop-types';
import {
  Info,
} from '@benrevo/benrevo-react-rfp';

class InfoPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Info
        { ...this.props }
        showPEPM
      />
    )
  }
}

export default InfoPage;
