import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Tabs } from 'antd';
import { bindState } from 'components/form';
import { UserForm } from './components';
import { notification } from 'components';
import dispatchers from 'js/redux/admin/users.dispatchers';

const { TabPane } = Tabs;

function mapStateToProps(state, { match: { params: { id } } }) {
  return {
    id,
    data: state.users.formData
  };
}

class EditUser extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    id: PropTypes.string,
    data: PropTypes.object,
    getFormData: PropTypes.func,
    saveUser: PropTypes.func,
    verifyEmail: PropTypes.func
  };

  state = { form: {}, loading: false };

  componentDidMount() {
    this.props.getFormData(this.props.id)
      .then(({ user }) => this.setState({ form: user }));
  }

  saveForm = (user, form) => {
    const { id, saveUser } = this.props;

    this.setState({ loading: true });

    saveUser(user)
      .then(() => this.context.router.history.push('/users/admins'))
      .then(() => notification.success(`User has been ${id ? 'updated' : 'created' }`))
      .catch((e) => {
        form.setErrors(e.response.data.errors);
        this.setState({ loading: false });
      });
  };

  get title() {
    const { data } = this.props;
    return data && data.user && data.user.id ? 'Edit User' : 'Add New User';
  }

  render() {
    const { data, verifyEmail } = this.props;
    return (
      <Fragment>
        <div className="page-title mb-30">
          { this.title }
        </div>
        <Tabs>
          <TabPane tab="Main Info" key="mi">
            <UserForm
              { ...bindState(this) }
              data={ data }
              onRequestSave={ this.saveForm }
              verifyEmail={ verifyEmail }
            />
          </TabPane>
        </Tabs>
      </Fragment>
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(EditUser);
