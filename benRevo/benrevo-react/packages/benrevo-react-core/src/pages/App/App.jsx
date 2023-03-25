/**
 *
 * App
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 */

import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Notifications from 'react-notification-system-redux';
import { Link } from 'react-router';
import { Sidebar, Menu, Icon, Image, Grid } from 'semantic-ui-react';
import { loggedIn, getProfile, getToken, getRole } from './../../utils/authService/lib';
import withProgressBar from './../../components/ProgressBar';
import { ROLE_IMPLEMENTATION_MANAGER } from './../../utils/authService/constants';
import Header from './Header';
import Footer from './Footer';
import FeedbackModal from './FeedbackModal/FeedbackModal';
import Logger from './../../logger';
import AlertError from '../../assets/img/svg/alert-error.svg';
import AlertWarning from '../../assets/img/svg/alert-warning.svg';
import AlertInfo from '../../assets/img/svg/alert-info.svg';
import AlertSuccess from '../../assets/img/svg/alert-success.svg';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { checkRole } = this.props;
    checkRole(true);
  }

  componentDidMount() {
    this.context.mixpanel.track('App did mount.');
    Logger.info('App did mount.');
  }

  render() {
    const { notifications, brokerageRole, CARRIER } = this.props;
    const page = this.props.routes[1].name;
    const profile = getProfile();
    const hasImpManRole = getRole(brokerageRole, [ROLE_IMPLEMENTATION_MANAGER]);
    const carrieTitle = (CARRIER === 'UHC') ? 'UnitedHealthcare' : 'Anthem';
    const style = {
      NotificationItem: { // Override the notification item
        DefaultStyle: { // Applied to every notification, regardless of the notification level
          borderTop: null,
          boxShadow: null,
          padding: '15px 15px 15px 40px',
          borderRadius: '5px',
          color: '#ffffff',
          backgroundSize: '23px',
          backgroundPosition: '10px',
          backgroundRepeat: 'no-repeat',
        },
        error: {
          backgroundImage: `url(${AlertError})`,
          backgroundColor: '#F16060',
        },
        warning: {
          backgroundImage: `url(${AlertWarning})`,
          backgroundColor: '#F8991D',
        },
        info: {
          backgroundImage: `url(${AlertInfo})`,
          backgroundColor: '#3AC0C3',
        },
        success: {
          backgroundImage: `url(${AlertSuccess})`,
          backgroundColor: '#8DC63F',
        },
      },
    };
    if (!this.props.checkingRole || !getToken()) {
      return (
        <div id="container-center" className="container-center">
          <Grid container>
            <Grid.Column width={16}>
              <Notifications
                notifications={notifications}
                style={style}
              />
            </Grid.Column>
          </Grid>
          <Sidebar.Pushable id="container-pushable">
            <Helmet
              titleTemplate={`%s - ${carrieTitle}`}
              defaultTitle={carrieTitle}
              meta={[
                { name: 'description', content: carrieTitle },
              ]}
            />
            <Sidebar
              onClick={this.props.toggleMobileNavigation}
              as={Menu} animation="push"
              width="thin"
              visible={this.props.showMobileNavigation}
              icon="labeled" vertical inverted
            >
              {!loggedIn() && this.props.location !== '/login' &&
              <div>
                123123
                <Menu.Item as={Link} to="/" name="home">
                  <Icon name="home" />
                  Home
                </Menu.Item>
                <Menu.Item as={Link} to="/login" name="login">
                  <Icon name="dashboard" />Login
                </Menu.Item>
              </div>
              }
              {loggedIn() &&
              <div>
                <Menu.Item as={Link} to="/" name="home">
                  <Image shape="circular" size="tiny" centered src={this.props.picture} style={{ marginBottom: '5px' }} />
                  <span style={{ fontSize: '12px' }}>{this.props.name}</span>
                </Menu.Item>
                <Menu.Item as={Link} to="/" name="home">
                  <Icon name="home" />
                  Home
                </Menu.Item>
                { profile && profile.user_metadata && profile.user_metadata.first_name && profile.user_metadata.last_name &&
                <Menu.Item as={Link} to="/clients" name="clients">
                  <Icon name="doctor" />
                  Clients
                </Menu.Item>
                }
                {/* { profile
                && profile.user_metadata
                && profile.user_metadata.first_name
                && profile.user_metadata.last_name
                && this.props.location !== '/'
                && CARRIER === 'ANTHEM'
                && !hasImpManRole &&
                <Menu.Item as={'a'} target="_tab" href="https://s3-us-west-2.amazonaws.com/benrevo-static-anthem/User+Guide_Anthem.pdf" name="guide">
                  <Icon name="comment" />
                  User Guide
                </Menu.Item>
                } */}
                {/* { profile && profile.user_metadata
                && profile.user_metadata.first_name
                && profile.user_metadata.last_name
                && this.props.location !== '/'
                && CARRIER === 'UHC'
                && !hasImpManRole &&
                <Menu.Item as={'a'} target="_tab" href="https://s3-us-west-2.amazonaws.com/benrevo-static-uhc/User+Guide_UHC.pdf" name="guide">
                  <Icon name="comment" />
                  User Guide
                </Menu.Item>
                } */}
                { profile && profile.user_metadata && profile.user_metadata.first_name && profile.user_metadata.last_name && !hasImpManRole &&
                <Menu.Item as={Link} to="/admin" name="admin">
                  <Icon name="user" />Admin
                </Menu.Item>
                }
                <Menu.Item name="feedback" onClick={this.props.openFeedbackModal}>
                  <Icon name="send" />
                  Send Feedback
                </Menu.Item>
                <Menu.Item name="logout" onClick={this.props.logout}>
                  <Icon name="external square" />
                  Logout
                </Menu.Item>
              </div>
              }
            </Sidebar>
            <Sidebar.Pusher id="container-pusher">
              { page !== 'home' && <Header logo={this.props.logo} CARRIER={CARRIER} location={this.props.location.pathname} openFeedbackModal={this.props.openFeedbackModal} /> }
              {React.Children.toArray(this.props.children)}
              { page !== 'home' && <Footer /> }
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <FeedbackModal open={this.props.feedbackModalOpen} closeModal={this.props.closeFeedbackModal} sendFeedback={this.props.sendFeedback} />
        </div>
      );
    }
    return (
      <div className="container-center"></div>
    );
  }
}

App.propTypes = {
  notifications: PropTypes.array,
  children: PropTypes.node,
  picture: PropTypes.string,
  brokerageRole: PropTypes.array,
  name: PropTypes.string,
  logout: PropTypes.func,
  toggleMobileNavigation: PropTypes.func,
  checkRole: PropTypes.func,
  showMobileNavigation: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
  checkingRole: PropTypes.bool,
  logo: PropTypes.object.isRequired,
  CARRIER: PropTypes.string.isRequired,
  sendFeedback: PropTypes.func.isRequired,
  feedbackModalOpen: PropTypes.bool.isRequired,
  openFeedbackModal: PropTypes.func.isRequired,
  closeFeedbackModal: PropTypes.func.isRequired,
};

App.contextTypes = {
  mixpanel: PropTypes.object.isRequired
};

export default withProgressBar(App);
