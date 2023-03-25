import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Form, { Input, TextEditor, PhoneInput } from 'components/form';
import { VehicleType, Button, Desktop, Tablet } from 'components';
import { notification } from 'antd';
import CN from 'classnames';

import css from './style.css';

import { predefinedDdis, ddiLabels } from 'pages/admin/companies/data';

const vehicles = [{
  name: 'blackTaxiXl',
  type: 'BlackTaxiXL'
}, {
  name: 'blackTaxi',
  type: 'BlackTaxi'
}, {
  name: 'standard',
  type: 'Standard'
}, {
  name: 'mpv',
  type: 'MPV'
}, {
  name: 'exec',
  type: 'Exec'
}];
const preEtaVehicles = ['Standard', 'MPV', 'Exec'];

export default class SystemForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    onInputBlur: PropTypes.func
  };

  checkNotification = () => {
    notification.open({
      message: 'Last Deploy',
      description: <div className="rte-container" dangerouslySetInnerHTML={ { __html: this.get('deploymentNotification') } } />
    });
  };

  changeDeploymentNotification(value) {
    this.updateSystemSetting({
      name: 'deploymentNotification',
      value,
      validateWith: 'presence'
    }, () => this.props.onRequestSave('deploymentNotification'));
  }

  changeVehicleField(vehicleName, fieldName, value) {
    this.updateSystemSetting({
      name: `vehicles.${vehicleName}.${fieldName}`,
      value,
      validateWith: { presence: true, numericality: { greaterThan: 0 } },
    }, () => this.props.onRequestSave('vehicleField', vehicleName, fieldName));
  }

  changeDdiPhone(type, value) {
    this.updateSystemSetting({
      name: `ddi.${type}`,
      value,
      validateWith: 'presence',
    }, () => this.props.onRequestSave('ddiPhone', type));
  }

  updateSystemSetting({ name, value, validateWith }, callback) {
    const error = this.validator(name, { value, with: validateWith });

    this.set(name, value);

    // execute error assignment in next execution frame when attribute is set,
    // since it's setting also does error assignment under the hood that is based
    // on *current* errors, not the ones we are about to assign here.
    setTimeout(() => {
      if (error) {
        this.setErrors({ ...this.getErrors(), [name]: error }, () => {
          this.props.onRequestSave(false);
        });
      } else {
        callback();
      }
    }, 0);
  }

  renderVehicle(type) {
    return (
      <div>
        <Desktop>
          <div>
            <div className="text-center bold-text mb-15">{ type }</div>
            <div className="light-grey-bg p-10">
              <VehicleType className="center-block" size="big" type={ type } />
            </div>
          </div>
        </Desktop>
        <Tablet>
          <div className="mb-20 h-80">
            <div className="text-center bold-text mb-15">{ type }</div>
            <div className="light-grey-bg p-10">
              <VehicleType className="center-block" size="small" type={ type } />
            </div>
          </div>
        </Tablet>
      </div>
    );
  }

  $render($) {
    const { onInputBlur } = this.props;

    return (
      <Fragment>
        <div className="page-title mb-30">System</div>
        <div className="layout horizontal sm-wrap">
          <div className="mr-20 w-200 sm-full-width sm-mb-10">Text of deployment notification</div>
          <div className="flex sm-full-width">
            <TextEditor
              { ...$('deploymentNotification')(this.changeDeploymentNotification) }
              onBlur={ onInputBlur }
            />
            <div>{ 'Use {deployment_time} expression to insert time of deployment into notification' }</div>
            <Button className="mt-10" type="secondary" onClick={ this.checkNotification }>Check</Button>
          </div>
        </div>
        <Desktop>
          <div>
            <div className={ CN(css.indent, css.wrapper, 'layout horizontal center mt-30 mb-20') }>
              { vehicles.map(vehicle => (
                  <div key={ vehicle.type }>
                    { this.renderVehicle(vehicle.type) }
                  </div>
                ))
              }
            </div>
            <div className="layout horizontal mb-20">
              <div className="mr-20 w-200">The minimum allowed time to book a Future Order</div>
              <div className={ `flex layout horizontal wrap ${css.wrapper}` }>
                { vehicles.map(vehicle => (
                    <Input
                      { ...$(`vehicles.${vehicle.type}.earliestAvailableIn`)(this.changeVehicleField, vehicle.type, 'earliestAvailableIn') }
                      key={ vehicle.type }
                      addonAfter="min"
                      className="w-140"
                      onBlur={ onInputBlur }
                    />
                  ))
                }
              </div>
            </div>
            <div className="layout horizontal">
              <div className="mr-20 w-200">Pre-eta for OT cars</div>
              <div className={ `flex layout horizontal wrap end-justified ${css.wrapper}` }>
                { preEtaVehicles.map(vehicle => (
                    <Input
                      { ...$(`vehicles.${vehicle}.preEta`)(this.changeVehicleField, vehicle, 'preEta') }
                      key={ vehicle }
                      addonAfter="min"
                      className="w-140"
                      onBlur={ onInputBlur }
                    />
                  ))
                }
              </div>
            </div>
          </div>
        </Desktop>

        <Tablet>
          <div className="mt-20 layout horizontal end">
            <div className="flex mr-20 xs-mr-5" />
            <div className="flex mr-20 xs-mr-5">The minimum allowed time to book a Future Order</div>
            <div className="flex">Pre-eta for OT cars</div>
          </div>
          <div className="layout horizontal">
            <div className="flex layout vertical mr-20 xs-mr-5">
              { vehicles.map(vehicle => (
                  <div key={ vehicle.type }>
                    { this.renderVehicle(vehicle.type) }
                  </div>
                ))
              }
            </div>
            <div className="flex layout vertical mr-20 xs-mr-5">
              { vehicles.map(vehicle => (
                  <div key={ vehicle.type } className="h-80 mb-20 layout horizontal end">
                    <Input
                      { ...$(`vehicles.${vehicle.type}.earliestAvailableIn`)(this.changeVehicleField, vehicle.type, 'earliestAvailableIn') }
                      addonAfter="min"
                      onBlur={ onInputBlur }
                    />
                  </div>
                ))
              }
            </div>
            <div className="flex layout vertical end-justified">
              { preEtaVehicles.map(vehicle => (
                  <div key={ vehicle } className="h-80 mb-20 layout horizontal end">
                    <Input
                      { ...$(`vehicles.${vehicle}.preEta`)(this.changeVehicleField, vehicle, 'preEta') }
                      addonAfter="min"
                      onBlur={ onInputBlur }
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </Tablet>
        <div className="mt-20">
          <div className="mb-10">Default DDIs</div>
          <div className="layout horizontal mb-10">
            <div className="mr-20 w-200 sm-w-50">Name</div>
            <div className={ CN(css.wrapper, 'flex layout horizontal') }>
              { predefinedDdis.map(ddi => (
                  <div className="flex" key={ ddi }>{ ddiLabels[ddi] }</div>
                ))
              }
            </div>
          </div>
          <div className="layout horizontal">
            <div className="mr-20 sm-mr-10 w-200 sm-w-50">Value</div>
            <div className={ CN(css.wrapper, 'flex layout horizontal') }>
              { predefinedDdis.map(ddi => (
                  <div className="flex" key={ ddi }>
                    <PhoneInput
                      { ...$(`ddi.${ddi}`)(this.changeDdiPhone, ddi) }
                      onBlur={ onInputBlur }
                    />
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
