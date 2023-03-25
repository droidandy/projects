/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Form, Image, Header, Button, Message, Loader } from 'semantic-ui-react';
import FontAwesome from 'react-fontawesome';
import Scroller from 'react-scroll';
import { Link } from 'react-router';
import {
  TabletImg,
  MouseBlueImg,
  ClockImg,
  AnthemLogo,
  Benrevo,
  MacBook,
  MenuList,
  HomeChangeForm as changeForm,
  HomeFormSubmit as formSubmit,
  openFeedbackModal as fOpenModal,
} from '@benrevo/benrevo-react-core';

const Element = Scroller.Element;

export class HomePage extends React.PureComponent { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    sent: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    changeForm: PropTypes.func.isRequired,
    formSubmit: PropTypes.func.isRequired,
    openFeedbackModal: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkbox: false,
    };

    this.changeCheckbox = this.changeCheckbox.bind(this);
  }

  changeCheckbox(value) {
    this.setState({ checkbox: value });
  }

  render() {
    const { form, sent, loading, openFeedbackModal } = this.props;
    const enable = form.firstName && form.lastName && form.brokerageFirmName && form.brokerageFirmZipCode && form.email && this.state.checkbox;

    return (
      <div className="anthem-home">
        <Grid centered className="app-header">
          <Grid.Row>
            <Grid.Column mobile={15} largeScreen={11} widescreen={10} textAlign="center">
              <div className="app-header-top">
                <Image src={AnthemLogo} style={{ width: '160px' }} />
                <MenuList openFeedbackModal={openFeedbackModal} location={this.props.location.pathname} CARRIER={'ANTHEM'} />
              </div>
              <div className="app-header-bottom">
                <h6>
                  <FontAwesome name="cloud" /> A simple quoting solution, all in the cloud
                </h6>
                <Image src={MacBook} />
              </div>
              <div className="clear-value-logo-circle">
                <div className="benrevo-logo-image" />
                <div className="benrevo-logo-bottom">
                  <div className="powered">powered by</div>
                  <Image src={Benrevo} />
                </div>
              </div>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16} textAlign="center">
              <div className="app-header-line">
                <div>Instant. Simple. Streamlined.</div>
                <div>The new way to quote Large Group.</div>
                <Button color="orange" size="big" as={Link} to={'/login'}>GET STARTED</Button>
              </div>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className="block-features">
          <Element name="scroll-to-crt">
            <Grid centered>
              <Grid.Row className="features">
                <Grid.Column mobile={15} largeScreen={11} widescreen={10}>
                  <Grid stackable>
                    <Grid.Row columns="3">
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={ClockImg} />
                        </div>
                        <div className="block-features-title">
                          Instant Quote Submission
                        </div>
                        <div className="block-features-body">
                          Get a quote you can show your client or prospect instantly.
                        </div>
                      </Grid.Column>
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={TabletImg} />
                        </div>
                        <div className="block-features-title">
                          Expedited Quoting
                        </div>
                        <div className="block-features-body">
                          An intuitive way to help your client find a solution that fits their needs.
                        </div>
                      </Grid.Column>
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={MouseBlueImg} />
                        </div>
                        <div className="block-features-title">
                          Dynamic Presentations
                        </div>
                        <div className="block-features-body">
                          We have brought installation online so it is easy to track, easy to manage, so you can be at ease when moving your clients to Anthem.
                        </div>
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Element>
        </div>

        <div className="home-block-signup">
          <Header as="h1">Signup</Header>
          <Grid centered>
            <Grid.Row>
              <Grid.Column className="signup-column" mobile={14} tablet={14} computer={12}>
                <Grid centered stackable>
                  <Grid.Column mobile={16} tablet={16} computer={16} largeScreen={16}>
                    <Form className="home">
                      <Form.Group widths="equal">
                        <Form.Input
                          label="First Name"
                          value={form.firstName}
                          onChange={(e, inputState) => { this.props.changeForm('firstName', inputState.value); }}
                        />
                        <Form.Input
                          label="Last Name"
                          value={form.lastName}
                          onChange={(e, inputState) => { this.props.changeForm('lastName', inputState.value); }}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Input
                          label="Brokerage Firm Name"
                          value={form.brokerageFirmName}
                          onChange={(e, inputState) => { this.props.changeForm('brokerageFirmName', inputState.value); }}
                        />
                        <Form.Input
                          label="Brokerage Firm Zip"
                          value={form.brokerageFirmZipCode}
                          onChange={(e, inputState) => { this.props.changeForm('brokerageFirmZipCode', inputState.value); }}
                        />
                      </Form.Group>
                      <Form.Group widths="equal">
                        <Form.Input
                          label="Email"
                          value={form.email}
                          onChange={(e, inputState) => { this.props.changeForm('email', inputState.value); }}
                        />
                      </Form.Group>
                      <Form.Group widths="equal" className="sign-up-policy">
                        <Form.Checkbox
                          label="I agree to the terms of use and privacy policy."
                          value={(this.state.checkbox) ? 'on' : 'off'}
                          onChange={(e, inputState) => { this.changeCheckbox(inputState.checked); }}
                        />
                      </Form.Group>
                      <Form.Field>
                        <Loader active={loading} indeterminate inline size="big" />
                        { !loading && <Button disabled={!enable} className="form-home-button" onClick={(e) => { e.preventDefault(); this.props.formSubmit(); }}>SIGN UP</Button> }
                      </Form.Field>
                    </Form>
                    <Message info hidden={!sent}>
                      <Message.Header>Your request has been sent. Thank you!</Message.Header>
                    </Message>
                  </Grid.Column>
                </Grid>
              </Grid.Column>
              {/* <div className="password-rules">
                    <ul>
                      <li><span>One uppercase character</span></li>
                      <li><span>8 characters minimum</span></li>
                      <li><span>One number</span></li>
                    </ul>
                  </div> */}

            </Grid.Row>
          </Grid>
        </div>

        <footer className="app-footer">
          <Grid centered textAlign="center">
            <Grid.Row>
              <Grid.Column width={15} textAlign="center">
                <Image src={Benrevo} />
                <div>Copyright ©2018 BenRevo Inc. All rights reserved. Our <Link to="/privacy">Privacy</Link> and <Link to="/terms">Terms</Link>.</div>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </footer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const homeState = state.get('home');
  return {
    form: homeState.get('form').toJS(),
    sent: homeState.get('sent'),
    loading: homeState.get('loading'),
  };
}

export function mapDispatchToProps(dispatch) {
  return {
    changeForm: (key, value) => {
      dispatch(changeForm(key, value));
    },
    formSubmit: () => {
      dispatch(formSubmit());
    },
    openFeedbackModal: () => {
      dispatch(fOpenModal());
    },
  };
}


// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
