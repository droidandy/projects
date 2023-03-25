import React from 'react';
import {
  Info,
} from '@benrevo/benrevo-react-rfp';

class InfoPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Info
        { ...this.props }
        showPEPM={false}
      />
    )
  }
}

export default InfoPage;
