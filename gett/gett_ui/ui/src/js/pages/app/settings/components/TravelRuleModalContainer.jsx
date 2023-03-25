import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connectAdvanced } from 'react-redux';
import { Tabs, Modal } from 'antd';
import gettAnalytics from 'utils/gettAnalytics';
import { notification } from 'components';
import { bindState } from 'components/form';
import TravelRuleChangeLog from './TravelRuleChangeLog';
import TravelRuleForm from './TravelRuleForm';
import update from 'update-js/fp';

import dispatchers from 'js/redux/app/settings.dispatchers';

const { TabPane } = Tabs;

function buildTravelRule() {
  return {
    minTime: '00:00',
    maxTime: '23:59',
    weekdays: ['1', '2', '3', '4', '5', '6', '7'],
    allowUnregistered: true
  };
}

function mapStateToProps(state) {
  const { layout: { companyName }, memberId: userId } = state.session;

  return { rules: state.settings.travelRules.list, companyName, userId };
}

class TravelRuleModalContainer extends PureComponent {
  static propTypes = {
    rules: PropTypes.arrayOf(PropTypes.object),
    getTravelRules: PropTypes.func,
    getTravelRuleFormData: PropTypes.func,
    saveTravelRule: PropTypes.func,
    userId: PropTypes.number,
    companyName: PropTypes.string
  };

  state = {
    form: {}
  };

  show = (rule = buildTravelRule()) => {
    this.props.getTravelRuleFormData()
      .then((data) => {
        if (!this.state.form.id) {
          this.setState(update('form.vehiclePks', data.vehicles.map(v => v.id.toString())));
        }
      });
    this.setState({ visible: true, form: rule });
  };

  close = () => {
    this.setState({ visible: false, form: {} });
  };

  saveForm = (rule, form) => {
    const { saveTravelRule, getTravelRules } = this.props;

    saveTravelRule(rule)
      .then(this.close)
      .then(() => getTravelRules())
      .then(() => notification.success(`Rule has been ${rule.id ? 'updated' : 'created'}`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  getRuleName(id) {
    return this.props.rules.find(rule => rule.id == id).name;
  }

  sendAnalyticsEvent = (tabKey) => {
    const { companyName, userId } = this.props;
    const { id: travelRuleId } = this.state.form;

    if (tabKey === 'cl') {
      gettAnalytics('company_web|travel_policy|change_log', { companyName, userId, travelRuleId });
    }
  };

  renderModal(content) {
    const { form, visible } = this.state;

    return (
      <Modal
        visible={ visible }
        title={ form && form.id ? `Edit Rule "${this.getRuleName(form.id)}"` : 'New Rule' }
        width={ 930 }
        onCancel={ this.close }
        footer={ null }
      >
        { content }
      </Modal>
    );
  }

  renderForm() {
    return (
      <TravelRuleForm
        { ...bindState(this) }
        onRequestSave={ this.saveForm }
        onRequestClose={ this.close }
      />
    );
  }

  render() {
    const { form } = this.state;

    if (!form.id) {
      return this.renderModal(this.renderForm());
    }

    return this.renderModal(
      <Tabs className="p-20 sm-p-0 scrollable-tabs" onChange={ this.sendAnalyticsEvent } animated={ false }>
        <TabPane tab="Travel Rule Information" key="mi">
          { this.renderForm() }
        </TabPane>
        <TabPane tab="Change Log" key="cl">
          <TravelRuleChangeLog travelRuleId={ form.id } />
        </TabPane>
      </Tabs>
    );
  }
}

function selectorFactory(dispatch) {
  return (nextState, ownProps) => ({
    ...ownProps,
    ...mapStateToProps(nextState),
    ...dispatchers(dispatch, ['getTravelRuleFormData', 'saveTravelRule', 'getTravelRules'])
  });
}

export default connectAdvanced(selectorFactory, { forwardRef: true })(TravelRuleModalContainer);
