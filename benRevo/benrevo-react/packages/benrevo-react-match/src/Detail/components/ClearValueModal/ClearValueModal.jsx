import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Button, Dropdown } from 'semantic-ui-react';
import CarrierLogo from './../../../components/CarrierLogo';

class ClearValueModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    clearValueModalOpen: PropTypes.bool.isRequired,
    closeAddPlanModal: PropTypes.func.isRequired,
    openedOption: PropTypes.object.isRequired,
    section: PropTypes.string.isRequired,
    networks: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    carrier: PropTypes.string.isRequired,
    detailedPlan: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.networkChange = this.networkChange.bind(this);
    this.state = {
      selectedNetworkId: null,
    };
  }

  closeModal(type) {
    const { selectedNetworkId } = this.state;
    const { detailedPlan, closeAddPlanModal } = this.props;
    if (type === 'add') {
      if (!selectedNetworkId) {
        return;
      }
      closeAddPlanModal(selectedNetworkId, detailedPlan);
    }
    closeAddPlanModal();
  }

  networkChange(value) {
    this.setState({ selectedNetworkId: value });
  }

  render() {
    const {
      clearValueModalOpen,
      openedOption,
      section,
      carrier,
      networks,
    } = this.props;
    const options = [];
    if (networks && networks.length) {
      networks.forEach((network) => {
        options.push({ key: network.id, text: network.name, value: network.id });
      });
    }
    return (
      <Modal
        className="dtp-clear-value clear-value-modal" // eslint-disable-line react/style-prop-objec
        open={clearValueModalOpen}
        onClose={this.closeModal}
        closeOnDimmerClick={false}
        closeIcon={<span className="close">X</span>}
      >
        <Modal.Content>
          <Grid stackable className="dtp-clear-value-inner">
            <Grid.Row>
              <Grid.Column width="6" className="dtp-clear-value-left" textAlign="left">
                { carrier &&
                <CarrierLogo carrier={carrier} section={section} quoteType={openedOption.quoteType} />
                }
                <h1>Add New Plan</h1>
                <div className="divider" />
                <Dropdown
                  fluid
                  onChange={(e, inputState) => { this.networkChange(inputState.value); }}
                  placeholder="Select network"
                  selection
                  options={options}
                />
                <Button onClick={() => this.closeModal('add')} primary size="small" fluid>Add New plan</Button>
                <span role="button" onClick={this.closeModal} className="cancel-link">Cancel</span>
              </Grid.Column>
              <Grid.Column width="10" className="dtp-clear-value-right">
                <Grid>
                  <Grid.Row>
                    <Grid.Column width="16">
                      <h2>Anthem Clear Value Guidelines:</h2>
                      <p>Clients cannot mix and match plans from the current Pool Portfolio and this Clear Value pool portfolio.
                        Clients in the Clear Value pool can only select from the Clear Value pool portfolio.</p>
                      <p><strong>Group Size:</strong>  Minimum 75 enrolled; max 500; experience will be evaluated at 250 to determine whether okay to quote.</p>
                      <p>Rates will not be negotiated.</p>
                      <p>Clear Value pool will not be offered alongside other carriers (including Kaiser).</p>
                      <p>Employer may offer a maximum # of 3 plan designs (1 PPO, 1 HMO, 1 HSA). High/Low plans and Dual networks are not available.</p>
                      <p>Anthem’s Act Wise will be the only solution for HSA administration and banking.</p>
                      <p><strong>Riders:</strong>  Coverage for Special Footwear is embedded. Infertility will be included as an option in the richest plan for each product type.
                        No riders for Hearing Aids or self-referred Chiro and Acupuncture.</p>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
      </Modal>
    );
  }
}

export default ClearValueModal;
