import React from 'react';
import PropTypes from 'prop-types';
import { Button, Modal } from 'semantic-ui-react';
import AddCarrierContent from '../../../../components/AddCarrier';

class AddCarrierModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    openModal: PropTypes.bool.isRequired,
    closeModal: PropTypes.func.isRequired,
    addCarrier: PropTypes.func.isRequired,
    carriers: PropTypes.object.isRequired,
    products: PropTypes.object.isRequired,
    selectedCarriers: PropTypes.object.isRequired,
    selectCarrier: PropTypes.func.isRequired,
  };
  render() {
    const {
      openModal,
      closeModal,
      addCarrier,
      selectCarrier,
      selectedCarriers,
      carriers,
      products,
    } = this.props;
    // console.log('AddCarrierModal props', this.props);
    return (
      <Modal
        open={openModal}
        className="add-carrier-modal"
        onClose={closeModal}
        closeIcon={<span className="close">X</span>}
      >
        <Modal.Header>Who did you send RFPs to or plan to send to?</Modal.Header>
        <Modal.Content scrolling>
          <AddCarrierContent
            selectCarrier={selectCarrier}
            selectedCarriers={selectedCarriers}
            carriers={carriers}
            hideMedical={!products.medical}
            hideDental={!products.dental}
            hideVision={!products.vision}
            hideLife={!products.life}
            hideLtd={!products.ltd}
            hideStd={!products.std}
            hideVolLife
            hideVolLtd
            hideVolStd
          />
        </Modal.Content>
        <Modal.Actions>
          <Button basic size="big" className="cancel-modal-button" onClick={closeModal}>Cancel</Button>
          <Button size="big" className="blue" onClick={addCarrier}>Save & Continue</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default AddCarrierModal;

