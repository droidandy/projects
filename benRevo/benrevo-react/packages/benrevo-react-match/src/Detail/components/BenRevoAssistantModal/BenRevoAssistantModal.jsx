import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Header, Grid, Table, Button } from 'semantic-ui-react';
import PlanNetworksDropdown from './../PlanNetworksDropdown';
import WarningCard from '../../../components/WarningCard';

class BenRevoAssistantModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    section: PropTypes.string.isRequired,
    // violationNotification: PropTypes.bool.isRequired,
    closeViolationModal: PropTypes.func.isRequired,
    contributions: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]).isRequired,
    openedOption: PropTypes.object.isRequired,
    modalOpened: PropTypes.bool,
    multiMode: PropTypes.bool.isRequired,
    changeOptionNetwork: PropTypes.func.isRequired,
    addNetwork: PropTypes.func.isRequired,
    // page: PropTypes.object.isRequired,
  };

  static defaultProps = {
    modalOpened: false,
  };

  constructor(props) {
    super(props);
    this.networkChange = this.networkChange.bind(this);
    this.saveChanges = this.saveChanges.bind(this);
    this.state = {
      actions: {},
    };
  }

  networkChange(networkId, detailedPlan, index) {
    const {
      multiMode,
      changeOptionNetwork,
      addNetwork,
      section,
      openedOption,
    } = this.props;
    const { actions } = this.state;
    // existed tab = change network, new tab = add network
    if (detailedPlan && Object.keys(detailedPlan).length > 0 && detailedPlan.rfpQuoteOptionNetworkId) {
      actions[index] = () => changeOptionNetwork(section, openedOption.id, networkId, detailedPlan.rfpQuoteOptionNetworkId);
      // changeOptionNetwork(section, openedOption.id, networkId, detailedPlan.rfpQuoteOptionNetworkId);
    } else {
      // section, optionId, rfpQuoteNetworkId or networkId, clientPlanId === plan.currentPlan.planId
      if (multiMode) {
        actions[index] = () => addNetwork(section, openedOption.id, networkId, detailedPlan.currentPlan.planId);
        // addNetwork(section, openedOption.id, networkId, detailedPlan.currentPlan.planId);
      } else {
        actions[index] = () => addNetwork(section, openedOption.id, networkId, null);
        // addNetwork(section, openedOption.id, networkId, null);
      }
    }
    this.setState({ actions });
  }

  saveChanges() {
    const { actions } = this.state;
    Object.values(actions).forEach((action) => {
      action();
    });
  }

  render() {
    const {
      // violationNotification,
      section,
      openedOption,
      closeViolationModal,
      modalOpened,
      contributions,
      // page,
    } = this.props;
    // console.log('BenRevoAssistantModal props', this.props);
    const detailedPlans = (openedOption && openedOption.detailedPlans && openedOption.detailedPlans.length) ? openedOption.detailedPlans : [];
    return (
      <Modal
        open={modalOpened}
        size="large"
        closeOnDimmerClick={false}
        className="presentation-modal presentation-modal-benrevo-assistant"
        onClose={() => {
          closeViolationModal(section, openedOption.id);
        }}
        closeIcon={<span className="close">X</span>}
      >
        <Modal.Content>
          <Grid className="content-inner">
            <Grid.Row className="header-row">
              <Grid.Column width={16}>
                <Header className="presentation-options-header" as="h2">BenRevo Assistant</Header>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row className="body-row">
              <Grid.Column width={10}>
                <WarningCard section={section} />
              </Grid.Column>
              <Grid.Column width={16}>
                { (detailedPlans && detailedPlans.length > 0) &&
                <Table className="all-plans-table">
                  <Table.Header>
                    <Table.Row>
                      <Table.HeaderCell>Plan Type</Table.HeaderCell>
                      <Table.HeaderCell>Current</Table.HeaderCell>
                      <Table.HeaderCell>Network</Table.HeaderCell>
                      <Table.HeaderCell>Plan Name</Table.HeaderCell>
                      <Table.HeaderCell>% Diff</Table.HeaderCell>
                      <Table.HeaderCell>ENROLL</Table.HeaderCell>
                    </Table.Row>
                  </Table.Header>
                  <Table.Body>
                    { detailedPlans.map((plan, key) => {
                      return (
                        <Table.Row key={key} className="all-plans-body-row">
                          <Table.Cell>{plan.type}</Table.Cell>
                          <Table.Cell>
                            {plan.currentPlan ? plan.currentPlan.name : '-'}
                            <p>({(plan.currentPlan && plan.currentPlan.type) ? plan.currentPlan.type : '-'})</p>
                          </Table.Cell>
                          <Table.Cell>
                            <PlanNetworksDropdown index={key} section={section} detailedPlan={plan} networkChange={this.networkChange} />
                          </Table.Cell>
                          <Table.Cell>{(plan.newPlan && plan.newPlan.name) ? plan.newPlan.name : '-'}</Table.Cell>
                          <Table.Cell>{plan.type}</Table.Cell>
                          <Table.Cell>{contributions[key] ? contributions[key].proposedEnrollmentTotal : ''}</Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
                }
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Modal.Content>
        <Modal.Actions>
          <Button basic className="cancel-modal-button" onClick={() => closeViolationModal(section, openedOption.id)}>Cancel</Button>
          <Button primary onClick={this.saveChanges}>Save & Continue</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default BenRevoAssistantModal;
