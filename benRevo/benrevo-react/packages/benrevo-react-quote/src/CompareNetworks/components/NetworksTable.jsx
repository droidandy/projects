import React from 'react';
import PropTypes from 'prop-types';
import { Table, Grid, Header } from 'semantic-ui-react';
import CarrierLogo from './../../CarrierLogo';
import CompareNetworks from '../compareNetworksData';

class Networks extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    carrierName: PropTypes.string.isRequired,
    hideTitle: PropTypes.bool.isRequired,
    CarrierLogo: PropTypes.func,
  };

  render() {
    const { section, carrierName, hideTitle } = this.props;
    const Logo = this.props.CarrierLogo || CarrierLogo;
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
      <div className="comparison-page">
        { !hideTitle && <Header className="compare-networks-header" as="h1">Compare Networks</Header> }
        <Grid className="comparison-table">
          <Grid.Row className="row-fixed">
            <Table sortable celled fixed className="template-table">
              <Table.Body>
                <Table.Row className="header-row">
                  <Table.Cell> </Table.Cell>
                  { networks.map((network, index) =>
                    <Table.Cell key={index} className="network-name-cells">
                      <Logo carrier={network.name} quoteType={'STANDARD'} section={section} />
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="first-body-row">
                  { networks.map((network, index) =>
                    <Table.Cell key={index}>
                      { index === 0 && 'NETWORK' }
                      { index === 1 && 'NETWORK TYPE' }
                    </Table.Cell>
                  )}
                  <Table.Cell> </Table.Cell>
                </Table.Row>
                <Table.Row className="full-body-row fix-height">
                  <Table.Cell>
                    <div className="round full"></div>
                    Full
                  </Table.Cell>
                  { networks.map((network, index) =>
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'full' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="narrow-body-row">
                  <Table.Cell>
                    <div className="round narrow"></div>
                    Narrow
                  </Table.Cell>
                  { networks.map((network, index) =>
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'narrow' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="snarrow-body-row">
                  <Table.Cell>
                    <div className="round snarrow"></div>
                    Super Narrow
                  </Table.Cell>
                  { networks.map((network, index) =>
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'superNarrow' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="other-body-row">
                  <Table.Cell>
                    <div className="round other"></div>
                    Other
                  </Table.Cell>
                  { networks.map((network, index) =>
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'other' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
          <Grid.Row className="row-with-horizontal-scroll">
            <Table sortable celled fixed className="compare-table">
              <Table.Body>
                <Table.Row className="header-row">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index} className="network-name-cells">
                      <Logo carrier={network.name} quoteType={'STANDARD'} section={section} />
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="first-body-row">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index}> </Table.Cell>
                  )}
                  <Table.Cell> </Table.Cell>
                </Table.Row>
                <Table.Row className="full-body-row fix-height">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'full' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="narrow-body-row">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'narrow' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="snarrow-body-row">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'superNarrow' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
                <Table.Row className="other-body-row">
                  { networks.map((network, index) =>
                    index > 0 &&
                    <Table.Cell key={index}>
                      { network.types.map((type, ind) =>
                        type.network === 'other' &&
                        <p key={ind}>{type.name}</p>
                      )}
                    </Table.Cell>
                  )}
                </Table.Row>
              </Table.Body>
            </Table>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Networks;
