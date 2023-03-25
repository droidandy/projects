import React from 'react';
import PropTypes from 'prop-types';
import { ModalForm, Input, Select } from 'components/form';
import { Row, Col, Spin } from 'antd';
import { statusLabels, chargesLabels, pricingStatuses } from 'pages/shared/bookings/data';
import { camelize } from 'utils/transform';
import { map, sum, round } from 'lodash';

const { Option } = Select;

export default class PricingForm extends ModalForm {
  static propTypes = {
    ...ModalForm.propTypes,
    readonly: PropTypes.bool,
    loading: PropTypes.bool,
    fees: PropTypes.object,
    vatRate: PropTypes.number,
    fareQuote: PropTypes.number
  };

  validations = {
    'charges.fareCost': 'numericality',
    'charges.paidWaitingTimeFee': 'numericality',
    'charges.tips': 'numericality',
    'charges.handlingFee': 'numericality',
    'charges.bookingFee': 'numericality',
    'charges.phoneBookingFee': 'numericality',
    'charges.runInFee': 'numericality',
    'charges.extra1': 'numericality',
    'charges.extra2': 'numericality',
    'charges.extra3': 'numericality',
    'charges.stopsFee': 'numericality',
    'charges.additionalFee': 'numericality',
    'charges.cancellationFee': 'numericality'
  };

  fees(vatable) {
    const { fees } = this.props;
    const status = this.get('booking.status');

    if (!fees || !fees[status]) return [];

    if (!vatable) return this.fees('vatable').concat(this.fees('nonVatable'));

    return map(fees[status][vatable], camelize);
  }

  vat() {
    const { vatRate } = this.props;
    const vatableFees = this.fees('vatable');
    const vatableCharges = map(vatableFees, fee => parseFloat(this.get(`charges.${fee}`)));
    return round(sum(vatableCharges) * vatRate, 2);
  }

  total() {
    const charges = map(this.fees(), fee => parseFloat(this.get(`charges.${fee}`)));
    return round(sum(charges), 2) + this.vat();
  }

  renderReadOnlyLine(label, amount, labelClass = 'text-right') {
    return (
      <Row gutter={ 10 } type="flex" className="mb-10" key={ label }>
        <Col md={ 18 } type="flex" className={ `text-16 ${labelClass}` } >
          { label }
        </Col>
        <Col md={ 6 } type="flex" className="text-right text-16 bold-text">
          { this.renderAmount(amount) }
        </Col>
      </Row>
    );
  }

  renderCharge(fee) {
    const { readonly } = this.props;

    if (readonly) {
      return this.renderReadOnlyLine(chargesLabels[fee], this.get(`charges.${fee}`), '');
    }

    return (
      <Row gutter={ 10 } type="flex" key={ fee }>
        <Col md={ 17 } type="flex" className="vertical-middle text-16">{ chargesLabels[fee] }</Col>
        <Col md={ 7 } type="flex" className="text-right">
          <Input
            { ...this.$(`charges.${fee}`) }
            addonAfter="£"
            className="mb-10"
          />
        </Col>
      </Row>
    );
  }

  renderDivider(label) {
    return (
      <div className="separator border-top mb-20 mt-10">
        { label &&
          <span className="separator-label text-12 grey-text">{ label }</span>
        }
      </div>
    );
  }

  renderCharges(vatable) {
    const fees = this.fees(vatable);

    if (fees.length === 0) return null;

    return (
      <div>
        { this.renderDivider(chargesLabels[vatable]) }
        { map(fees, fee => this.renderCharge(fee)) }
      </div>
    );
  }

  statusOptions() {
    return map(pricingStatuses, status =>
      <Option key={ status }>{ statusLabels[status] }</Option>
    );
  }

  bookerOptions() {
    const { bookers } = this.props;

    return map(bookers, booker =>
      <Option key={ booker.id }>{ booker.fullName }</Option>
    );
  }

  renderAmount(value) {
    return (
      <span className="bold-text">
        £{ (value || 0).toFixed(2) }
      </span>
    );
  }

  $render($) {
    const { loading, readonly, fareQuote } = this.props;
    const isCompleted = (this.get('booking.status') === 'completed');
    const isBilled = (this.get('booking.indicatedStatus') === 'billed');

    return (
      <Spin spinning={ !!loading }>
        <Row gutter={ 10 } type="flex" id={ this.componentName }>
          <Col md={ 10 } xs={ 20 } type="flex">
            <Select
              { ...$('booking.status') }
              placeholder="Please select status"
              label="Status"
              labelClassName="mb-5"
              className="mb-10"
              disabled={ readonly }
              containerId={ this.componentName }
            >
              { this.statusOptions() }
            </Select>
          </Col>
          <Col md={ 14 } xs={ 28 }>
            <Select
              { ...$('booking.bookerId') }
              placeholder="Please select booker"
              label="Booker"
              labelClassName="mb-5"
              className="mb-10"
              containerId={ this.componentName }
              disabled={ isBilled }
            >
              { this.bookerOptions() }
            </Select>
          </Col>
        </Row>
        { !isCompleted && this.renderReadOnlyLine('Fare quote', fareQuote) }
        { this.renderCharges('nonVatable') }
        { this.renderCharges('vatable') }
        { this.renderDivider() }
        { this.renderReadOnlyLine('VAT', this.vat()) }
        { this.renderReadOnlyLine('Total cost', this.total()) }
      </Spin>
    );
  }
}
