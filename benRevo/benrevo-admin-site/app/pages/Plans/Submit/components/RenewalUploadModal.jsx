import React from 'react';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import { Modal, Button, Grid, Form, Header, Message, Icon } from 'semantic-ui-react';

class RenewalUploadModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    uploadQuote: PropTypes.func.isRequired,
  };

  uploadRenewalOnExisting(acceptedFiles, overwrite) {
    this.props.uploadQuote({ file: acceptedFiles, overwrite, category: 'medical' });
    this.props.modalClose();
  }

  render() {
    const { modalOpen, modalClose } = this.props;
    return (
      <Modal
        open={modalOpen}
        onClose={modalClose}
        className="quote-delete"
        dimmer="inverted"
        size="small"
      >
        <Modal.Content>
          <Grid stackable>
            <Grid.Row stretched className="header-main">
              <Grid.Column width={16}>
                <Message warning>
                  <Message.Header>
                    <Icon name="warning circle" />
                    You already have a quote uploaded for medical renewal!
                  </Message.Header>
                </Message>
                <Header as="h2">Please select an action </Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={16}>
                <Form>
                  <Form.Group>
                    <Dropzone onDrop={(acceptedFiles) => { this.uploadRenewalOnExisting(acceptedFiles, true); }} className="drop-zone" multiple activeClassName="active" rejectClassName="reject">
                      <Button primary fluid>
                        Overwrite Existing
                      </Button>
                    </Dropzone>
                    <Dropzone onDrop={(acceptedFiles) => { this.uploadRenewalOnExisting(acceptedFiles, false); }} className="drop-zone" multiple activeClassName="active" rejectClassName="reject">
                      <Button primary fluid>
                        Add onto existing
                      </Button>
                    </Dropzone>
                  </Form.Group>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default RenewalUploadModal;
