import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Grid } from 'semantic-ui-react';

class EnrollmentModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    open: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
  };

  render() {
    const { open, closeModal } = this.props;
    return (
      <Modal
        className="client-ga-modal"
        open={open}
        onClose={closeModal}
        size={'small'}
        closeIcon={<span className="close">X</span>}
      >
        <Modal.Content>
          <Grid stackable>
            <Grid.Row>
              <Grid.Column>
                <Header as="h1" className="page-heading">How do I add projected enrollment?</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={1}>
                <span>1.</span>
              </Grid.Column>
              <Grid.Column width={7}>
                <span>Within Medical Options section, click the Option in which you would like to add proposed enrollement.</span>
              </Grid.Column>
              <Grid.Column width={8} textAlign="right">
                <div className="virginEnrImage1"></div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={1}>
                <span>2.</span>
              </Grid.Column>
              <Grid.Column width={7}>
                <span>Within the Contribution tab enter the Proposed Enrollment.</span>
              </Grid.Column>
              <Grid.Column width={8} textAlign="right">
                <div className="virginEnrImage2"></div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default EnrollmentModal;
