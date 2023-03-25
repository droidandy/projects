/* eslint-disable react/jsx-first-prop-new-line */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';
import auth from 'utils/auth';
import { Icon, SidebarMenu, Avatar, SidebarMedia } from 'components';
import { attachAnalytics } from 'components/GoogleAnalytics';
import { CompaniesList, CompanyEdit } from 'pages/admin/companies';
import { BookingsList, BookingSummary, BookingEditor, BookingCreator } from 'pages/admin/bookings';
import { UsersList, EditUser } from 'pages/admin/users';
import { MembersList, EditMember } from 'pages/admin/members';
import { Notifications } from 'pages/admin/notifications';
import { Statistics } from 'pages/admin/statistics';
import { Poi, System, Billing, CreditNote } from 'pages/admin/settings';
import { Service } from 'pages/shared/static';
import ProgressNotifications from './components/ProgressNotifications';
import CN from 'classnames';
import dispatchers from 'js/redux/admin/app.dispatchers';

function signOut() {
  auth.revoke();
}

const navItems = [
  { title: 'Companies', icon: 'FaBuilding', to: '/companies', if(can){ return can.seeCompanies; } },
  { title: 'Bookings', icon: 'ListCopy', to: '/bookings', if(can){ return can.seeBookings; } },
  { title: 'Notifications', icon: 'MdNotifications', to: '/notifications', if(can){ return can.seeNotifications; } },
  { title: 'Statistics', icon: 'MdEventNote', to: '/statistics', if(can){ return can.seeStatistics; } },
  {
    title: 'Users',
    icon: 'MdPeopleOutline',
    to: '#',
    base: 'users',
    items: [
      { title: 'Gett Users', to: '/users/admins' },
      { title: 'All Users', to: '/users/members' },
    ],
    if(can){ return can.seeUsers; }
  },
  {
    title: 'Settings',
    icon: 'MdSettings',
    to: '#',
    base: 'settings',
    items: [
      { title: 'POI', to: '/settings/poi', if(can){ return can.seePredefinedAddresses; } },
      { title: 'System', to: '/settings/system', if(can){ return can.seeSystemSettings; } },
      { title: 'Billing', to: '/settings/billing', if(can){ return can.seeBilling; } }
    ],
    if(can){ return can.seePredefinedAddresses || can.seeSystemSettings || can.seeBilling; }
  },
  { title: 'New Booking', icon: 'PlusCar', to: '/booking/new', exact: true }
];

function mapStateToProps(state) {
  return {
    name: state.app.session.name,
    avatarUrl: state.app.session.avatarUrl,
    exportInvoicesBunchChannel: state.app.session.exportInvoicesBunchChannel,
    can: state.app.session.can
  };
}

class App extends PureComponent {
  static propTypes = {
    getCompaniesLookup: PropTypes.func,
    getSession: PropTypes.func,
    name: PropTypes.string,
    avatarUrl: PropTypes.string,
    exportInvoicesBunchChannel: PropTypes.string,
    can: PropTypes.object
  };

  state = {
    showMenu: false
  };

  componentDidMount() {
    const { getCompaniesLookup, getSession } = this.props;

    getCompaniesLookup();
    getSession();
  }

  showMenu = () => {
    this.setState({ showMenu: true });
  };

  hideMenu = () => {
    this.setState({ showMenu: false });
  };

  renderAppLayout = () => {
    const { name, can, avatarUrl } = this.props;

    return (
      <div className="layout-background">
        <SidebarMedia>
          <div className="mobile-header relative sm-disable-copy layout horizontal center center-justified">
            <Icon onClick={ this.showMenu } icon="Menu" className="text-16 menu-icon" />
            <Icon icon="LogoOTMobile" width={ 128 } height={ 34 } />
          </div>
        </SidebarMedia>
        <div className={ CN('layout vertical sidebar', { open: this.state.showMenu }) }>
          <div className="text-center mt-20 black-text text-20">Back Office</div>
          <div className="layout horizontal center pb-30 m-30 border-bottom">
            <Avatar size={ 40 } src={ avatarUrl } name={ name } className="flex none mr-10" />
            <div className="flex black-text bold-text elipsis-text" data-name="currentUserName">{ name }</div>
            <Icon icon="Exit" className="text-22 pointer flex none light-grey-link" data-name="logoutIcon" onClick={ signOut } />
          </div>
          <SidebarMenu onClick={ this.hideMenu } items={ navItems } can={ can } />
        </div>

        <div className="content p-30 pt-40 sm-p-10" id="scrollContainer">
          { this.state.showMenu &&
            <div className="ant-modal-mask sm-disable-copy" onClick={ this.hideMenu } onTouchStart={ this.hideMenu }>
              <SidebarMedia>
                <Icon onClick={ this.hideMenu } icon="MdClose" className="text-22 black-text close-menu-icon sm-disable-copy" />
              </SidebarMedia>
            </div>
          }

          <Switch>
            { can.seeCompanies !== undefined &&
              <Redirect exact path="/" to={ can.seeCompanies ? '/companies' : '/booking/new' } />
            }
            { can.seeCompanies && <Route path="/companies" component={ CompaniesList } /> }
            { can.editCompanies && [
              <Route key="ec1" exact path="/company/new" component={ CompanyEdit } />,
              <Route key="ec2" exact path="/company/:id/edit" component={ CompanyEdit } />
            ] }
            <Route exact path="/booking/new" component={ BookingCreator } />
            { can.seeBookings && [
              // NOTE: it is IMPORTANT to have /bookings and /bookings/:id as a single route with
              // :id as optional path parameter. Otherwise, on expanding a row in a list, route changes
              // and entire `BookingsList` component is unmounted and mounted back again. That resets
              // any filters applied and results in re-requesting new bookings list making page
              // completely unusable.
              <Route key="bl" exact path="/bookings/:id?" component={ BookingsList } />,
              <Route key="bs" exact path="/bookings/:id/summary" component={ BookingSummary } />,
              <Route key="be" exact path="/bookings/:id/edit" component={ BookingEditor } />,
              <Route key="br" exact path="/bookings/:id/repeat" component={ BookingEditor } />
            ] }
            { can.seeNotifications &&
              <Route path="/notifications" component={ Notifications } />
            }
            { can.seeStatistics &&
              <Route path="/statistics" component={ Statistics } />
            }
            { can.seeUsers && [
              <Route key="ua" exact path="/users/admins" component={ UsersList } />,
              <Route key="uae" exact path="/users/admins/:id/edit" component={ EditUser } />,
              <Route key="um" exact path="/users/members" component={ MembersList } />,
              <Route key="ume" exact path="/users/members/:id/edit" component={ EditMember } />,
              <Route key="an" path="/users/admins/new" component={ EditUser } />
            ] }
            { can.seePredefinedAddresses &&
              <Route path="/settings/poi" component={ Poi } />
            }
            { can.seeSystemSettings &&
              <Route path="/settings/system" component={ System } />
            }
            { can.seeBilling && [
              <Route exact key="bl" path="/settings/billing" component={ Billing } />,
              <Route exact key="bc" path="/settings/billing/:id/credit-note" component={ CreditNote } />
            ] }
            { !isEmpty(can) && [ // fallback paths
              <Redirect key="bb" exact path="/bookings/*" to="/bookings" />,
              <Redirect key="aa" exact path="/users/admins/*" to="/users/admins" />,
              <Redirect key="aa" exact path="/users/members/*" to="/users/members" />,
              <Redirect key="hc" exact path="/*" to="/companies" />
            ] }
          </Switch>
        </div>
      </div>
    );
  };

  render() {
    const { exportInvoicesBunchChannel } = this.props;

    return (
      <Router basename="/admin">
        <div>
          { attachAnalytics() }
          <Switch>
            <Route exact path="/privacy-policy" component={ Service } />
            <Route exact path="/terms-and-conditions" component={ Service } />
            <Route path="*" render={ this.renderAppLayout } />
          </Switch>
          <ProgressNotifications channel={ exportInvoicesBunchChannel } />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(App);
