import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { message } from 'antd';
import { bindState } from 'components/form';
import { EditDetailsForm } from './components';
import dispatchers from 'js/redux/app/settings.dispatchers';

function mapStateToProps(state) {
  return { settings: state.settings.data };
}

class EditDetails extends PureComponent {
  static propTypes = {
    settings: PropTypes.object,
    getCompanySettings: PropTypes.func,
    updateCompanySettings: PropTypes.func
  };

  static contextTypes = {
    router: PropTypes.object
  };

  componentDidMount() {
    this.props.getCompanySettings();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ form: nextProps.settings });
  }

  updateSettings = (settings) => {
    this.props.updateCompanySettings({ company: settings })
      .then(() => this.context.router.history.push('/settings/details'))
      .then(() => message.success('Company Details updated'));
  };

  render() {
    return (
      <EditDetailsForm { ...bindState(this) } onRequestSave={ this.updateSettings } />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(EditDetails);
