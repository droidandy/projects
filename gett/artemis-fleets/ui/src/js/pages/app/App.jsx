/* eslint-disable react/jsx-first-prop-new-line */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import auth from 'utils/auth';
import SidebarHead from './components/SidebarHead';

import { Orders, Breadcrumbs as Ordercrumbs } from 'pages/app/orders';
import { Dashboard, Breadcrumbs as Dashcrumbs } from 'pages/app/dashboard';
import { Statistics, Breadcrumbs as Statcrumbs } from 'pages/app/statistics';
import { Users, Breadcrumbs as Usercrumbs } from 'pages/app/users';
import { Reports, Breadcrumbs as Repocrumbs } from 'pages/app/reports';
import { ChangePassword, Details, EditDetails, Breadcrumbs as Setcrumbs } from 'pages/app/settings';
import { Billing } from 'pages/app/billing';
import AppNotifications from './components/AppNotifications';

import { NavMenuItem, Icon } from 'components';
import { Tooltip } from 'antd';
import CN from 'classnames';
import dispatchers from 'js/redux/app/settings.dispatchers';

function signOut() {
  auth.revoke();
}

function mapStateToProps(state) {
  return {
    userRole: state.settings.role
  };
}

const navItems = [
  { title: 'Orders', icon: 'MdEventNote', to: '/orders', exact: true },
  { title: 'Users', icon: 'MdPeopleOutline', to: '/users', exact: true },
  { title: 'Dashboard', icon: 'MdDashboard', to: '/dashboard', exact: true },
  // @todo uncomment when BE API will appear
  // { title: 'Billing', icon: 'MdPayment', to: '/billing' }
  {
    title: 'Reports',
    icon: 'MdAssignment',
    to: '#',
    items: [
      { title: 'Statistics', icon: 'MdInsertChart', to: '/statistics' },
      { title: 'Driver Reports', icon: 'MdDriveEta', to: '/reports' },
    ]
  },
  {
    title: 'Settings',
    icon: 'MdSettings',
    to: '#',
    items: [
      { title: 'Account Details', icon: 'MdAccountBox', to: '/settings/details' },
      { title: 'Change Password', icon:'FaLock', to: '/settings/change-password' }
    ]
  }
];

class App extends PureComponent {
  static propTypes = {
    userRole: PropTypes.string,
    getCompany: PropTypes.func,
    getCurrentSession: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsedMenu: localStorage.getItem('collapsedMenu') === 'true'
    };
  }

  componentDidMount() {
    this.props.getCompany();
    this.props.getCurrentSession();
  }

  toggleMenu = () => {
    this.setState({ collapsedMenu: !this.state.collapsedMenu }, this.setLocalStorage);
  };

  setLocalStorage = () => {
    localStorage.setItem('collapsedMenu', this.state.collapsedMenu);
  };

  get isAdmin() {
    return this.props.userRole === 'admin';
  }

  render() {
    const collapsedMenu = this.state.collapsedMenu;

    return (
      <Router>
        <div>
          <div className={ CN('header', { 'collapsed': collapsedMenu }) }>
            <div className="pt-10 pb-10 pl-20">
              <Link className="black-text" to="/">
                <Icon icon="LogoOT" className="logo-ot" />
              </Link>
            </div>
            <div className="relative">
              <Route
                path="/orders"
                component={
                  props => <Ordercrumbs { ...props } userRole={ this.props.userRole } />
                }
              />
              <Route exact path="/reports" component={ Repocrumbs } />
              <Route exact path="/users" component={ Usercrumbs } />
              <Route exact path="/dashboard" component={ Dashcrumbs } />
              <Route exact path="/statistics" component={ Statcrumbs } />
              <Route path="/settings" component={ Setcrumbs } />
            </div>
          </div>

          <div className={ CN('sidebar layout vertical white-text', { 'center collapsed': collapsedMenu }) }>
            <Tooltip placement="right" title={ collapsedMenu ? 'Show Menu' : 'Hide Menu' } mouseEnterDelay={ 0.3 }>
              <Icon icon="FaBars" className={ CN('text-22 p-10 pointer', { 'self-end': !collapsedMenu, 'mb-10': collapsedMenu }) } onClick={ this.toggleMenu } />
            </Tooltip>
            { !collapsedMenu && <SidebarHead /> }
            { navItems.map((item, i) => (
                <NavMenuItem
                  key={ i }
                  item={ item }
                  onClick={ this.hideMenu }
                  collapsed={ collapsedMenu }
                  subItems={ item.items }
                />
              ))
            }
            <div className="pt-10 pb-10 pl-15 pr-10 pointer justified-end" onClick={ signOut }>
              <Icon icon="FaSignOut" className="text-22 mr-10" />
              { !collapsedMenu && 'Logout' }
            </div>
          </div>

          <div className={ CN('content', { 'collapsed': collapsedMenu }) }>
            <Switch>
              <Redirect exact from="/" to="/orders" />
              <Route exact path="/orders" component={ Orders } />
              <Route exact path="/users" component={ Users } />
              <Route exact path="/dashboard" component={ Dashboard } />
              <Route exact path="/statistics" component={ Statistics } />
              <Route exact path="/reports" component={ Reports } />
              <Route exact path="/settings/details" component={ Details } />
              <Route exact path="/billing" component={ Billing } />
              { this.isAdmin &&
                <Route path="/settings/details/edit" component={ EditDetails } />
              }
              <Route path="/settings/change-password" component={ ChangePassword } />
            </Switch>
          </div>
          <AppNotifications />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(App);
