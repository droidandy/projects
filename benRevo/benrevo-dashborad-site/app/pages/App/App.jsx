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
import { Image } from 'semantic-ui-react';
import { loggedIn } from 'utils/authService/lib';
import { SideNavigation } from '@benrevo/benrevo-react-core';
import navigation from './navigation';
import Header from './Header';
import { carrierName, CARRIER } from '../../config';
import HeaderAccess from './Header/HeaderAccess';
import HeaderAdmin from './Header/HeaderAdmin';
import { ACCESS_STATUS_STOP } from '../Client/Details/constants';
import AlertError from '../../assets/img/svg/alert-error.svg';
import AlertWarning from '../../assets/img/svg/alert-warning.svg';
import AlertInfo from '../../assets/img/svg/alert-info.svg';
import AlertSuccess from '../../assets/img/svg/alert-success.svg';
import IconMenu1 from '../../assets/img/svg/icon-menu1.svg';
import IconMenu2 from '../../assets/img/svg/icon-menu2.svg';
import IconMenu3 from '../../assets/img/svg/icon-menu3.svg';
import IconMenu4 from '../../assets/img/svg/icon-menu4.svg';
import IconMenu5 from '../../assets/img/svg/icon-menu5.svg';

class App extends React.Component { // eslint-disable-line react/prefer-stateless-function
  componentWillMount() {
    const { checkRole, setCheckingRole, clearStore } = this.props;
    clearStore();
    if (loggedIn()) {
      checkRole();
    } else {
      setCheckingRole(false);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { getClients, getCarriers } = this.props;

    if (!nextProps.checkingRole && this.props.checkingRole && loggedIn()) {
      /* if (role === ROLE_SUPERADMIN || role === ROLE_CARRIER_MANAGER) {
        getPersons();
      }
      getBrokers(); */
      getCarriers();
      getClients();
    }
  }

  render() {
    const { notifications, accessStatus, client, changeAccessStatus, routes, params, rfpClient, products } = this.props;
    const showAccess = this.props.location.pathname.indexOf('client') === 0 && this.props.location.pathname.indexOf('clients') !== 0 && accessStatus !== ACCESS_STATUS_STOP;
    const showAdmin = routes && routes[1].name === 'prequote' && routes.length > 3;
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
    const clientLink = `/client${client.clientId ? `/${client.clientId}` : ''}`;

    if (!this.props.checkingRole) {
      return (
        <div id="container-center" className="container-center">
          <Notifications
            notifications={notifications}
            style={style}
          />
          <div id="container-pushable">
            <Helmet
              titleTemplate={`%s - Dashboard - ${carrierName}`}
              defaultTitle={`Dashboard - ${carrierName}`}
              meta={[
                { name: 'description', content: carrierName },
              ]}
            />
            <div id="container-pusher">
              { loggedIn() &&
                <div>
                  <div className="menu-left">
                    <Link to="/" activeClassName="active"><Image src={IconMenu1} centered /></Link>
                    <Link to="/clients" activeClassName="active"><Image src={IconMenu2} centered /></Link>
                    <Link to={clientLink} activeClassName="active"><Image src={IconMenu3} centered /></Link>
                    { CARRIER === 'ANTHEM' && <Link to="/rewards" activeClassName="active"><Image src={IconMenu4} centered /></Link> }
                    { CARRIER === 'ANTHEM' && <Link to="/prequote/clients" activeClassName="active"><Image src={IconMenu5} centered /></Link> }
                  </div>
                  {
                    showAdmin
                      &&
                      <div className="side-menu">
                        <SideNavigation navigation={navigation(products)} urlPrefix={`/prequote/clients/${params.clientId || 'new'}`} clientName={rfpClient.clientName || '-'} />
                      </div>
                  }
                </div>
              }
              <div className={`content ${showAdmin && 'content-shifted'}`}>
                { !showAccess && !showAdmin && <Header location={this.props.location.pathname} /> }
                { showAdmin && <HeaderAdmin /> }
                { showAccess && loggedIn() && <HeaderAccess client={client} accessStatus={accessStatus} changeAccessStatus={changeAccessStatus} /> }
                <div className="content-inner">
                  {React.Children.toArray(this.props.children)}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    return (
      <div />
    );
  }
}

App.propTypes = {
  notifications: PropTypes.array,
  routes: PropTypes.array,
  client: PropTypes.object,
  params: PropTypes.object,
  rfpClient: PropTypes.object,
  products: PropTypes.object,
  accessStatus: PropTypes.string,
  children: PropTypes.node,
  setCheckingRole: PropTypes.func,
  changeAccessStatus: PropTypes.func,
  clearStore: PropTypes.func,
  checkRole: PropTypes.func,
  getCarriers: PropTypes.func,
  getClients: PropTypes.func,
  checkingRole: PropTypes.bool,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
};

export default App;
