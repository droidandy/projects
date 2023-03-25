import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Image } from 'semantic-ui-react';
import Helmet from 'react-helmet';
import { ExportIcon, ExportClient1, ExportClient2, ExportClient3, ExportClient4 } from '@benrevo/benrevo-react-core';
import Navigation from '../components/Navigation';

class ExportClient extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object,
    exportClient: PropTypes.func.isRequired,
    carrierName: PropTypes.string.isRequired,
  };

  render() {
    const { client, exportClient, carrierName } = this.props;

    return (
      <div>
        <Helmet
          title="Export Client"
          meta={[
            { name: 'description', content: 'Description of Export Client' },
          ]}
        />
        <Navigation client={client} />
        <Grid stackable container className="clients clients-eximp section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading">Exporting the RFP</Header>
                  </div>
                  <div className="clients-description">You can export a completed client RFP from the {carrierName} portal which can be used to complete RFPs on other BenRevo partner portals. </div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-action">
                <Grid.Column width={16}>
                  <Button disabled={!client.id} onClick={exportClient} className="clients-button" primary><Image src={ExportIcon} /> Export Client</Button>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="divider" />
                  <div className="clients-eximp-subheader">Instructions</div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">1. Click the <b>Export Client</b> button</div>
                  <div className="clients-eximp-text">2. The RFP will be <b>downloaded as a .xml file</b> on to your computer.</div>
                  <Image src={ExportClient1} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">3. Go to the desired BenRevo portal you wish to upload the RFP.</div>
                  <Image src={ExportClient2} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">4. From the Clients homepage <b>click Import Client.</b></div>
                  <Image src={ExportClient3} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">5. Choose the desired RFP file to <b>upload.</b></div>
                  <Image src={ExportClient4} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default ExportClient;
