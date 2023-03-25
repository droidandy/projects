/*
 *
 * MedicalOverview
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Button, Dropdown, Modal, Image, Loader } from 'semantic-ui-react';
import NoteIcon from '@benrevo/benrevo-react-core';

export class PlanOptionAdder extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    networks: PropTypes.array,
    addingNetworks: PropTypes.bool.isRequired,
    // addNetworkModal: PropTypes.bool,
    // section: PropTypes.string,
    viewComparison: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      networkId: null,
      modalOpen: false,
    };

    this.networkChange = this.networkChange.bind(this);
    this.networkAdd = this.networkAdd.bind(this);
    this.viewComparison = this.viewComparison.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  networkChange(event, { value }) {
    this.setState({ networkId: value });
  }

  networkAdd() {
    const props = this.props;
    if (props.addNetworkModal) {
      this.setState({ modalOpen: true });
    }
    if (this.state.networkId) props.addNetwork(props.section, props.optionId, this.state.networkId);
  }

  modalToggle() {
    this.setState({ modalOpen: !this.state.modalOpen });
  }

  viewComparison(e, type) {
    e.preventDefault();
    this.props.viewComparison(type);
  }

  render() {
    const { addingNetworks } = this.props;
    const options = this.props.networks.map((item) => ({
      key: item.id,
      value: item.id,
      text: `${item.type} - ${item.name}`,
    }));

    return (
      <div className="bottomOverview">
        <div className="divider" />
        <Grid>
          <Grid.Row>
            <Grid.Column width={5} className="bottomOverview-left">
              <Dropdown selection fluid options={options} placeholder="Select A Network" onChange={this.networkChange} />
            </Grid.Column>
            <Grid.Column width={11}>
              <span>Compare Network and Providers:</span>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={5} className="bottomOverview-left">
              <Button size="medium" disabled={addingNetworks} primary onClick={this.networkAdd}>Add Plan Option</Button>
              { addingNetworks &&
                <Loader style={{ fontSize: '14px', fontWeight: '300', marginLeft: '10px' }} inline active />
              }
            </Grid.Column>
            <Grid.Column computer={4} mobile={4} largeScreen={3}>
              <Button fluid size="medium" primary onClick={(e) => this.viewComparison(e, 'Networks')}>Compare Networks</Button>
            </Grid.Column>
            <Grid.Column computer={4} mobile={4} largeScreen={3}>
              <Button fluid size="medium" primary onClick={(e) => this.viewComparison(e, 'Comparison')}>Compare Providers</Button>
            </Grid.Column>
          </Grid.Row>
          <Modal
            className="dtp-clear-value orange-modal" // eslint-disable-line react/style-prop-objec
            open={this.state.modalOpen}
            onClose={this.modalToggle}
            closeOnDimmerClick={false}
            closeIcon={<span className="close">X</span>}
          >
            <Modal.Header className="orange">
              <Grid>
                <Grid.Row>
                  <Grid.Column width="1">
                    <Image src={NoteIcon} centered />
                  </Grid.Column>
                  <Grid.Column width="15">
                    <span>A note from Anthem Blue Cross...</span>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Header>
            <Modal.Content>
              <Grid stackable className="dtp-clear-value-inner">
                <Grid.Row>
                  <Grid.Column width="5" className="dtp-clear-value-left" textAlign="left">
                    <h2>Guidelines:</h2>
                    <h1>Plan</h1>
                    <h1>Pairing</h1>
                  </Grid.Column>
                  <Grid.Column width="11" className="dtp-clear-value-right">
                    <Grid>
                      <Grid.Row>
                        <Grid.Column width="3">
                          <div className="pick-up-to">
                            <div className="text">pick up to</div>
                            <div className="number">6</div>
                          </div>
                        </Grid.Column>
                        <Grid.Column width="13">
                          For employees residing <strong>within California</strong>, we will allow any
                          combinations of the following Anthem plans to a maximum of
                          6 plan designs:
                          <ul>
                            <li>{'Maximum of 2 HMO plans (pick from one "Single HMO Network" or one "Dual HMO Network" Rate Request)'}</li>
                            <li>Maximum of 2 Traditional PPO plans (Premier/Classic/Healthy Support/Elements Choice and EPO)</li>
                            <li>1 Solution PPO plan</li>
                            <li>1 HSA plan</li>
                          </ul>
                        </Grid.Column>
                      </Grid.Row>
                      <div className="divider" />
                      <Grid.Row>
                        <Grid.Column width="3">
                          <div className="pick-up-to">
                            <div className="text">pick up to</div>
                            <div className="number">4</div>
                          </div>
                        </Grid.Column>
                        <Grid.Column width="13">
                          For employees residing <strong>outside of California (OOS)</strong>, we will allow any
                          combinations of the following Anthem plans to a maximum of
                          4 plan designs:
                          <ul>
                            <li>Maximum of 2 Traditional PPO plans (Premier/Classic/Healthy Support/Elements Choice/EPO/PPO Exclusive)</li>
                            <li>1 Solution PPO plan</li>
                            <li>1 HSA plan</li>
                          </ul>
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column width="10" />
                        <Grid.Column width="6">
                          <Button onClick={this.modalToggle} primary size="small" fluid>Close Window</Button>
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
          </Modal>
        </Grid>
      </div>
    );
  }
}

export default PlanOptionAdder;
