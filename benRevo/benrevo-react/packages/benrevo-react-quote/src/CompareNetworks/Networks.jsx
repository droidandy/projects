import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button } from 'semantic-ui-react';
import CompareNetworks from './compareNetworksData';
import NetworksTable from './components/NetworksTable';

class Networks extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    carrierName: PropTypes.string.isRequired,
    openedOption: PropTypes.object.isRequired,
    changePage: PropTypes.func.isRequired,
  };

  render() {
    const { section, openedOption, changePage, carrierName } = this.props;
    let networks = [];
    if (CompareNetworks.networks && CompareNetworks.networks.length > 0) {
      let key = 0;
      let val = CompareNetworks.networks[0];
      CompareNetworks.networks.forEach((network, i) => {
        if (network.name.indexOf(carrierName) !== -1) {
          key = i;
          val = network;
        }
      });
      networks = CompareNetworks.networks;
      networks[key] = networks[0];
      networks[0] = val;
    }
    return (
      <div>
        <div className="breadcrumb">
          <a onClick={() => { changePage(section, 'Options'); }}>{section} Options</a>
          <span>{' > '}</span>
          <a onClick={() => { changePage(section, 'Overview'); }}>{openedOption.name}</a>
          <span>{' > '}</span>
          <a>Compare Networks</a>
        </div>
        <div className="divider"></div>
        <NetworksTable section={section} carrierName={carrierName} />
        <div className="divider"></div>

        <Grid stackable className="buttonRow">
          <Grid.Row>
            <Grid.Column width={16} textAlign="right">
              <Button size="big" primary onClick={() => { changePage(section, 'Overview'); }}>Back to Overview</Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Networks;
