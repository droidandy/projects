import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import { notification } from 'components';
import { bindState } from 'components/form';
import { EditDetailsForm } from './components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { data: state.settings.account.data };
}

class EditDetails extends PureComponent {
  static contextTypes = {
    router: PropTypes.object
  };

  static propTypes = {
    data: PropTypes.object,
    getCompanySettings: PropTypes.func,
    updateCompanySettings: PropTypes.func
  };

  state = {
    form: {},
  };

  componentDidMount() {
    const { data, getCompanySettings } = this.props;

    getCompanySettings();
    this.setState({ form: data });
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (!isEqual(prevProps.data, data)) {
      this.setState({ form: data });
    }
  }

  updateSettings = (settings) => {
    this.props.updateCompanySettings({ company: settings })
      .then(() => this.context.router.history.push('/settings/details'))
      .then(() => notification.success('Company Details updated'));
  };

  render() {
    return (
      <EditDetailsForm { ...bindState(this) } onRequestSave={ this.updateSettings } />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(EditDetails);
