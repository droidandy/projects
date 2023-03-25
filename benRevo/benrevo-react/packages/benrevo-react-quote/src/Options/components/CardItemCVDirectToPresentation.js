import React from 'react';
import PropTypes from 'prop-types';
import { Card, Image, Grid, Button, Modal, Input, Dropdown, Icon, Popup, Loader, Dimmer } from 'semantic-ui-react';
import { ClearValue } from '@benrevo/benrevo-react-core';
import {
  AVERAGE_AGE,
  PREDOMINANT_COUNTY,
} from '@benrevo/benrevo-react-clients';
import { COUNTIES } from './counties';

class CardItemCVDirectToPresentation extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    client: PropTypes.object.isRequired,
    qualification: PropTypes.object.isRequired,
    qualificationLoading: PropTypes.bool.isRequired,
    createDTPClearValue: PropTypes.func.isRequired,
    updateClient: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      modalOpen: false,
    };

    this.saveClient = this.saveClient.bind(this);
    this.modalToggle = this.modalToggle.bind(this);
  }

  componentWillMount() {
    const props = this.props;
    props.getDTPClearValueStatus();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.qualificationLoading === false && this.props.qualificationLoading === true && nextProps.qualification.rfpSubmittedSuccessfully !== false) {
      this.modalToggle();
    }
  }

  saveClient() {
    this.props.createDTPClearValue();
  }

  modalToggle() {
    const close = !this.state.modalOpen;
    this.setState({ modalOpen: close });
  }

  render() {
    const { client, updateClient, qualification, qualificationLoading } = this.props;

    return (
      <Card as="div" className="card-dtp-cv">
        <div className="topbottom" />
        <div className="leftright" />
        <Grid className="card-dtp-cv-inner">
          <Grid.Column width="16" textAlign="center" verticalAlign="middle">
            <Image src={ClearValue} centered />
            { !qualification.disqualificationReason &&
              <div>
                <div>By answering just a few more questions, we will issue a</div>
                <div><b>Clear Value quote instantly!</b></div>
                <div className="card-dtp-cv-benefit">
                  <div>In many instances we are seeing prices</div>
                  <div className="card-dtp-cv-benefit-lower">8-13% lower</div>
                  <div>than our standard pool.</div>
                </div>
                <Grid>
                  <Grid.Row centered>
                    <Grid.Column computer="16" largeScreen="14" textAlign="center" verticalAlign="middle">
                      <Button primary fluid size="medium" onClick={this.modalToggle}>Get an instant quote</Button>
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </div>
            }
            { qualification.disqualificationReason &&
              <div className="card-dtp-cv-disqualification">
                <div>Based on your information, you do not qualify for Clear Value.</div>
                <br />
                <div>{qualification.disqualificationReason}</div>
              </div>
            }
          </Grid.Column>
        </Grid>
        <Modal
          className="dtp-clear-value" // eslint-disable-line react/style-prop-objec
          open={this.state.modalOpen}
          onClose={this.modalToggle}
          closeOnDimmerClick={false}
          closeIcon={<span className="close">X</span>}
        >
          <Grid stackable className="dtp-clear-value-inner">
            <Grid.Row>
              <Grid.Column width="7" className="dtp-clear-value-left" textAlign="center">
                <Image src={ClearValue} centered />
                <div className="title1">Answer two questions to receive a Clear Value quote instantly.</div>
                <div>In many instances we are seeing prices</div>
                <div className="title2">8-13% lower</div>
                <div className="title3">than our standard pool.</div>
              </Grid.Column>
              { qualification.rfpSubmittedSuccessfully !== false &&
                <Grid.Column width="9" className="dtp-clear-value-right">
                  <div>
                    What is the average age of eligible employees?
                    <Popup
                      position="top center"
                      size="tiny"
                      trigger={<span className="field-info" />}
                      content="If information is available, use average age of enrolled employees. Otherwise, use eligible employees average age."
                      inverted
                    />
                  </div>
                  <Input
                    fluid
                    value={client[AVERAGE_AGE] || ''}
                    onChange={(e, inputState) => { updateClient(AVERAGE_AGE, inputState.value); }}
                  />
                  <div>
                    In what county is the group predominantly located?
                    <Popup
                      position="top center"
                      size="tiny"
                      trigger={<span className="field-info" />}
                      content="If information is available, use county where most employees reside. Otherwise, use employer county."
                      inverted
                    />
                  </div>
                  <Dropdown
                    fluid
                    search
                    selection
                    value={client[PREDOMINANT_COUNTY]}
                    options={COUNTIES}
                    onChange={(e, inputState) => { updateClient(PREDOMINANT_COUNTY, inputState.value); }}
                  />
                  <div>
                    <Button disabled={!client[PREDOMINANT_COUNTY] || !client[AVERAGE_AGE] || qualificationLoading} onClick={this.saveClient} primary size="big" fluid>
                      Get Instant Quote
                      <Icon name="angle right" />
                    </Button>
                    <Dimmer inverted active={qualificationLoading}>
                      <Loader size="large" />
                    </Dimmer>
                  </div>
                  <div className="title3">Clear Value rates are illustrative and information submitted is subject to confirmation by underwriting.</div>
                </Grid.Column>
              }
              { qualification.rfpSubmittedSuccessfully === false &&
                <Grid.Column width="9" className="dtp-clear-value-right centered">
                  <Grid verticalAlign="middle">
                    <Grid.Row centered>
                      <Grid.Column width="12" verticalAlign="middle" textAlign="center">
                        <div className="disqualification">
                          Based on your information, you do not qualify for Clear Value.
                        </div>
                        <br />
                        <div>{qualification.disqualificationReason}</div>
                        <Button className="centered" onClick={this.modalToggle} primary size="big" fluid>Close Window</Button>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              }
            </Grid.Row>
          </Grid>
        </Modal>
      </Card>
    );
  }
}

export default CardItemCVDirectToPresentation;
