import React from 'react';
import PropTypes from 'prop-types';
import { ModalForm, Input, TextArea, Select, DatePicker, TimePicker, Checkbox } from 'components/form';
import { Row, Col } from 'antd';
import moment from 'moment';
import { size } from 'lodash';
import { Collapse } from 'components';
import css from './settings.css';

const { Option } = Select;
const INPUTS_NUMBER = 50;

export default class CsvReportsForm extends ModalForm {
  static propTypes ={
    ...ModalForm.propTypes,
    recurrenceOptions: PropTypes.arrayOf(PropTypes.string)
  };

  validations = {
    name: 'presence',
    recurrence: 'presence',
    recurrenceStartsAt: 'presence',
    recipients: 'presence'
  };

  disabledScheduledAt = (selectingDate) => {
    return selectingDate && selectingDate.isBefore(moment(), 'day');
  };

  getEarliestAvailableTime() {
    return moment().add(5, 'minutes');
  }

  $render($) {
    const { recurrenceOptions } = this.props;
    const checkboxLength = size(this.get('headers'));

    return (
      <div id={ this.componentName }>
        <Row type="flex mt-10 sm-mt-20" gutter={ 20 }>
          <Col md={ 18 } xs={ 24 }>
            <Input
              { ...$('name') }
              label="Name"
              className="mb-20"
              labelClassName="required mb-5 grey-text text-12 bold-text"
            />
          </Col>
          <Col md={ 6 } xs={ 24 }>
            <Select
              { ...$('recurrence') }
              label="Repeat"
              className="mb-20"
              labelClassName="required mb-5 grey-text text-12 bold-text"
              containerId={ this.componentName }
            >
              { recurrenceOptions.map(opt => (
                <Option key={ opt } value={ opt }>{ opt }</Option>
              )) }
            </Select>
          </Col>
        </Row>
        <Row type="flex" gutter={ 20 }>
          <Col md={ 10 } sm={ 24 } xs={ 24 }>
            <div>
              <div className="mb-5 required grey-text text-12 bold-text">Delivery starts on</div>
              <DatePicker
                { ...$('recurrenceStartsAt') }
                allowClear={ false }
                disabledDate={ this.disabledScheduledAt }
              />
            </div>
          </Col>
          <Col md={ 8 } sm={ 16 } xs={ 16 }>
            <div className="mb-5 sm-mt-20 required grey-text text-12 bold-text">Delivery time</div>
            <TimePicker
              { ...$('recurrenceStartsAt') }
              laterThan={ this.getEarliestAvailableTime() }
              hourClassName={ css.timePicker }
              minuteClassName={ css.timePicker }
            />
          </Col>
          <Col md={ 6 } sm={ 8 } xs={ 8 }>
            <Input
              { ...$('delimiter') }
              label="CSV delimiter"
              className="mb-20"
              labelClassName="mb-5 sm-mt-20 grey-text text-12 bold-text"
            />
          </Col>
        </Row>
        <TextArea
          { ...$('recipients') }
          autosize
          label="Send to emails"
          className="mb-20"
          placeholder="Please, insert comma separated emails"
          labelClassName="required mb-5 grey-text text-12 bold-text"
        />
        { this.getError('headers') &&
          <div className="text-12 red-text">At least one of the checkboxes must be selected</div>
        }
        <Collapse showSuffix="Columns">
          <Row type="flex" gutter={ 20 } title={ `Data (${checkboxLength}/${INPUTS_NUMBER})` }>
            <Col md={ 8 } xs={ 24 } className="layout vertical">
              <Checkbox { ...$('headers.bookingId') } className="mb-20">Order ID</Checkbox>
              <Checkbox { ...$('headers.companyId') } className="mb-20">Company ID</Checkbox>
              <Checkbox { ...$('headers.companyName') } className="mb-20">Company Name</Checkbox>
              <Checkbox { ...$('headers.companyAddress') } className="mb-20">Company Address</Checkbox>
              <Checkbox { ...$('headers.companyEmail') } className="mb-20">Company Email</Checkbox>
              <Checkbox { ...$('headers.companyContact') } className="mb-20">Company Contact</Checkbox>
              <Checkbox { ...$('headers.accountManager') } className="mb-20">Account Manager</Checkbox>
              <Checkbox { ...$('headers.billingTerms') } className="mb-20">Billing Terms</Checkbox>
              <Checkbox { ...$('headers.bookingScheduledAt') } className="mb-20">Scheduled Order Date/Time</Checkbox>
              <Checkbox { ...$('headers.bookingCreatedAt') } className="mb-20">Order Creation Date/Time</Checkbox>
              <Checkbox { ...$('headers.bookingArrivedAt') } className="mb-20">Arrived At</Checkbox>
              <Checkbox { ...$('headers.bookingStartedAt') } className="mb-20">Started At</Checkbox>
              <Checkbox { ...$('headers.bookingEndedAt') } className="mb-20">Ended At</Checkbox>
              <Checkbox { ...$('headers.bookingCancelledAt') } className="mb-20">Cancelled At</Checkbox>
              <Checkbox { ...$('headers.vehicleType') } className="mb-20">Car Type</Checkbox>
              <Checkbox { ...$('headers.pickupAddress') } className="mb-20">Pickup Address</Checkbox>
              <Checkbox { ...$('headers.destinationAddress') } className="mb-20">Destination Address</Checkbox>
            </Col>
            <Col md={ 8 } xs={ 24 } className="layout vertical">
              <Checkbox { ...$('headers.stopPoint1') } className="mb-20">Stop Point 1</Checkbox>
              <Checkbox { ...$('headers.stopPoint2') } className="mb-20">Stop Point 2</Checkbox>
              <Checkbox { ...$('headers.stopPoint3') } className="mb-20">Stop Point 3</Checkbox>
              <Checkbox { ...$('headers.stopPoint4') } className="mb-20">Stop Point 4</Checkbox>
              <Checkbox { ...$('headers.paymentType') } className="mb-20">Payment Type</Checkbox>
              <Checkbox { ...$('headers.references') } className="mb-20">References</Checkbox>
              <Checkbox { ...$('headers.bookerName') } className="mb-20">Booker Name</Checkbox>
              <Checkbox { ...$('headers.passengerId') } className="mb-20">Riding User ID</Checkbox>
              <Checkbox { ...$('headers.passengerName') } className="mb-20">Riding User Name</Checkbox>
              <Checkbox { ...$('headers.passengerDepartment') } className="mb-20">Riding User Department</Checkbox>
              <Checkbox { ...$('headers.passengerWorkRole') } className="mb-20">Riding User Work Role</Checkbox>
              <Checkbox { ...$('headers.passengerCostCentre') } className="mb-20">Riding User Cost Centre</Checkbox>
              <Checkbox { ...$('headers.passengerDivision') } className="mb-20">Riding User Division</Checkbox>
              <Checkbox { ...$('headers.passengerPayroll') } className="mb-20">Riding User Payroll ID</Checkbox>
              <Checkbox { ...$('headers.passengerEmail') } className="mb-20">Riding User Email</Checkbox>
            </Col>
            <Col md={ 8 } xs={ 24 } className="layout vertical">
              <Checkbox { ...$('headers.baseFare') } className="mb-20">Base Fare</Checkbox>
              <Checkbox { ...$('headers.runInFee') } className="mb-20">Run-In Fee</Checkbox>
              <Checkbox { ...$('headers.bookingFee') } className="mb-20">Booking Fee</Checkbox>
              <Checkbox { ...$('headers.phoneBookingFee') } className="mb-20">Phone Booking Fee</Checkbox>
              <Checkbox { ...$('headers.handlingFee') } className="mb-20">Handling Fee</Checkbox>
              <Checkbox { ...$('headers.internationalFee') } className="mb-20">International Fee</Checkbox>
              <Checkbox { ...$('headers.totalFees') } className="mb-20">Total Fees</Checkbox>
              <Checkbox { ...$('headers.extra1') } className="mb-20">Extra Fee 1</Checkbox>
              <Checkbox { ...$('headers.extra2') } className="mb-20">Extra Fee 2</Checkbox>
              <Checkbox { ...$('headers.extra3') } className="mb-20">Extra Fee 3</Checkbox>
              <Checkbox { ...$('headers.waitingTimeMinutes') } className="mb-20">Waiting Time Minutes</Checkbox>
              <Checkbox { ...$('headers.waitingTimeCost') } className="mb-20">Waiting Time Cost</Checkbox>
              <Checkbox { ...$('headers.cancellationCost') } className="mb-20">Cancellation Cost</Checkbox>
              <Checkbox { ...$('headers.vat') } className="mb-20">VAT</Checkbox>
              <Checkbox { ...$('headers.finalCostExclVat') } className="mb-20">Final Cost Excl VAT</Checkbox>
              <Checkbox { ...$('headers.finalCostInclVat') } className="mb-20">Final Cost Incl VAT</Checkbox>
              <Checkbox { ...$('headers.bookingStatus') } className="mb-20">Status</Checkbox>
              <Checkbox { ...$('headers.reasonForTravel') } className="mb-20">Reason For Travel</Checkbox>
            </Col>
          </Row>
        </Collapse>
      </div>
    );
  }
}
