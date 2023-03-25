import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Button, Grid } from 'semantic-ui-react';


class RenewalModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    discount: PropTypes.object.isRequired,
    closeModal: PropTypes.func.isRequired,
    continueModal: PropTypes.func.isRequired,
  };

  render() {
    const { isOpen, closeModal, discount, continueModal } = this.props;
    const { dentalRenewalDiscountPenalty, visionRenewalDiscountPenalty } = discount;
    let products = '';

    if (dentalRenewalDiscountPenalty && visionRenewalDiscountPenalty) products = 'Dental and Vision';
    else if (dentalRenewalDiscountPenalty) products = 'Dental';
    else if (visionRenewalDiscountPenalty) products = 'Vision';

    return (
      <Modal
        className="presentation-renewal-modal"
        open={isOpen}
        dimmer="inverted"
        size="small"
      >
        <a role="button" tabIndex="0" className="close-modal" onClick={closeModal}>X</a>
        <Modal.Content>
          <Grid stackable>
            <Grid.Row stretched>
              <Grid.Column width={16}>
                <Header className="presentation-renewal-modal-header" as="h2">Specialty Discount Notice</Header>
              </Grid.Column>
              <Grid.Column width={16}>
                <div>You have removed <b>{products}</b> from the final selections. Since the medical renewal rates include bundling with {products}, <b>the medical renewal rates will be increased by {dentalRenewalDiscountPenalty + visionRenewalDiscountPenalty}%</b> if you proceed.</div>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row centered>
              <Grid.Column width={4}>
                <Button onClick={closeModal} basic fluid>Cancel</Button>
              </Grid.Column>
              <Grid.Column width={6}>
                <Button onClick={continueModal} primary fluid>Continue</Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default RenewalModal;
