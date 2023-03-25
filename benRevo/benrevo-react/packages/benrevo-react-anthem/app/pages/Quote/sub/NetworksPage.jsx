import React from 'react';
import {
  Networks,
} from '@benrevo/benrevo-react-quote';
import { carrierName } from '../../../config'

class NetworksPage extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Networks
        { ...this.props }
        carrierName={carrierName}
      />
    )
  }
}

export default NetworksPage;
