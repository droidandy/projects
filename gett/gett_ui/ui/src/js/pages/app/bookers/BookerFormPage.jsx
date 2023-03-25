import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CN from 'classnames';
import { put, gettAnalytics } from 'utils';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindState } from 'components/form';
import { BookerForm, ChangeLog } from './components';
import { notification } from 'components';
import dispatchers from 'js/redux/app/bookers.dispatchers';

import css from './components/style.css';

const { TabPane } = Tabs;

function mapStateToProps(state, { match: { params: { id } }}) {
  const { layout: { companyName }, memberId } = state.session;

  return {
    id,
    isAffiliate: state.session.isAffiliate,
    data: state.bookers.formData,
    companyName,
    memberId
  };
}

class BookerFormPage extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    isAffiliate: PropTypes.bool,
    getFormData: PropTypes.func,
    saveBooker: PropTypes.func,
    companyName: PropTypes.string,
    memberId: PropTypes.number
  };

  state = { form: {} };

  componentDidMount() {
    this.props.getFormData(this.props.id)
      .then(({ booker }) => this.setState({ form: booker }));
  }

  reinvite = () => {
    put(`/members/${this.props.id}/reinvite`)
      .then(() => notification.success('Booker has been re-invited'))
      .catch(() => notification.error('Something went wrong'));
  };

  saveForm = (booker, form) => {
    const { id, saveBooker } = this.props;

    saveBooker(booker)
      .then(() => this.context.router.history.push('/bookers'))
      .then(() => notification.success(`${booker.roleType === 'admin' ? 'Admin' : 'Booker'} has been ${id ? 'updated' : 'created' }`))
      .catch(e => form.setErrors(e.response.data.errors));
  };

  sendAnalyticsEvent = (tabKey) => {
    const { companyName, id: userId, memberId: bookerId } = this.props;

    if (tabKey === 'cl') {
      gettAnalytics('company_web|bookers|edit|change_log', { companyName, userId, bookerId });
    }
  };

  renderUntabbed() {
    const { data, isAffiliate } = this.props;

    return (
      <BookerForm
        { ...bindState(this) }
        data={ data }
        isAffiliate={ isAffiliate }
        onRequestSave={ this.saveForm }
        onReinvite={ this.reinvite }
      />
    );
  }

  renderTabbed() {
    const { id } = this.props;

    return (
      <Tabs className={ CN('p-20 sm-p-0 scrollable-tabs', css.mtEditable) } onChange={ this.sendAnalyticsEvent }>
        <TabPane tab="Main Info" key="mi">
          { this.renderUntabbed() }
        </TabPane>
        <TabPane tab="Change Log" key="cl">
          <ChangeLog memberId={ id } />
        </TabPane>
      </Tabs>
    );
  }

  render() {
    const { data: { can } } = this.props;

    return can.seeLog ? this.renderTabbed() : this.renderUntabbed();
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(BookerFormPage);
