import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Grid, Button, Image } from 'semantic-ui-react';
import NoteIcon from '@benrevo/benrevo-react-core';

class StandardModal extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    standardModalOpen: PropTypes.bool.isRequired,
    closeAddPlanModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.closeAddPlanModal('standard');
  }

  render() {
    const { standardModalOpen } = this.props;
    return (
      <Modal
        className="dtp-clear-value orange-modal" // eslint-disable-line react/style-prop-objec
        open={standardModalOpen}
        onClose={this.closeModal}
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
                        <li>Maximum of 2 Traditional PPO plans (Premier/Classic/Healthy Support/Elements Choice and
                          EPO)
                        </li>
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
                        <li>Maximum of 2 Traditional PPO plans (Premier/Classic/Healthy Support/Elements Choice/EPO/PPO
                          Exclusive)
                        </li>
                        <li>1 Solution PPO plan</li>
                        <li>1 HSA plan</li>
                      </ul>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column width="10" />
                    <Grid.Column width="6">
                      <Button onClick={this.closeModal} primary size="small" fluid>Close Window</Button>
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

export default StandardModal;
