/*
 *
 * UserProfile
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';
import { Link } from 'react-router';
import { Grid, Header, Form, Button, Image, Checkbox } from 'semantic-ui-react';
import { getProfile, Benrevo, EULAModal, changeInfo, saveInfo, setUserEULA } from '@benrevo/benrevo-react-core';

export class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    userEULA: PropTypes.bool.isRequired,
    lastName: PropTypes.string.isRequired,
    firstName: PropTypes.string.isRequired,
    changeInfoAction: PropTypes.func.isRequired,
    saveInfo: PropTypes.func.isRequired,
    setUserEULA: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };

    this.checkboxClick = this.checkboxClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.acceptModal = this.acceptModal.bind(this);
  }

  componentWillMount() {
    const { lastName, firstName, changeInfoAction } = this.props;
    const profile = getProfile();

    if ((!firstName) && profile) changeInfoAction('firstName', profile.firstName);
    if ((!lastName) && profile) changeInfoAction('lastName', profile.lastName);
  }

  checkboxClick() {
    this.setState({ openModal: true });
  }

  closeModal() {
    this.setState({ openModal: false });
    this.props.setUserEULA(false);
  }

  acceptModal() {
    this.props.setUserEULA(true);
    this.setState({ openModal: false });
  }

  render() {
    const { firstName, lastName, userEULA } = this.props;

    return (
      <div>
        <Helmet
          title="UserProfile"
          meta={[
            { name: 'description', content: 'Description of UserProfile' },
          ]}
        />
        <Grid stackable className="anthem-user-profile">
          <Grid.Row>
            <Grid.Column width={16} className="profile-top">
              <div className="profile-header">
                <Header as="h1">Welcome to Anthem!</Header>
                <p>To get started, all we need is your name.</p>
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
          <Grid.Column width={16} className="profile-bottom">
            <Grid stackable textAlign="center">
              <Grid.Row>
                <Grid.Column width={16}>
                  <Form className="home">
                    <Form.Input
                      label="First name"
                      name="firstName"
                      value={firstName || ''}
                      onChange={(e, inputState) => { this.props.changeInfoAction('firstName', inputState.value); }}
                    />
                    <Form.Input
                      label="Last name"
                      name="lastName"
                      value={lastName || ''}
                      onChange={(e, inputState) => { this.props.changeInfoAction('lastName', inputState.value); }}
                    />
                    <Form.Group widths="equal" className="sign-up-policy">
                      <Checkbox
                        id="checkboxEula"
                        checked={userEULA}
                        onClick={this.checkboxClick}
                      />
                      <label htmlFor="checkboxEula">I have read and agree to the BenRevo <a tabIndex="0" onClick={this.checkboxClick}>EULA</a> and <Link target="_blank" to="terms">Privacy Policy.</Link></label>
                    </Form.Group>
                  </Form>
                  <Grid.Column width="9" className="field-button">
                    <Button disabled={!firstName || !lastName || !userEULA} color="orange" className="form-home-button" size="big" onClick={this.props.saveInfo}>Save & Continue</Button>
                  </Grid.Column>
                  <Grid.Column width="9" className="profile-hint">
                    Instant. Simple. Streamlined.
                  </Grid.Column>
                  <EULAModal open={this.state.openModal} closeModal={this.closeModal} acceptModal={this.acceptModal} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const profile = state.get('profile');
  return {
    firstName: profile.get('firstName'),
    lastName: profile.get('lastName'),
    userEULA: profile.get('userEULA'),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    changeInfoAction: (key, value) => { dispatch(changeInfo(key, value)); },
    saveInfo: () => { dispatch(saveInfo()); },
    setUserEULA: (check) => { dispatch(setUserEULA(check)); },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfile);
