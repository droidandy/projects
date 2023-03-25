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
import { loggedIn } from 'utils/authService/lib';
import Header from './Header';
import AlertError from '../../assets/img/svg/alert-error.svg';
import AlertWarning from '../../assets/img/svg/alert-warning.svg';
import AlertInfo from '../../assets/img/svg/alert-info.svg';
import AlertSuccess from '../../assets/img/svg/alert-success.svg';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function

  componentWillMount() {
    const { checkRole } = this.props;
    checkRole();
  }

  componentWillReceiveProps(nextProps) {
    const { getCarrier } = this.props;

    if (!nextProps.checkingRole && this.props.checkingRole && loggedIn()) {
      getCarrier();
    }
  }

  render() {
    const { notifications } = this.props;
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
          backgroundColor: '#B29931',
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

    if (!this.props.checkingRole) {
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
              titleTemplate="%s - BenRevo"
              defaultTitle="BenRevo"
              meta={[
                { name: 'description', content: 'BenRevo' },
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
                <Menu.Item name="logout" onClick={this.props.logout}>
                  <Icon name="external square" />
                  Logout
                </Menu.Item>
              </div>
              }
            </Sidebar>
            <Sidebar.Pusher id="container-pusher">
              <Header location={this.props.location.pathname} />
              {React.Children.toArray(this.props.children)}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      );
    }
    return (
      <div></div>
    );
  }
}

App.propTypes = {
  notifications: React.PropTypes.array,
  children: PropTypes.node,
  picture: PropTypes.string,
  name: PropTypes.string,
  logout: PropTypes.func,
  toggleMobileNavigation: PropTypes.func,
  getCarrier: PropTypes.func,
  checkRole: PropTypes.func,
  showMobileNavigation: PropTypes.bool,
  checkingRole: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
