import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { put, gettAnalytics } from 'utils';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindState } from 'components/form';
import { PassengerForm } from 'pages/shared/passengers/components';
import { FavoriteAddresses, PaymentCards, MemberChangeLog } from './components';
import { notification } from 'components';
import dispatchers from 'js/redux/admin/members.dispatchers';

const { TabPane } = Tabs;

function mapStateToProps(state, { match: { params: { id } }}) {
  return {
    id,
    data: state.members.formData,
    userId: state.app.session.id
  };
}

class EditMember extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    getFormData: PropTypes.func,
    saveUser: PropTypes.func,
    userId: PropTypes.number
  };

  state = { form: {}, loading: false };

  componentDidMount() {
    this.props.getFormData(this.props.id)
      .then(({ user }) => this.setState({ form: user }));
  }

  reinvite = () => {
    put(`/admin/members/${this.props.id}/reinvite`)
      .then(() => notification.success('Member has been re-invited'))
      .catch(() => notification.error('Something went wrong'));
  };

  saveForm = (user, form) => {
    const { saveUser } = this.props;

    this.setState({ loading: true });
    saveUser(user)
      .then(() => this.context.router.history.push('/users/members'))
      .then(() => notification.success('Member has been updated'))
      .catch((e) => {
        form.setErrors(e.response.data.errors);
        this.setState({ loading: false });
      });
  };

  sendAnalyticsEvent = (tabKey) => {
    const { id: userId, userId: bookerId, data: { companyName } } = this.props;

    if (tabKey === 'cl') {
      gettAnalytics('backoffice|users|edit|change_log', { userId, bookerId, companyName });
    }
  };

  render() {
    const { id, data } = this.props;
    const { can } = data;

    return (
      <Fragment>
        <div className="page-title mb-30">Edit User</div>
        <Tabs className="scrollable-tabs" onChange={ this.sendAnalyticsEvent }>
          <TabPane tab="Member Information" key="mi">
            <PassengerForm
              { ...bindState(this) }
              data={ data }
              onRequestSave={ this.saveForm }
              onReinvite={ this.reinvite }
              isAdminPage
              backTo="/users/members"
            />
          </TabPane>
          { can && can.editAll &&
            <TabPane tab="Favourite Addresses" key="fa">
              <FavoriteAddresses passengerId={ id } />
            </TabPane>
          }
          { can && can.seePaymentCards && can.editAll &&
            <TabPane tab="Payment Cards" key="pc">
              <PaymentCards passengerId={ id } canDelete={ can.deletePaymentCards } />
            </TabPane>
          }
          { can && can.seeLog &&
            <TabPane tab="Change Log" key="cl">
              <MemberChangeLog memberId={ id } />
            </TabPane>
          }
        </Tabs>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(EditMember);
