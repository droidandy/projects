import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindState } from 'components/form';
import SystemForm from './components/SystemForm';
import { debounce, isEqual, isEmpty } from 'lodash';
import { notification } from 'components';
import dispatchers from 'js/redux/admin/settings.dispatchers';

const saveDebounce = 2000;

function mapStateToProps(state) {
  return { settings: state.settings.system };
}

class System extends PureComponent {
  static propTypes = {
    settings: PropTypes.shape({
      deploymentNotification: PropTypes.string,
      vehicles: PropTypes.object
    }),
    getSystemSettings: PropTypes.func,
    updateDeploymentNotification: PropTypes.func,
    updateVehicleField: PropTypes.func,
    updateDdiPhone: PropTypes.func
  };

  state = {
    form: {}
  };

  static getDerivedStateFromProps({ settings }, { form, prevSettings }) {
    if (!isEqual(prevSettings, settings) || isEmpty(form)) {
      return {
        prevSettings: settings,
        form: settings
      };
    }
    return null;
  }

  componentDidMount() {
    this.props.getSystemSettings();
  }

  saveDeploymentNotification() {
    const value = this.state.form.deploymentNotification;

    this.props.updateDeploymentNotification(value)
      .then(() => notification.success('Deployment notification successfully updated'));
  }

  saveVehicleField(vehicleName, field) {
    const systemVehicleName = this.props.settings.vehicles[vehicleName].name;
    const value = this.state.form.vehicles[vehicleName][field];

    this.props.updateVehicleField({
      key: vehicleName,
      vehicleName: systemVehicleName,
      field,
      value
    }).then(() => notification.success('Field successfully updated'));
  }

  saveDdiPhone(type) {
    const phone = this.state.form.ddi[type];

    this.props.updateDdiPhone({ type, phone })
      .then(() => notification.success('Phone successfully updated'));
  }

  saveSettings = (kind, ...args) => {
    if (!kind) {
      this.clearDebounce('cancel');
    } else {
      if (!this.debouncedSave) {
        const handlers = {
          deploymentNotification: 'saveDeploymentNotification',
          vehicleField: 'saveVehicleField',
          ddiPhone: 'saveDdiPhone'
        };

        this.debouncedSave = debounce(this[handlers[kind]].bind(this, ...args), saveDebounce);
      }
      this.debouncedSave();
    }
  };

  forceSave = () => {
    this.clearDebounce('flush');
  };

  clearDebounce(method) {
    if (this.debouncedSave) {
      this.debouncedSave[method]();
      this.debouncedSave = null;
    }
  }

  render() {
    return (
      <SystemForm
        { ...bindState(this) }
        onRequestSave={ this.saveSettings }
        onInputBlur={ this.forceSave }
      />
    );
  }
}

export default connect(mapStateToProps, dispatchers.mapToProps)(System);
