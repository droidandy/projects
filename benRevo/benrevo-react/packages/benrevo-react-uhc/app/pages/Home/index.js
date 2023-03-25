/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Grid, Form, Image, Button, Message, Loader } from 'semantic-ui-react';
import Scroller from 'react-scroll';
import { Link } from 'react-router';
import FontAwesome from 'react-fontawesome';
import {
  IpadImg,
  MouseImg,
  ExpeditedImg,
  DynamicImg,
  Benrevo,
  UHCLogo,
  Powered,
  MenuList,
  HomeChangeForm as changeForm,
  HomeFormSubmit as formSubmit,
  openFeedbackModal as fopenModal,
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
      <div className="uhc-home">
        <Grid centered className="block-top">
          <Grid.Row>
            <Grid.Column mobile={14} tablet={14} computer={12}>
              <div className="header">
                <Image src={UHCLogo} />
                <MenuList openFeedbackModal={openFeedbackModal} location={this.props.location.pathname} CARRIER={'UHC'} />
              </div>

              <Grid>
                <Grid.Column className="header-block" mobile={16} tablet={16} computer={6}>
                  <h6>
                    <FontAwesome name="cloud" /> A simple quoting solution, all in the cloud
                  </h6>
                  <div className="sub-title">
                    Introducing a better way
                    to quote UnitedHealthcare
                  </div>
                  <Button className="explore-button" id="explore-button" as={Link} to={'/login'}>Get Started</Button>
                </Grid.Column>
                <Grid.Column className="ipad-block" mobile={16} tablet={16} computer={10} textAlign="center">
                  <Image src={IpadImg} />
                </Grid.Column>
              </Grid>
            </Grid.Column>
          </Grid.Row>
        </Grid>

        <div className="block-features">
          <Element name="scroll-to-crt">
            <Grid centered>
              <Grid.Row className="powered">
                <Grid.Column mobile={14} tablet={14} computer={12}>
                  <Image src={Powered} />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row className="features">
                <Grid.Column mobile={14} tablet={14} computer={12}>
                  <Grid stackable>
                    <Grid.Row columns="3">
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={MouseImg} />
                        </div>
                        <div className="block-features-title">
                          Instant Quote Submission
                        </div>
                        <div className="block-features-body">
                          Simplified online RFP that you can complete in one sitting.
                        </div>
                      </Grid.Column>
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={ExpeditedImg} />
                        </div>
                        <div className="block-features-title">
                          Simplified Quoting
                        </div>
                        <div className="block-features-body">
                          Quotes are automatically uploaded and available online.
                        </div>
                      </Grid.Column>
                      <Grid.Column className="block-features-item">
                        <div className="block-features-icon">
                          <Image src={DynamicImg} />
                        </div>
                        <div className="block-features-title">
                          Dynamic Presentations
                        </div>
                        <div className="block-features-body">
                          An intuitive way to help your client find a solution that fits their needs.
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
          <h1>Sign up</h1>
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
      dispatch(fopenModal());
    },
  };
}

// Wrap the component to inject dispatch and state into it
export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
