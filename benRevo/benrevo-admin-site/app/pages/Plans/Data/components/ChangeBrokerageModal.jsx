import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Grid, Dropdown, Header, TextArea, Checkbox } from 'semantic-ui-react';

class ChangeBrokerageModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    modalOpen: PropTypes.bool.isRequired,
    modalClose: PropTypes.func.isRequired,
    selectedClient: PropTypes.object.isRequired,
    selectedBrokerage: PropTypes.object.isRequired,
    brokerages: PropTypes.array.isRequired,
    changeBrokerage: PropTypes.func.isRequired,
    moveReason: PropTypes.string.isRequired,
    changeReason: PropTypes.func.isRequired,
    moveCheck: PropTypes.bool.isRequired,
    changeMoveCheck: PropTypes.func.isRequired,
    moveClient: PropTypes.func.isRequired,
    currentBroker: PropTypes.object.isRequired,
  };

  render() {
    const { moveClient, currentBroker, changeMoveCheck, moveCheck, changeReason, moveReason, modalClose, modalOpen, selectedClient, selectedBrokerage, brokerages, changeBrokerage } = this.props;
    const brokerList = brokerages.map((item) => ({
      key: item.id,
      value: item.id,
      text: item.name,
    }));
    return (
      <Modal className="summary-modal" open={modalOpen} size="large" >
        <a tabIndex="0" className="close-modal" onClick={() => { modalClose(); }}>X</a>
        <div className="header-main">
          <Header as="h2">Move Client to Another Brokerage</Header>
        </div>
        <Grid.Row className="modal-row">
          <Grid.Column width={2}>
            <Header as="h3" className="page-form-set-heading">Select new brokerage</Header>
            <Dropdown
              fluid
              placeholder="Select brokerage"
              search
              selection
              value={selectedBrokerage.id}
              options={brokerList}
              onChange={(e, inputState) => { changeBrokerage(brokerages.find((br) => br.id === inputState.value)); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="modal-row">
          <Grid.Column width={2}>
            <Header as="h3" className="page-form-set-heading">Reason</Header>
            <TextArea
              style={{ marginTop: 0 }}
              value={moveReason}
              rows={3}
              placeholder="Why are you moving the client?"
              onChange={(e, inputState) => { changeReason(inputState.value); }}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row className="modal-row" centered>
          <Grid.Column width="16">
            <Checkbox
              label="Check here to confirm you want to move this client to another brokerage"
              checked={moveCheck}
              onChange={(e, inputState) => { changeMoveCheck(inputState.checked); }}
            />
          </Grid.Column>
        </Grid.Row>
        <div className="buttons">
          <a tabIndex="0" className="cancel-button" onClick={() => { modalClose(); }}>Cancel</a>
          <Button disabled={!moveCheck} className="not-link-button" size="medium" primary onClick={() => { moveClient(currentBroker.id, selectedBrokerage.id, selectedClient.id, selectedBrokerage, moveReason); modalClose(); }}>Save</Button>
        </div>
      </Modal>
    );
  }
}

export default ChangeBrokerageModal;
