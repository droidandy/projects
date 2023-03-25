/* eslint-disable react/jsx-first-prop-new-line */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { isEmpty } from 'lodash';

import { AscensionBlock } from 'pages/shared/admin';
import { SidebarMenu, Icon, SidebarMedia } from 'components';
import { attachAnalytics } from 'components/GoogleAnalytics';

import { Dashboard } from 'pages/app/dashboard';
import { BookingsList, BookingEditor, BookingSummary } from 'pages/app/bookings';
import { PassengersList, EditPassenger } from 'pages/app/passengers';
import { BookersList, BookerForm } from 'pages/app/bookers';
import { Charts, Bookings as ReportsBookingsList } from 'pages/app/reports';
import ProgressNotifications from 'pages/admin/components/ProgressNotifications';
import { Service } from 'pages/shared/static';
import {
  ChangePassword,
  Details,
  EditDetails,
  WorkRoles,
  Departments,
  TravelReasons,
  TravelPolicy,
  Billing,
  Locations,
  CsvReports
} from 'pages/app/settings';

import SidebarHead from './components/SidebarHead';
import OnboardingPopup from './components/OnboardingPopup';
import AppNotifications from './components/AppNotifications';
import RebrandingBanner from './components/RebrandingBanner';

import showAddToHomeScreenNotification from 'utils/showAddToHomeScreenNotification';
import { isMobile } from 'utils/userAgent';
import { gettAnalytics } from 'utils';
import moment from 'moment';
import CN from 'classnames';

import dispatchers from 'js/redux/app/session.dispatchers';

const navItems = [
  { title: 'New Booking', icon: 'PlusCar', to: '/bookings/new', exact: true },
  { title: 'Active Bookings', icon: 'ListCopy', to: '/bookings', exclude: '/bookings/new' },
  { title: 'Passengers', icon: 'Passenger', to: '/passengers' },
  { title: 'Bookers', icon: 'MdPeople', to: '/bookers', if(can){ return can.seeBookers; } },
  { title: 'Dashboard', icon: 'MdDashboard', to: '/dashboard', exact: true },
  {
    title: 'Reports',
    icon: 'MdInsertDriveFile',
    to: '#',
    base: 'reports',
    items: [
      { title: 'Bookings', to: '/reports/bookings' },
      { title: 'Statistics', to: '/reports/charts', if(can){ return can.seeStatistics; } },
      { title: 'Procurement Statistics', to: '/reports/procurement_statistics', if(can){ return can.seeProcurementStatistics; } }
    ]
  },
  {
    title: 'Settings',
    icon: 'MdSettings',
    to: '#',
    base: 'settings',
    items: [
      { title: 'Travel Policy', to: '/settings/travel-policy', if(can){ return can.manageTravelPolicies; } },
      { title: 'Roles', to: '/settings/work-roles', if(can){ return can.administrateCompany; } },
      { title: 'Departments', to: '/settings/departments', if(can){ return can.administrateCompany; } },
      { title: 'Reason for Travel', to: '/settings/reason-for-travel', if(can){ return can.manageTravelReasons; } },
      { title: 'Account Details', to: '/settings/details' },
      { title: 'Billing', to: '/settings/billing', if(can){ return can.manageFinance; } },
      { title: 'Change Password', to: '/settings/change-password' },
      { title: 'Office Locations', to: '/settings/locations', if(can){ return can.administrateCompany; } },
      { title: 'Report Settings', to: '/settings/csv-reports', if(can){ return can.manageReportSettings; } }
    ]
  }
];

const pathEvents = {
  '/dashboard': 'company_web|dashboard|button_clicked',
  '/reports/charts': 'company_web|reports|statistics|button_clicked'
};

function mapStateToProps(state) {
  const {
    can,
    onboarding,
    reincarnated,
    warning,
    exportInvoicesBunchChannel,
    exportReceiptsBunchChannel,
    memberId,
    companyId,
    layout: { companyName }
  } = state.session;

  return {
    can,
    onboarding,
    reincarnated,
    warning,
    companyName,
    exportInvoicesBunchChannel,
    exportReceiptsBunchChannel,
    memberId,
    companyId
  };
}

class App extends PureComponent {
  static propTypes = {
    can: PropTypes.object,
    onboarding: PropTypes.bool,
    getCurrent: PropTypes.func,
    reincarnated: PropTypes.bool,
    companyName: PropTypes.string,
    warning: PropTypes.string,
    exportInvoicesBunchChannel: PropTypes.string,
    exportReceiptsBunchChannel: PropTypes.string,
    memberId: PropTypes.number,
    companyId: PropTypes.number
  };

  state = {
    showMenu: false
  };

  componentDidMount() {
    this.props.getCurrent();

    if (isMobile) {
      showAddToHomeScreenNotification();
    }
  }

  showMenu = () => {
    this.setState({ showMenu: true });
  };

  hideMenu = () => {
    this.setState({ showMenu: false });
  };

  handleSideBarMenuClick(path) {
    const { memberId, companyId } = this.props;
    const event = pathEvents[path];

    if (event) gettAnalytics(event, { companyId, userId: memberId, timestamp: moment() });
    this.hideMenu();
  }

  renderAppLayout = () => {
    const { can, onboarding, reincarnated, warning, companyName } = this.props;

    return (
      <div className="layout-background">
        { reincarnated &&
          <AscensionBlock companyName={ companyName } />
        }
        { warning &&
          <div className="message message-warning text-center p-5">{ warning }</div>
        }

        { onboarding && <OnboardingPopup /> }

        <SidebarMedia>
          <div className="mobile-header relative sm-disable-copy layout horizontal center center-justified">
            <Icon onClick={ this.showMenu } icon="Menu" className="text-16 menu-icon" />
            <Icon icon="LogoOTMobile" width={ 128 } height={ 34 } />
          </div>
        </SidebarMedia>

        <div className={ CN('sidebar layout vertical', { open: this.state.showMenu, 'mt-50': reincarnated }) }>
          <div className="flex none">
            <SidebarHead />
          </div>
          <SidebarMenu onClick={ path => this.handleSideBarMenuClick(path) } items={ navItems } can={ can } />
        </div>

        <div className={ CN('content p-30 pt-40 sm-p-20', { 'shifted': reincarnated }) } id="scrollContainer">
          { this.state.showMenu &&
            <SidebarMedia>
              <div className="ant-modal-mask sm-disable-copy" onClick={ this.hideMenu } onTouchStart={ this.hideMenu }>
                <Icon onClick={ this.hideMenu } icon="MdClose" className="text-22 black-text close-menu-icon sm-disable-copy" />
              </div>
            </SidebarMedia>
          }
          <Switch>
            <Redirect exact path="/" to="/bookings/new" />
            <Route exact path="/dashboard" component={ Dashboard } />
            <Route exact path="/bookings/new" component={ BookingEditor } />
            <Route exact path="/bookings/:id?" component={ BookingsList } />
            <Route exact path="/bookings/:id/summary" component={ BookingSummary } />
            <Route exact path="/bookings/:id/edit" component={ BookingEditor } />
            <Route exact path="/bookings/:id/repeat" component={ BookingEditor } />
            <Route exact path="/passengers" component={ PassengersList } />
            { can.createPassengers &&
              <Route exact path="/passengers/new" component={ EditPassenger } />
            }
            <Route exact path="/passengers/:id/edit" component={ EditPassenger } />
            { can.seeBookers && [
                <Route key="bl" exact path="/bookers" component={ BookersList } />,
                <Route key="bn" exact path="/bookers/new" component={ BookerForm } />,
                <Route key="be" exact path="/bookers/:id/edit" component={ BookerForm } />
              ]
            }
            <Route exact path="/reports/bookings/:id?" component={ ReportsBookingsList } />
            <Route exact path="/reports/bookings/:id/summary" component={ BookingSummary } />
            { can.seeStatistics && [
                <Route exact key="rc" path="/reports/charts" component={ Charts } />,
                <Route exact key="rp" path="/reports/procurement_statistics" component={ Charts } />
              ]
            }
            <Route exact path="/settings/details" component={ Details } />
            { can.manageFinance &&
              <Route exact path="/settings/billing" component={ Billing } />
            }
            <Route path="/settings/change-password" component={ ChangePassword } />
            { can.administrateCompany && [ // Switch messes with children props, so cannot wrap in div
              <Route key="tr" path="/settings/travel-policy" component={ TravelPolicy } />,
              <Route key="sd" path="/settings/details/edit" component={ EditDetails } />,
              <Route key="wr" path="/settings/work-roles" component={ WorkRoles } />,
              <Route key="dt" path="/settings/departments" component={ Departments } />,
              <Route key="rt" path="/settings/reason-for-travel" component={ TravelReasons } />,
              <Route key="lc" path="/settings/locations" component={ Locations } />
            ] }
            { can.manageReportSettings &&
              <Route key="sc" path="/settings/csv-reports" component={ CsvReports } />
            }
            { !isEmpty(can) && // fallback paths
              <Redirect path="*" to="/bookings/new" />
            }
          </Switch>
        </div>
        <AppNotifications />
        <RebrandingBanner />
      </div>
    );
  };

  render() {
    const { exportInvoicesBunchChannel, exportReceiptsBunchChannel } = this.props;

    return (
      <Router>
        <div>
          { attachAnalytics() }
          <Switch>
            <Route exact path="/privacy-policy" component={ Service } />
            <Route exact path="/terms-and-conditions" component={ Service } />
            <Route path="*" render={ this.renderAppLayout } />
          </Switch>
          <ProgressNotifications channel={ exportInvoicesBunchChannel } />
          <ProgressNotifications channel={ exportReceiptsBunchChannel } />
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(App);
