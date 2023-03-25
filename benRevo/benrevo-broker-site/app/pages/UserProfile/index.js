/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
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
import { FormattedMessage } from 'react-intl';
import { Grid, Header, Form, Button, Image, Checkbox } from 'semantic-ui-react';
import { getProfile, EULAModal, changeInfo, saveInfo, setUserEULA } from '@benrevo/benrevo-react-core';
import MainImgLarge from '../../assets/img/broker-laptop@3x.png';
import messages from './messages';

export class UserProfile extends React.Component { // eslint-disable-line react/prefer-stateless-function
  static propTypes = {
    userEULA: PropTypes.bool.isRequired,
    lastName: PropTypes.string,
    firstName: PropTypes.string,
    changeInfoAction: PropTypes.func.isRequired,
    saveInfo: PropTypes.func.isRequired,
    setUserEULA: PropTypes.func.isRequired,
  };

  static defaultProps = {
    firstName: '',
    lastName: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
    };

    this.checkboxClick = this.checkboxClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.acceptModal = this.acceptModal.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
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

  handleInputChange(type, value) {
    const restrictions = /^[a-zA-Z.\- ]*$/;
    if (value.match(restrictions) || value === '') {
      this.props.changeInfoAction(type, value);
    }
  }

  render() {
    const { firstName, lastName, userEULA } = this.props;

    return (
      <div className="user-profile-page">
        <Helmet
          title="UserProfile"
          meta={[
            { name: 'description', content: 'Description of UserProfile' },
          ]}
        />
        <Grid stackable>
          <Grid.Column width={2} />
          <Grid.Column computer={7} tablet={14}>
            <Grid stackable textAlign="left">
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="profile-header">
                    <Header as="h1">Welcome to BenRevo!</Header>
                    <p>To get started, all we need from you is your name.</p>
                  </div>
                  <Form className="home">
                    <Form.Input
                      maxLength="50"
                      label="First name"
                      name="firstName"
                      value={firstName || ''}
                      onChange={(e, inputState) => { this.handleInputChange('firstName', inputState.value); }}
                    />
                    <Form.Input
                      maxLength="50"
                      label="Last name"
                      name="lastName"
                      value={lastName || ''}
                      onChange={(e, inputState) => { this.handleInputChange('lastName', inputState.value); }}
                    />
                    <Form.Group widths="equal" className="sign-up-policy">
                      <Checkbox
                        id="checkboxEula"
                        checked={userEULA}
                        onClick={this.checkboxClick}
                      />
                      <label htmlFor="checkboxEula">I have read and agree to the BenRevo <a tabIndex="0" onClick={this.checkboxClick}>EULA</a> and <Link target="_blank" to="/terms">Privacy Policy.</Link></label>
                    </Form.Group>
                  </Form>
                  <Grid.Column width="16" className="field-button">
                    <Button primary fluid disabled={!firstName || !lastName || !userEULA} className="form-home-button" onClick={this.props.saveInfo}>Save and Continue</Button>
                  </Grid.Column>
                  <EULAModal open={this.state.openModal} closeModal={this.closeModal} acceptModal={this.acceptModal} />
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Grid.Column>
          <Grid.Column computer={7} tablet={16} floated="right" textAlign="left">
            <Grid className="right-grid">
              <Grid.Row>
                <Grid.Column width={16} className="image-column">
                  <Image className="hero-image" src={MainImgLarge} centered verticalAlign="bottom" />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column width={16}>
                  <div className="broker-data-container">
                    <p className="header-text"><FormattedMessage {...messages.peer} /></p>
                    <p><FormattedMessage {...messages.peerParagraph} /></p>
                  </div>
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
