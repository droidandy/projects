import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Header, Form, Button, Segment, Dropdown, Input, Message, Image } from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import Helmet from 'react-helmet';
import MaskedInput from 'react-text-mask';
import { STATES } from './constants';
import emailMask, { maskDomain } from './components/emailMask';
import emailPipe from './components/emailPipe';
import messages from '../messages';
import * as types from '../constants';
import LisiImg from '../../../assets/img/lisi.png';
import WarnerImg from '../../../assets/img/warner.png';

class Account extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    clearForm: PropTypes.func.isRequired,
    gaForm: PropTypes.object.isRequired,
    formVerified: PropTypes.bool.isRequired,
    formSubmittedSuccessfully: PropTypes.bool.isRequired,
    formSubmittedError: PropTypes.bool.isRequired,
    section: PropTypes.string.isRequired,
    anthemMarketing: PropTypes.array,
    anthemSales: PropTypes.array,
    checkIfGA: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      domainState: '',
    };
  }

  componentWillMount() {
    this.props.clearForm();

    this.props.checkIfGA();

    if (this.props.section === types.LISI) this.setState({ domainState: 'lisi.com' });
    else if (this.props.section === types.WARNER) this.setState({ domainState: 'warnerpacific.com' });
  }

  render() {
    const { gaForm, formVerified, formSubmittedSuccessfully, formSubmittedError, changeForm, formSubmit, section, anthemMarketing, anthemSales } = this.props;
    return (
      <div>
        <Helmet
          title="GA"
          meta={[
            { name: 'description', content: 'Description of account' },
          ]}
        />
        <Grid stackable className="anthem-user-profile">
          <Grid.Row>
            <Grid.Column width={16} className="profile-top">
              <div className="profile-header">
                <Header as="h1">Let&#39;s create your account.</Header>
                <p>Signing up is fast and easy. After we verify your info, you&#39;ll be ready for instant quotes.</p>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid stackable container className="section-wrap">
            <Grid.Column width={16} className="">
              <Grid stackable columns={2} as={Segment} className="gridSegment gaSegment">
                <Grid.Row className="gaCenteredRow">
                  <Grid.Column width={4} />
                  <Grid.Column tablet={12} computer={7}>
                    { section === types.LISI && <Image className="logo-img" src={LisiImg} /> }
                    { section === types.WARNER && <Image className="logo-img" src={WarnerImg} /> }
                  </Grid.Column>
                  <Grid.Column only="computer" width={5} />
                </Grid.Row>

                <Grid.Row className="gaCenteredRow">
                  <Grid.Column width={1} />
                  <Grid.Column width={3}>
                    <Header as="h3" className="">Brokerage Information</Header>
                  </Grid.Column>
                  <Grid.Column tablet={12} computer={7}>
                    <div className="formBlock">
                      <Form.Field className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.brokerName} /></Header>
                        <Input
                          value={gaForm.brokerName || ''}
                          id="brokerName"
                          onChange={(e, inputState) => { changeForm(section, 'brokerName', inputState.value); }}
                        />
                      </Form.Field>
                    </div>
                    <div className="formBlock">
                      <Form.Field className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.brokerAddress} /></Header>
                        <Input
                          value={gaForm.brokerAddress || ''}
                          id="brokerAddress"
                          onChange={(e, inputState) => { changeForm(section, 'brokerAddress', inputState.value); }}
                        />
                      </Form.Field>
                      <Form.Field inline id="" className="gaFormField">
                        <Header as="h3" className="gaPageHeading"><FormattedMessage {...messages.brokerCity} /></Header>
                        <Input
                          value={gaForm.brokerCity || ''}
                          id="brokerCity"
                          onChange={(e, inputState) => { changeForm(section, 'brokerCity', inputState.value); }}
                        />
                      </Form.Field>
                      <Form.Field inline id="" className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.brokerState} /></Header>
                        <Dropdown
                          id="brokerState"
                          search
                          selection
                          options={STATES}
                          value={gaForm.brokerState || ''}
                          onChange={(e, inputState) => { changeForm(section, 'brokerState', inputState.value); }}
                        />
                      </Form.Field>
                      <Form.Field inline id="" className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.brokerZip} /></Header>
                        <Input
                          id="brokerZip"
                          value={gaForm.brokerZip || ''}
                          onChange={(e, inputState) => { changeForm(section, 'brokerZip', inputState.value); }}
                        />
                      </Form.Field>
                    </div>
                    <div className="formBlock">
                      <Form.Field className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.brokerEmail} /></Header>
                        <div className="ui input">
                          <MaskedInput
                            id="brokerEmail"
                            value={gaForm.brokerEmail || ''}
                            mask={emailMask}
                            onChange={(e) => { changeForm(section, 'brokerEmail', e.target.value); }}
                          />
                        </div>
                      </Form.Field>
                    </div>
                    { (section === types.LISI || section === types.WARNER) &&
                    <div className="formBlock">
                      <Form.Field inline id="" className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.anthemMarketing} /></Header>
                        <Dropdown
                          id="gaState"
                          search
                          selection
                          options={anthemMarketing}
                          value={gaForm.brokerPresaleName || ''}
                          onChange={(e, inputState) => { changeForm(section, 'brokerPresaleName', inputState.value); }}
                        />
                      </Form.Field>
                      <Form.Field inline id="" className="gaFormField">
                        <Header as="h3" id="" className="gaPageHeading"><FormattedMessage {...messages.anthemSales} /></Header>
                        <Dropdown
                          id="gaState"
                          search
                          selection
                          options={anthemSales}
                          value={gaForm.brokerSalesName || ''}
                          onChange={(e, inputState) => { changeForm(section, 'brokerSalesName', inputState.value); }}
                        />
                      </Form.Field>
                      <span />
                    </div>
                    }
                  </Grid.Column>
                  <Grid.Column only="computer" width={5} />
                </Grid.Row>
                <Grid.Row className="gaCenteredRow bottom">
                  <Grid.Column width="1" className="field-button" />
                  <Grid.Column width="3" className="field-button" />
                  <Grid.Column tablet={12} computer="7" className="field-button">
                    <Button
                      disabled={!formVerified}
                      primary
                      className="form-home-button"
                      size="big"
                      onClick={formSubmit}
                    >Sign Up
                    </Button>
                    <Message info hidden={!formSubmittedSuccessfully}>
                      <Message.Header>Your request has successfully been sent for approval. Please verify your email address by checking your mail.</Message.Header>
                    </Message>
                    <Message warning hidden={!formSubmittedError}>
                      <Message.Header>Sending information failed. Please contact to administration.</Message.Header>
                    </Message>
                  </Grid.Column>
                  <Grid.Column only="computer" width={5} />
                </Grid.Row>
              </Grid>
            </Grid.Column>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default Account;
