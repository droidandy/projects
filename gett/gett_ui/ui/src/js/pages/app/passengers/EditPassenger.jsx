import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { put, gettAnalytics } from 'utils';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import CN from 'classnames';
import { bindState } from 'components/form';
import { PassengerForm } from 'pages/shared/passengers/components';
import { notification } from 'components';
import { FavoriteAddresses, PaymentCards, AdvancedOptions, ChangeLog } from './components';
import { pick, omit, compact } from 'lodash';
import dispatchers from 'js/redux/app/passengers.dispatchers';

const { TabPane } = Tabs;

function mapStateToProps(state, { match: { params: { id } } }) {
  const { companyName } = state.session.layout;

  return {
    id,
    data: state.passengers.formData,
    companyName
  };
}

const advancedOptionsProps = ['defaultVehicle'];

class EditPassenger extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    // route params
    id: PropTypes.string,
    // mapStateToProps
    data: PropTypes.object,
    // dispatchers
    getFormData: PropTypes.func,
    savePassenger: PropTypes.func,
    companyName: PropTypes.string
  };

  state = {
    form: {},
    advancedOptions: {},
    loading: false,
    activeTabKey: 'mi',
    firstName: '',
    lastName: ''
  };

  componentDidMount() {
    this.props.getFormData(this.props.id)
      .then(({ passenger }) => {
        this.setState({
          form: omit(passenger, advancedOptionsProps),
          advancedOptions: pick(passenger, advancedOptionsProps),
          firstName: passenger.firstName,
          lastName: passenger.lastName,
        }, () => {
          if (this.props.id) this.form.updateExcessDistance();
        });
      });
  }

  tabs = [];

  setFormRef = form => this.form = form;

  setTabsRef = (tab, index) => this.tabs[index] = tab;

  reinvite = () => {
    put(`/members/${this.props.id}/reinvite`)
      .then(() => notification.success('Passenger has been re-invited'))
      .catch(() => notification.error('Something went wrong'));
  };

  saveForm = (passenger, form) => {
    const { id, savePassenger } = this.props;
    this.setState({ loading: true });

    savePassenger(passenger)
      .then(() => this.context.router.history.push('/passengers'))
      .then(() => notification.success(`Passenger has been ${id ? 'updated' : 'created' }`))
      .catch((e) => {
        form.setErrors(e.response.data.errors);
        this.setState({ loading: false });
      });
  };

  sendAnalyticsEvent = (tabKey) => {
    const { companyName, id: userId, data: { memberId: bookerId } } = this.props;
    const eventMapping = {
      cl: 'change_log',
      fa: 'favourite_address'
    };
    const eventName = eventMapping[tabKey];

    if (eventName) {
      gettAnalytics(`company_web|passengers|edit|${eventName}`, { bookerId, userId, companyName });
    }
  };

  updateAdvancedOptions = (advancedOptions) => {
    const { id, savePassenger, companyName } = this.props;

    this.setState({ advancedOptions }, () => {
      savePassenger({ id, ...advancedOptions })
        .then(() => {
          notification.success('Options updated');
          gettAnalytics('company_web|passengers|default_car_type_changed', { userId: id, className: advancedOptions.defaultVehicle, companyName });
        })
        .catch(() => notification.error('Please fill all mandatory fields on Passenger Information'));
    });
  };

  gotoTab(pos) {
    let tabActiveIndex;
    const tabs = compact(this.tabs);
    const current = tabs.indexOf(this.state.activeTabKey);

    if (pos === 'next') {
      tabActiveIndex = current < tabs.length - 1 ? current + 1 : 0;
    } else if (pos === 'prev') {
      tabActiveIndex = current >= 0 ? current - 1 : tabs.length - 1;
    }

    this.setState({ activeTabKey: tabs[tabActiveIndex] });
  }

  nextTab = () => this.gotoTab('next');
  prevTab = () => this.gotoTab('prev');

  changeTab = (activeTabKey) => {
    this.setState({ activeTabKey }, () => {
      this.sendAnalyticsEvent(activeTabKey);
    });
  };

  render() {
    const { data, id, companyName } = this.props;
    const { advancedOptions, activeTabKey, firstName, lastName } = this.state;
    const { can, companyPaymentTypes } = data;

    const passengerName = id ? `${firstName} ${lastName}` : 'Create Passenger';

    return (
      <Fragment>
        <div className={ CN('page-title', activeTabKey === 'mi' && 'xsmb80', 'mb-30') }>{ passengerName }</div>
        <Tabs
          onNextClick={ this.nextTab }
          onPrevClick={ this.prevTab }
          activeKey={ this.state.activeTabKey }
          onChange={ this.changeTab }
          className="scrollable-tabs"
        >
          <TabPane tab="Passenger Information" key="mi" ref={ this.setTabsRef('mi', 0) }>
            <PassengerForm
              { ...bindState(this) }
              ref={ this.setFormRef }
              data={ data }
              onRequestSave={ this.saveForm }
              onReinvite={ this.reinvite }
              companyName={ companyName }
            />
          </TabPane>
          { id &&
            <TabPane tab="Favourite Addresses" key="fa" ref={ this.setTabsRef('fa', 1) }>
              <FavoriteAddresses passengerId={ id } companyName={ companyName } memberId={ data.memberId } />
            </TabPane>
          }
          { id && can && can.seePaymentCards && (can.addPaymentCards || can.deletePayemntCards) &&
            <TabPane tab="Payment Cards" key="pc" ref={ this.setTabsRef('pc', 2) }>
              <PaymentCards
                passengerId={ id }
                companyPaymentTypes={ companyPaymentTypes }
                canAdd={ can.addPaymentCards }
                canDelete={ can.deletePaymentCards }
              />
            </TabPane>
          }
          { id &&
            <TabPane tab="Advanced Options" key="ao" ref={ this.setTabsRef('ao', 3) }>
              <AdvancedOptions options={ advancedOptions } onChange={ this.updateAdvancedOptions } />
            </TabPane>
          }
          { id && can && can.seeLog &&
            <TabPane tab="Change Log" key="cl" ref={ this.setTabsRef('cl', 4) }>
              <ChangeLog memberId={ id } />
            </TabPane>
          }
        </Tabs>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(EditPassenger);
