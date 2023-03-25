import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { TwitterWidget, FlightWidget, InternalMessageWidget, ExternalMessageWidget, CountsWidget } from './components';
import { Icon } from 'components';
import get from 'lodash/get';
import dispatchers from 'js/redux/app/dashboard.dispatchers';

import css from './Dashboard.css';

function mapStateToProps(state) {
  return {
    data: state.dashboard.data,
    currentUserRole: state.settings.role
  };
}

class Dashboard extends PureComponent {
  
  static propTypes = {
    data: PropTypes.object,
    currentUserRole: PropTypes.object,
    getDashboard: PropTypes.func,
  };
  
  componentDidMount() {
    this.props.getDashboard();
  }
  
  getValue(path, placeholder = '-') {
    return get(this.props.data, path) || placeholder;
  }
  
  get canSend() {
    return this.props.currentUserRole === 'admin';
  }
  
  render() {
    return (
      <div className="p-20 sm-p-10">
        <div className="layout horizontal wrap">
          <div className={ `flex layout horizontal wrap mr-20 sm-mr-0 ${css.widgetContainer}` } />
          <div className={ `flex layout horizontal start wrap ${css.widgetContainer}` }>
            <TwitterWidget />
            <div className={ `flex layout horizontal wrap ${css.widgetContainer}` }>
              <div className="flex sm-full-width mb-20">
                <div className={ `${css.statsCountValue} mb-20 layout horizontal light-grey-bg` }>
                  <div className="lilac-bg p-20 layout horizontal center">
                    <Icon icon="FaListAlt" className="text-40 white-text" />
                  </div>
                  <div className="flex layout horizontal center p-20">
                    <div>
                      <div className="text-uppercase bold-text text-12 light-grey-text">Total number of orders taken</div>
                      <div className="text-24 lilac-text light-text">{ this.getValue('ordersCount', 0) }</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="layout horizontal wrap">
          <div className={ `flex layout horizontal wrap mr-20 sm-mr-0 ${css.widgetContainer}` }>
            <FlightWidget />
            <ExternalMessageWidget showForm={ this.canSend } className="flex sm-full-width" />
          </div>
          <div className={ `flex layout horizontal start wrap ${css.widgetContainer}` }>
            <InternalMessageWidget showForm={ this.canSend } className="flex sm-full-width mr-20 xs-mr-0 mb-20" />
            <CountsWidget />
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, dispatchers.mapToProps)(Dashboard);
