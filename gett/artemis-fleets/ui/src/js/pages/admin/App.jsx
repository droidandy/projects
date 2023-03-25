/* eslint-disable react/jsx-first-prop-new-line */

import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import auth from 'utils/auth';
import { Row } from 'antd';
import { Icon, NavMenuItem, ButtonLink } from 'components';
import { CompaniesList, CompanyEdit } from 'pages/admin/companies';
import { Notifications } from 'pages/admin/notifications';
import dispatchers from 'js/redux/admin/app.dispatchers';

function signOut() {
  auth.revoke();
}

const navItems = [
  { title: 'Companies', icon: 'FaBuilding', to: '/companies' },
  { title: 'Notifications', icon: 'MdNotifications', to: '/notifications' },
];

function mapStateToProps(state) {
  return {
    salesmen: state.app.salesmen
  };
}

class App extends PureComponent {
  static propTypes = {
    salesmen: PropTypes.arrayOf(PropTypes.object),
    getSalesmen: PropTypes.func
  };

  componentDidMount() {
    const { salesmen, getSalesmen } = this.props;

    // NOTE: at this point, list of salesmen is pretty much static and we can
    // load it once on application start.
    if (salesmen.length === 0) {
      getSalesmen();
    }
  }

  render() {
    return (
      <Router basename="/admin">
        <div>
          <div className="header">
            <div className="pt-10 pb-10 pl-20">
              <Link className="black-text" to="/">
                <Icon icon="LogoOT" className="logo-ot" />
              </Link>
            </div>
            <Row type="flex" align="middle" justify="space-between" className="title relative text-uppercase navy-text text-20 pr-20 pl-20">
              Companies
              <Route exact path="/companies" render={ () => (
                <ButtonLink to="/company/new" type="primary">
                  <Icon className="text-20 mr-10" icon="MdAdd" />
                  New Company
                </ButtonLink>
              ) } />
            </Row>
          </div>
          <div className="sidebar layout vertical">
            <div className="text-center white-text text-22 p-20">Gett Enterprise Back Office</div>
            { navItems.map((item, i) => <NavMenuItem key={ i } item={ item } />) }
            <div className="white-text p-10 pl-15 pointer justified-end" onClick={ signOut }>
              <Icon icon="FaSignOut" className="text-22 mr-10" />
              Logout
            </div>
          </div>
          <div className="content p-20">
            <Switch>
              <Redirect exact path="/" to="/companies" />
              <Route path="/companies" component={ CompaniesList } />
              <Route path="/company/new" component={ CompanyEdit } />
              <Route path="/company/:id/edit" component={ CompanyEdit } />
              <Route path="/notifications" component={ Notifications } />
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(App);
