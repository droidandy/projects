/* eslint-disable react/jsx-first-prop-new-line */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';

import auth from 'utils/auth';
import { LogoAffiliate, Icon } from 'components';
import { attachAnalytics } from 'components/GoogleAnalytics';
import { AscensionBlock } from 'pages/shared/admin';
import { BookersList, BookerForm } from 'pages/app/bookers';
import { ChangePassword, Details, EditDetails } from 'pages/app/settings';
import SidebarHead from './components/SidebarHead';

import { Bookings } from './bookings';
import { Reports } from './reports';

import NavMenuItem from './components/NavMenuItem';
import Footer from './components/Footer';
import CN from 'classnames';

import dispatchers from 'js/redux/app/session.dispatchers';

function signOut() {
  auth.revoke();
}

const navItems = [
  { title: 'Bookings', icon: 'MdDashboard', to: '/bookings' },
  { title: 'Reports', icon: 'MdEventNote', to: '/reports' },
  { title: 'Bookers', icon: 'FaUsers', to: '/bookers', if(can){ return can.seeBookers; } },
  { title: 'Account ', icon: 'MdSettings', to: '/settings/details' },
  { title: 'Password', icon: 'FaUnlockAlt', to: '/settings/change-password' }
];

function mapStateToProps(state) {
  const { can, reincarnated, layout: { companyName } } = state.session;

  return { can, reincarnated, companyName };
}

class App extends PureComponent {
  static propTypes = {
    can: PropTypes.object,
    getCurrent: PropTypes.func,
    reincarnated: PropTypes.bool,
    companyName: PropTypes.string
  };

  state = {
    showMenu: false
  };

  componentDidMount() {
    this.props.getCurrent();
  }

  showMenu = () => {
    this.setState({ showMenu: true });
  };

  hideMenu = () => {
    this.setState({ showMenu: false });
  };

  render() {
    const { can, reincarnated, companyName } = this.props;

    return (
      <Router basename="/affiliate">
        <div>
          { attachAnalytics() }
          { reincarnated &&
            <AscensionBlock companyName={ companyName } />
          }
          <div className="af-header layout horizontal center pl-20 pr-20">
            <div className="self-center layout horizontal end">
              <Link className="black-text" to="/">
                <LogoAffiliate className="logo" />
              </Link>
            </div>

            <div className="justified-right">
              <Icon onClick={ this.showMenu } icon="Menu" className="text-16 menu-icon pointer" />
            </div>

          </div>

          <div className={ CN('layout vertical af-sidebar', { open: this.state.showMenu }) }>
            <div className="flex">
              <Icon onClick={ this.hideMenu } icon="MdChevronRight" className="text-26 white-text close-menu-icon aligned-right pointer" />
              <SidebarHead hideMenu={ this.hideMenu } />
              { navItems.map((item, i) =>
                  (!item.if || item.if(can)) &&
                  <NavMenuItem
                    key={ i }
                    item={ item }
                    onClick={ this.hideMenu }
                    subItems={ item.items && item.items.filter(i => (!i.if || i.if(can))) }
                  />
              ) }
            </div>
            <div className="p-10 pr-15 pl-15 text-right">
              <Link to="#" onClick={ signOut } className="layout horizontal center end-justified white-text text-16 bold-text">
                Logout
                <Icon icon="FaSignOutAlt" className="text-22 ml-10" data-name="logoutIcon" />
              </Link>
            </div>
          </div>

          <div className="af-content p-30 sm-p-10 layout-background" id="scrollContainer">
            <Switch>
              <Redirect exact from="/" to="/bookings" />
              <Route path="/bookings" component={ Bookings } />
              <Route path="/reports" component={ Reports } />
              { can.seeBookers && [
                  <Route key="bl" exact path="/bookers" component={ BookersList } />,
                  <Route key="bn" exact path="/bookers/new" component={ BookerForm } />,
                  <Route key="be" exact path="/bookers/:id/edit" component={ BookerForm } />
                ]
              }
              <Route exact path="/settings/details" component={ Details } />
              { can.administrateCompany &&
                <Route path="/settings/details/edit" component={ EditDetails } />
              }
              <Route path="/settings/change-password" component={ ChangePassword } />
              { !isEmpty(can) && [ // fallback paths
                <Redirect key="bb" exact path="/bookers/*" to="/bookers" />,
                <Redirect key="rr" exact path="/settings/reports/*" to="/settings/reports" />,
                <Redirect key="dd" exact path="/settings/details/*" to="/settings/details" />,
                <Redirect key="hb" exact path="/*" to="/bookings" />
              ] }
            </Switch>
          </div>
          <Footer />
          { this.state.showMenu &&
            <div className="ant-modal-mask" onClick={ this.hideMenu } />
          }
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(App);
