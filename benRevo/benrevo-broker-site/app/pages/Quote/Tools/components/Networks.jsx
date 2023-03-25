import React from 'react';
import { Tab } from 'semantic-ui-react';
import { NetworksTable } from '@benrevo/benrevo-react-quote';
import { CarrierLogo } from '@benrevo/benrevo-react-match';

class NetworksTools extends React.Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    return (
      <Tab.Pane>
        <NetworksTable
          {...this.props}
          hideTitle
          CarrierLogo={CarrierLogo}
        />
      </Tab.Pane>
    );
  }
}

export default NetworksTools;
