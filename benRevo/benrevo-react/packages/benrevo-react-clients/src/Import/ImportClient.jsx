import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Segment, Header, Button, Image, Modal, Input, Loader } from 'semantic-ui-react';
import Dropzone from 'react-dropzone';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { ImportIcon, ExportClient4 } from '@benrevo/benrevo-react-core';
import Navigation from '../components/Navigation';
import GAModal from '../components/GAModal';
import {
  RFP_STARTED,
} from '../constants';
class ImportClient extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    importClient: PropTypes.func.isRequired,
    info: PropTypes.func.isRequired,
    clientOverride: PropTypes.object,
    importLoading: PropTypes.bool,
    isGA: PropTypes.bool.isRequired,
    brokerages: PropTypes.array.isRequired,
    carrierName: PropTypes.string.isRequired,
  };

  constructor() {
    super();
    this.state = {
      gaModalOpen: false,
      importing: false,
      modalPage: 'page1',
      clientName: '',
      file: null,
      selectedGABrokerage: null,
      tempFiles: [],
    };

    this.addFiles = this.addFiles.bind(this);
    this.cancel = this.cancel.bind(this);
    this.chanePage = this.chanePage.bind(this);
    this.updateClientName = this.updateClientName.bind(this);
    this.reImport = this.reImport.bind(this);
    this.overrideClient = this.overrideClient.bind(this);
    this.gaModalToggle = this.gaModalToggle.bind(this);
  }

  get isGA() {
    return this.props.isGA;
  }

  importClient(acceptedFiles) {
    if (this.props.importLoading || !acceptedFiles.length) return;

    this.setState({ file: acceptedFiles[0] }, () => {
      if (this.isGA) {
        this.gaModalToggle();
      } else {
        this.addFiles();
      }
    });
  }

  addFiles(selectedGABrokerage) {
    if (this.isGA) {
      this.gaModalToggle();
      this.setState({ selectedGABrokerage });
    }

    this.setState({ importing: true });
    this.props.importClient(this.state.file, null, false, selectedGABrokerage);
  }

  cancel(importing) {
    this.setState({ importing, modalPage: 'page1', clientName: '' });
  }

  chanePage(page) {
    this.setState({ modalPage: page });
  }

  updateClientName(name) {
    this.setState({ clientName: name });
  }

  reImport() {
    this.props.importClient(this.state.file, this.state.clientName, false, this.state.selectedGABrokerage);
    this.cancel(true);
  }

  overrideClient() {
    if (this.props.clientOverride.clientState !== RFP_STARTED) {
      const notificationOpts = {
        message: 'You cannot override this client, as it already is in use.',
        position: 'tc',
        autoDismiss: 5,
      };
      this.props.info(notificationOpts);
      this.cancel();
    } else {
      this.props.importClient(this.state.file, null, true, this.state.selectedGABrokerage);
      this.cancel(true);
    }
  }

  gaModalToggle() {
    const close = !this.state.gaModalOpen;
    this.setState({ gaModalOpen: close });
  }

  render() {
    const { clientOverride, importLoading, carrierName } = this.props;
    const showGAFeatures = this.isGA;

    return (
      <div>
        <Helmet
          title="Import Client"
          meta={[
            { name: 'description', content: 'Description of Import Client' },
          ]}
        />
        <Navigation />
        <Grid stackable container className="clients clients-eximp section-wrap">
          <Grid.Column width={16}>
            <Grid stackable as={Segment} className="gridSegment">
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="page-heading-top">
                    <Header as="h1" className="page-heading">Importing the RFP</Header>
                  </div>
                  <div className="clients-description">You can import a completed client RFP from a BenRevo partner portal which can be used to complete RFPs on the {carrierName} portal.</div>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-action">
                <Grid.Column width={16}>

                  <Dropzone
                    disableClick={importLoading}
                    accept="text/xml"
                    maxSize={2097152}
                    onDrop={(acceptedFiles) => { this.importClient(acceptedFiles); }}
                    className="drop-zone"
                    multiple={false}
                    activeClassName="active"
                    rejectClassName="reject"
                  >
                    <Button disabled={importLoading} className="clients-button" primary><Image src={ImportIcon} /> Import Client</Button>
                  </Dropzone>

                  <Loader active={importLoading} indeterminate inline size="large" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="divider" />
                  <div className="clients-eximp-subheader">Instructions</div>
                  <div>For steps on how to export an RFP, see <Link to="/clients/export">Export Client</Link></div>
                </Grid.Column>

              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">1. Click the <b>Import Client</b> button</div>
                  <div className="clients-eximp-text">2. Choose the desired RFP file to <b>upload.</b></div>
                  <Image src={ExportClient4} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="clients-eximp-item">
                <Grid.Column width={16}>
                  <div className="clients-eximp-text">3. Your client will now appear on the <b>Clients</b> homepage</div>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
        <Modal
          className="client-override-modal" // eslint-disable-line react/style-prop-objec
          open={this.state.importing && clientOverride.clientName !== undefined}
          onClose={() => { this.cancel(); }}
          size={'small'}
        >
          <a role="button" tabIndex="0" className="close-modal" onClick={() => { this.cancel(); }}>X</a>
          <Modal.Content>
            <div className="client-override-modal-inner import">
              { this.state.modalPage === 'page1' &&
                <Grid stackable textAlign="center" centered className="page1">
                  <Grid.Row>
                    <Grid.Column textAlign="center">
                      <Header as="h1" className="page-heading">Looks like client “{clientOverride.clientName}” already exists.</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="client-override-modal-buttons">
                    <Grid.Column tablet={8} computer={7} largeScreen={6} textAlign="right">
                      <Button onClick={() => { this.chanePage('page2'); }} primary className="override-button violet"> Override Current Client</Button>
                    </Grid.Column>
                    <Grid.Column tablet={8} computer={7} largeScreen={6} textAlign="left">
                      <Button onClick={() => { this.chanePage('page3'); }} className="new-client-button" primary> Create New Client</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
              { this.state.modalPage === 'page2' &&
                <Grid stackable textAlign="center" centered className="page2">
                  <Grid.Row>
                    <Grid.Column textAlign="center">
                      <Header as="h1" className="page-heading">Are you sure you want to override existing client “{clientOverride.clientName}”?</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="client-override-modal-buttons">
                    <Grid.Column tablet={6} computer={5} largeScreen={4} textAlign="right">
                      <Button className="change-page-one" basic onClick={() => { this.chanePage('page1'); }}>Cancel</Button>
                    </Grid.Column>
                    <Grid.Column tablet={10} computer={9} largeScreen={8} textAlign="right">
                      <Button onClick={this.overrideClient} className="override-button violet"> Override Current Client</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
              { this.state.modalPage === 'page3' &&
                <Grid stackable textAlign="center" centered className="page3">
                  <Grid.Row>
                    <Grid.Column textAlign="center">
                      <Header as="h1" className="page-heading">Looks like client “{clientOverride.clientName}” already exists.</Header>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column textAlign="left" tablet={16} computer={14} largeScreen={12} className="client-override-modal-form">
                      <div>Enter new client name</div>
                      <Input
                        value={this.state.clientName}
                        onChange={(e, inputState) => { this.updateClientName(inputState.value); }}
                      />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column textAlign="left" tablet={16} computer={14} largeScreen={12}>
                      <div className="divider" />
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row className="client-override-modal-actions">
                    <Grid.Column tablet={6} computer={5} largeScreen={4} textAlign="right">
                      <Button className="change-page-one" basic onClick={() => { this.chanePage('page1'); }}>Cancel</Button>
                    </Grid.Column>
                    <Grid.Column tablet={10} computer={9} largeScreen={8} textAlign="center">
                      <Button disabled={!this.state.clientName} onClick={this.reImport} primary className="override-button"> Save</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              }
            </div>
          </Modal.Content>
        </Modal>
        { showGAFeatures && <GAModal className="gAModal" route={null} modalOpen={this.state.gaModalOpen} modalToggle={this.gaModalToggle} action={this.addFiles} brokerages={this.props.brokerages} /> }
      </div>
    );
  }
}

export default ImportClient;
