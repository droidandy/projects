import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'semantic-ui-react';

class StatusChangeModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    handleStatusChange: PropTypes.func.isRequired,
    stateOfInterest: PropTypes.string.isRequired,
    selectedClient: PropTypes.object.isRequired,
  };

  render() {
    const { modalClose, modalOpen, handleStatusChange, stateOfInterest, selectedClient } = this.props;
    return (
      <Modal
        open={modalOpen}
        onClose={modalClose}
        className="status-modal"
        dimmer="inverted"
        size="tiny"
      >
        <Modal.Content>
          <a tabIndex="0" className="close-modal" onClick={() => { modalClose(); }}>X</a>
          <p className="details">Are you sure you want to change {selectedClient.clientName} status from <b>{selectedClient.clientState}</b> to <b>{stateOfInterest}</b>?</p>
          <div className="buttons">
            <a tabIndex="0" className="cancel-button" onClick={() => { modalClose(); }}>Cancel</a>
            <Button className="not-link-button" size="medium" primary onClick={() => { handleStatusChange(stateOfInterest, selectedClient.id); modalClose(); }}>Change Status</Button>
          </div>
        </Modal.Content>
      </Modal>
    );
  }
}

export default StatusChangeModal;
