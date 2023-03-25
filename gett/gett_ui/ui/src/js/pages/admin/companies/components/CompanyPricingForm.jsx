import React, { Fragment } from 'react';
import {
  ModalForm, Input, AddressAutocomplete, Radio, MapWithPolygon,
  CheckboxGroup, VehicleCheckbox, TimePicker, DatePicker
} from 'components/form';
import { Marker } from 'components/GoogleMap';
import moment from 'moment';
import CN from 'classnames';

import css from './style';

const vehicles = [
  'BlackTaxiXL',
  'BlackTaxi',
  'Standard',
  'MPV',
  'Exec',
  'GettXL',
  'GettExpress',
  'Economy',
  'StandardXL',
  'Business',
  'Chauffeur',
  'BabySeat',
  'Wheelchair'
];

const { validations: { presence, numericality, address } } = ModalForm;

export default class CompanyPricingForm extends ModalForm {
  validations = {
    name: {
      presence: { message: 'Give this rule a name' }
    },
    vehicleTypes: {
      presence: { message: 'Select at least one vehicle type' }
    },
    pickupAddress: (value) => {
      if (this.isPointToPoint) {
        return presence(value) || address(value);
      }
    },
    destinationAddress: (value) => {
      if (this.isPointToPoint) {
        return presence(value) || address(value);
      }
    },
    pickupPolygon: (value) => {
      if (this.isArea) {
        return presence(value);
      }
    },
    baseFare: (value) => {
      if (this.isFixed) {
        return this.greaterThanZeroAndNotBlank(value);
      }
    },
    initialCost: (value) => {
      if (this.isMeter) {
        return this.greaterThanZeroAndNotBlank(value);
      }
    },
    afterDistance: (value) => {
      if (this.isMeter) {
        return this.greaterThanZeroAndNotBlank(value);
      }
    },
    afterCost: (value) => {
      if (this.isMeter) {
        return this.greaterThanZeroAndNotBlank(value);
      }
    },
    maxTime: (value) => {
      if (this.isCustom) { return; }

      if (toMinutes(this.get('minTime')) >= toMinutes(value)) {
        return 'after time should be less than before time';
      }

      function toMinutes(string) {
        const [hour, minute] = string.split(':');

        return parseInt(hour) * 60 + parseInt(minute);
      }
    },
    startingAt: (value) => {
      if (this.isCustom) {
        return presence(value);
      }
    },
    endingAt: (value) => {
      const startingAt = this.get('startingAt');

      if (this.isDaily) { return; }

      if (!value) {
        return presence(value);
      }

      if (startingAt && value.isSameOrBefore(startingAt)) {
        return 'ending at should be less than starting at';
      }
    }
  };

  get isFixed() {
    return this.get('priceType') === 'fixed';
  }

  get isMeter() {
    return this.get('priceType') === 'meter';
  }

  get isPointToPoint() {
    return this.get('ruleType') === 'point_to_point';
  }

  get isArea() {
    return this.get('ruleType') === 'area';
  }

  get isDaily() {
    return this.get('timeFrame') === 'daily';
  }

  get isCustom() {
    return this.get('timeFrame') === 'custom';
  }

  greaterThanZeroAndNotBlank(value) {
    return numericality(value, { greaterThanOrEqualTo: 0 }) || presence(value);
  }

  // custom handler just to trigger `maxTime` validation whenever `minTime`
  // value changes (when should validate on change) to have proper validation
  // behavior, since `maxTime` validation logic depends on `minTime` value
  changeMinTime(value) {
    this.set('minTime', value)
      .then(() => {
        if (this._shouldValidateOnChange()) {
          this.setError('maxTime', this.validator('maxTime'));
        }
      });
  }

  changeRuleType(ruleType) {
    const attrs = { ruleType };

    if (ruleType === 'area') {
      attrs.priceType = 'meter';
    }

    if (!this.get('id')) {
      attrs.pickupPolygon = [];
      attrs.destinationPolygon = [];
    }

    this.set(attrs);
  }

  changeTimeFrame(timeFrame) {
    let attrs = { timeFrame };

    if (timeFrame === 'custom' && !this.get('startingAt')) {
      attrs = { ...attrs, startingAt: moment(), endingAt: moment() };
    }

    this.set(attrs);
  }

  $render($) {
    const pickup = this.get('pickupAddress');
    const destination = this.get('destinationAddress');

    if (!this.props.visible) return null;

    return (
      <div>
        <Input { ...$('name') } label="Rule Name" labelClassName="required mb-5" className="mb-20" />

        <p className="light-text text-16 mb-5">Time</p>
        <Radio.Group { ...$('timeFrame')(this.changeTimeFrame) } className="layout horizontal mb-20">
          <Radio.Button className="bold-text flex text-center" value="daily">Daily</Radio.Button>
          <Radio.Button className="bold-text flex text-center" value="custom">Custom</Radio.Button>
        </Radio.Group>

        { this.isDaily &&
          <Fragment>
            <div className="layout horizontal wrap">
              <div className="layout horizontal center mr-20 mb-30">
                <label className="mr-10 bold-text dark-grey-text text-12">After</label>
                <TimePicker { ...$('minTime')(this.changeMinTime) } mode="string" />
              </div>
              <div className="layout horizontal center mb-30">
                <label className="mr-10 bold-text dark-grey-text text-12">Before</label>
                <TimePicker { ...$('maxTime') } mode="string" />
              </div>
            </div>
          </Fragment>
        }

        { this.isCustom &&
          <Fragment>
            <div className="layout horizontal center mb-20">
              <label className="mr-10 bold-text dark-grey-text text-12">Starting</label>
              <DatePicker
                { ...$('startingAt') }
                allowClear={ false }
                className="ml-5 w-130"
              />
              <TimePicker
                { ...$('startingAt') }
                className="ml-5 ml-20"
                error=""
              />
            </div>
            <div className="layout horizontal start mb-30">
              <label className="mr-15 mt-10 bold-text dark-grey-text text-12">Ending</label>
              <DatePicker
                { ...$('endingAt') }
                allowClear={ false }
                className="ml-5 w-130"
              />
              <TimePicker
                { ...$('endingAt') }
                className="ml-5 ml-20"
                error=""
              />
            </div>
          </Fragment>
        }

        <Radio.Group { ...$('bookingType') } className="layout horizontal mb-20">
          <Radio.Button className="bold-text flex text-center" value="asap">ASAP</Radio.Button>
          <Radio.Button className="bold-text flex text-center" value="future">Future</Radio.Button>
          <Radio.Button className="bold-text flex text-center" value="both">Both</Radio.Button>
        </Radio.Group>

        <CheckboxGroup { ...$('vehicleTypes') } className={ CN('layout horizontal wrap around-justified mb-20 mt-20', css.checkboxGroup) }>
          { vehicles.map(name => (
              <VehicleCheckbox key={ name } vehicle={ name } value={ name } className={ CN(css.vehicleType, 'p-10 mb-20') } />
            ))
          }
        </CheckboxGroup>

        <Radio.Group { ...$('ruleType')(this.changeRuleType) } className="layout horizontal mb-20">
          <Radio.Button className="bold-text flex text-center" value="point_to_point">Point to point</Radio.Button>
          <Radio.Button className="bold-text flex text-center" value="area">Area</Radio.Button>
        </Radio.Group>

        { this.isPointToPoint &&
          <AddressAutocomplete
            { ...$('pickupAddress') }
            label="Pick up address"
            className="mb-20"
            labelClassName="required mb-5"
          />
        }

        <MapWithPolygon { ...$('pickupPolygon') } width="100%" height={ 250 } fitBounds className="mb-20">
          { pickup && pickup.lat && pickup.lng && <Marker position={ [pickup.lat, pickup.lng] } icon="start" title="Pick up address" /> }
        </MapWithPolygon>

        { this.isPointToPoint &&
          <div>
            <AddressAutocomplete
              { ...$('destinationAddress') }
              label="Destination address"
              className="mb-20"
              labelClassName="required mb-5"
            />

            <MapWithPolygon { ...$('destinationPolygon') } width="100%" height={ 250 } fitBounds className="mb-20">
              { destination && destination.lat && destination.lng && <Marker position={ [destination.lat, destination.lng] } icon="finish" title="Destination address" /> }
            </MapWithPolygon>

            <Radio.Group { ...$('priceType') } className={ `${css.radio} layout horizontal mb-20` }>
              <Radio.Button className="bold-text flex text-center" value="fixed">Fixed price</Radio.Button>
              <Radio.Button className="bold-text flex text-center" value="meter">Internal meter price</Radio.Button>
            </Radio.Group>
          </div>
        }

        { this.isFixed &&
          <Input
            { ...$('baseFare') }
            label="Base fare"
            addonAfter="£"
            className="mb-20"
            labelClassName="required mb-5"
          />
        }
        { this.isMeter &&
          <div className="layout horizontal start wrap">
            <p className="full-width light-text text-16 mb-5">Base Fare</p>
            <Input
              { ...$('initialCost') }
              label="Initial cost"
              addonAfter="£"
              className="flex mb-20 xs-full-width"
              labelClassName="required mb-5"
            />
            <div className="mt-30 ml-5 mr-5">+</div>
            <Input
              { ...$('afterDistance') }
              label="After"
              addonAfter="mi"
              className="flex mb-20"
              labelClassName="required mb-5"
            />
            <div className="mt-30 ml-5 mr-5">*</div>
            <Input
              { ...$('afterCost') }
              label="Cost"
              addonAfter="£ per mi"
              className="flex mb-20"
              labelClassName="required mb-5"
            />
          </div>
        }
      </div>
    );
  }
}
