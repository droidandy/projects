import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Row, Tooltip, Checkbox as AntCheckbox } from 'antd';
import Form, { Input, TextArea, Select, Checkbox, AddressAutocomplete, UserSelector, ImageEditor, DatePicker, PhoneInput } from 'components/form';
import { Icon, ButtonLink, Button, Desktop } from 'components';
import ReferenceOption from './ReferenceOption';
import { map, range, includes, intersection, some, without, isNull } from 'lodash';
import CN from 'classnames';
import { paymentTypeLabels } from 'pages/shared/bookings/data';
import css from './style.css';
import moment from 'moment';

import { isBbcCompanyType } from 'utils';
import { ddis, ddiLabels } from '../data';

const { Option } = Select;
const referencesLimit = 4;

// Payment terms value specifies how many days after creation the invoice becomes overdue.
const paymentTerms = [0, 7, 14, 30, 60, 90];

const cancellationFeeOptions = [0, 25, 50, 75, 100];

const costCentreLabelName = 'Cost Centre';

export default class CompanyForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    title: PropTypes.string,
    verifyConnection: PropTypes.func,
    companies: PropTypes.array,
    countries: PropTypes.array,
    loading: PropTypes.bool
  };

  save = this.save.bind(this);

  baseValidations = {
    // the reason why company name is also validated by personName validator is that
    // it is used as passenger name for affiliate orders.
    'name': ['presence', 'personName'],
    'companyType': 'presence',
    'address': ['presence', 'address'],
    'admin.firstName': 'presence',
    'admin.lastName': 'presence',
    'admin.phone': 'presence',
    'admin.email': ['presence', 'email'],
    'phoneBookingFee': ['presence', { numericality: { greaterThanOrEqualTo: 0 } }],
    'bookingFee': { numericality: { greaterThanOrEqualTo: 0 } },
    'handlingFee': { numericality: { greaterThanOrEqualTo: 0 } },
    'runInFee': { numericality: { greaterThanOrEqualTo: 0 } },
    'tips': { numericality: { greaterThanOrEqualTo: 0 } },
    'businessCredit': { numericality: { greaterThanOrEqualTo: 0 } },
    'gettCancellationBeforeArrivalFee': { numericality: { greaterThanOrEqualTo: 0 } },
    'gettCancellationAfterArrivalFee': { numericality: { greaterThanOrEqualTo: 0 } },
    'quotePriceIncreasePercentage': ['presence', { numericality: { greaterThanOrEqualTo: 0 } }],
    'quotePriceIncreasePounds': ['presence', { numericality: { greaterThanOrEqualTo: 0 } }],
    'internationalBookingFee': ['presence', { numericality: { greaterThanOrEqualTo: 0 } }],
    'systemFxRateIncreasePercentage': ['presence', { numericality: { greaterThanOrEqualTo: 0 } }],
    'paymentOptions.businessCredit': { numericality: { greaterThanOrEqualTo: 0 } },
    'gettBusinessId': ['presence', function() {
      if (!this.state.gettVerified && (this.isNew || this.gettBusinessIdUpdated)) {
        return 'Please click on verify button';
      }
    }],
    'customerCarePassword': function(value) {
      if (this.isCustomerCarePasswordRequired && !value) {
        return "can't be blank";
      }
    },
    'paymentOptions.invoicingSchedule': function() {
      const { paymentTypes, invoicingSchedule } = this.get('paymentOptions');

      if (includes(paymentTypes, 'account') && !invoicingSchedule) {
        return "can't be blank";
      }
    },
    'paymentOptions.paymentTerms': ['numericality', function() {
      const { paymentTypes, paymentTerms } = this.get('paymentOptions');

      if (includes(paymentTypes, 'account') && isNull(paymentTerms)) {
        return "can't be blank";
      }
    }],
    'paymentOptions.paymentTypes': 'presence',
    'paymentOptions.defaultPaymentType': 'presence',
    'ddi.type': 'presence',
    'countryCode': 'presence'
  };

  affiliateValidations = {
    'accountNumber': 'numericality',
    'sortCode': 'numericality'
  };

  bbcValidations = {
    'customAttributes.travelPolicyMileageLimit': 'numericality',
    'customAttributes.hwDeviationDistance': 'numericality',
    'customAttributes.p11d': 'numericality',
    'customAttributes.excessCostPerMile': 'numericality'
  };

  enterpriseValidations = {
    'otUsername': ['presence', function() {
      if (!this.state.otVerified && (this.isNew || this.otValuesUpdated)) {
        return 'Please click on verify button';
      }
    }],
    'otClientNumber': ['presence', function() {
      if (!this.state.otVerified && (this.isNew || this.otValuesUpdated)) {
        return 'Please click on verify button';
      }
    }]
  };

  validations() {
    const validations = { ...this.baseValidations };

    if (this.isEnterprise) {
      Object.assign(validations, this.enterpriseValidations);
    } else if (this.isAffiliate) {
      Object.assign(validations, this.affiliateValidations);
    }
    if (this.get('ddi.type') === 'custom') {
      validations['ddi.phone'] = ['presence', 'phoneNumber'];
    }
    if (this.isBbcCompany) { Object.assign(validations, this.bbcValidations); }

    if (this.isNew && (this.isAffiliate || !this.get('admin.onboarding'))) {
      validations['admin.password'] = ['presence', 'strongPassword'];
      validations['admin.passwordConfirmation'] = {
        presence: true,
        equality: { to: 'admin.password' }
      };
    }

    return validations;
  }

  validate($v) {
    super.validate($v);

    if (this.isEnterprise) {
      this.each('references', (ref, i) => {
        if (!ref.active) return;
        $v(`references.${i}.name`, { with: 'presence' });
      });
    }

    return $v.errors;
  }

  get isEnterprise() {
    const type = this.get('companyType');

    return type === 'enterprise' || this.isBbcCompany;
  }

  get isAffiliate() {
    return this.get('companyType') === 'affiliate';
  }

  get isBbcCompany() {
    const type = this.get('companyType');

    return isBbcCompanyType(type);
  }

  get isCustomerCarePasswordRequired() {
    return 'customerCarePasswordRequired' in this.state
      ? this.state.customerCarePasswordRequired
      : Boolean(this.props.attrs.customerCarePassword);
  }

  get isEditMode() {
    return Boolean(this.props.attrs.id);
  }

  changePaymentTypes(values) {
    if (includes(values, 'cash') && !includes(values, 'account')) {
      values = without(values, 'cash');
    }

    let defaultPaymentType = this.get('paymentOptions.defaultPaymentType');

    if (values.length === 1) {
      defaultPaymentType = values[0];
    } else if (!includes(values, defaultPaymentType)) {
      defaultPaymentType = null;
    }

    this.set({
      'paymentOptions.defaultPaymentType': defaultPaymentType,
      'paymentOptions.paymentTypes': values
    });
  }

  changeCompanyType(value) {
    if (value === 'affiliate') {
      const { paymentOptions, references, customAttributes } = this.get();

      this.rollbackEnterpriseSettings = (companyType) => {
        this.rollbackEnterpriseSettings = null;
        this.set({
          companyType,
          'paymentOptions.paymentTypes': paymentOptions.paymentTypes,
          'paymentOptions.defaultPaymentType': paymentOptions.defaultPaymentType,
          references,
          customAttributes: isBbcCompanyType(companyType) ? customAttributes : undefined
        });
      };

      this.set({
        'paymentOptions.paymentTypes': ['cash'],
        'paymentOptions.defaultPaymentType': 'cash',
        'companyType': value,
        'admin.onboarding': null,
        'references': undefined,
        'multipleBooking': false
      });
    } else {
      if (this.rollbackEnterpriseSettings) {
        this.rollbackEnterpriseSettings(value);
      } else {
        const nextAttrs = {
          'paymentOptions.paymentTypes': ['account', 'passenger_payment_card'],
          'paymentOptions.defaultPaymentType': 'account',
          'companyType': value
        };

        if (isBbcCompanyType(value)) {
          Object.assign(nextAttrs, {
            'hrFeedEnabled': false,
            'customAttributes.travelPolicyMileageLimit': '40',
            'customAttributes.excessCostPerMile': '1.6',
            'customAttributes.p11d': '65'
          });
        }

        this.set(nextAttrs);
      }
    }
  }

  changeOnboarding(value) {
    this.set({
      'admin.onboarding': value || null,
      'admin.password': ''
    });
  }

  changeGettBusinessId(value) {
    this.gettBusinessIdUpdated = true;

    this.setState({
      gettVerifying: false,
      gettVerified: false
    });

    this.set('gettBusinessId', value);
  }

  changeInvoicingSchedule(value) {
    this.set({
      'paymentOptions.invoicingSchedule': value,
      'paymentOptions.paymentTerms': null
    });
  }

  changeReferenceActive(i, value) {
    const nextAttrs = { [`references.${i}.active`]: value };
    const active = this.map('references', (ref, j) => i === j ? value : ref.active);

    if (!some(active)) {
      nextAttrs.bookingsValidationEnabled = false;
    }

    this.set(nextAttrs);
  }

  changeReferenceCostCentre(i, value) {
    this.set({
      [`references.${i}.costCentre`]: value,
      [`references.${i}.name`]: value ? costCentreLabelName : ''
    });
  }

  changeCustomerCarePasswordRequired = (e) => {
    const { checked } = e.target;
    const customerCarePassword = this.get('customerCarePassword');

    this.setState({ customerCarePasswordRequired: checked }, () => {
      if (checked && this.memoizedCustomerCarePassword) {
        this.set('customerCarePassword', this.memoizedCustomerCarePassword);
        this.memoizedCustomerCarePassword = null;
      }
      if (!checked) {
        if (customerCarePassword) {
          this.memoizedCustomerCarePassword = customerCarePassword;
        }

        this.set('customerCarePassword', '');
      }
    });
  };

  changeCreditRateRegistrationNumber(value) {
    this.set('creditRateRegistrationNumber', value || null);
  }

  verifyGett = () => {
    const { gettBusinessId, address: {lat, lng} } = this.get();

    this.setState({ gettVerifying: true });

    this.props.verifyConnection('gett', { gettBusinessId, latitude: lat, longitude: lng })
      .then(() => {
        this.updateErrors({ gettBusinessId: null });
        this.setState({ gettVerifying: false, gettVerified: true });
      }).catch(() => {
        this.updateErrors({ gettBusinessId: 'is invalid' });
        this.setState({ gettVerifying: false, gettVerified: false });
      });
  };

  changeOT(field, value) {
    this.otValuesUpdated = true;

    this.setState({
      otVerifying: false,
      otVerified: false
    });

    this.set(`ot${field}`, value);
  }

  verifyOT = () => {
    const { otUsername, otClientNumber } = this.get();

    this.setState({ otVerifying: true });

    this.props.verifyConnection('ot', { otUsername, otClientNumber })
      .then(() => {
        this.updateErrors({ otUsername: null, otClientNumber: null });
        this.setState({ otVerifying: false, otVerified: true });
      }).catch(() => {
        this.updateErrors({ otUsername: 'is invalid', otClientNumber: 'is invalid' });
        this.setState({ otVerifying: false, otVerified: false });
      });
  };

  handleFileUpload(i, info) {
    this.set({
      [`references.${i}.attachment`]: info.file.originFileObj,
      [`references.${i}.fileName`]: info.file.name
    });
  }

  handleRemoveAttachment = (i) => {
    this.set({
      [`references.${i}.attachment`]: null,
      [`references.${i}.attachmentUrl`]: '',
      [`references.${i}.fileName`]: ''
    });
  };

  getPaymentTermsOptions() {
    const invoicingSchedule = this.get('paymentOptions.invoicingSchedule');

    if (invoicingSchedule) {
      return paymentTerms.map(days => <Option key={ days }>{ days }</Option>);
    } else {
      return [];
    }
  }

  getCancellationFeeOptions() {
    return cancellationFeeOptions.map(percent => <Option key={ percent }>{ percent }%</Option>);
  }

  anyCostCentreSelected = () => {
    return some(this.get('references'), { costCentre: true });
  };

  getClosestPossibleCriticalFlagDueOn() {
    return moment().add(1, 'day');
  }

  isCriticalCompany() {
    return moment(this.get('criticalFlagDueOn')).isAfter(new Date());
  }

  toggleCriticalFlag = (checked) => {
    this.criticalFlagDueOnTouched = true;
    this.set('criticalFlagDueOn', checked ? this.getClosestPossibleCriticalFlagDueOn() : null);
  };

  changeCriticalFlagDueOn(dueOn) {
    this.criticalFlagDueOnTouched = true;
    this.set('criticalFlagDueOn', dueOn);
  }

  changeCountryCode(countryCode) {
    this.countryCodeTouched = true;
    this.set({ countryCode });
  }

  changeCompanyAddress(address) {
    const attrs = { address };

    // here presence of countryCode checked to distinguish address selection from search input
    if (!this.countryCodeTouched && address.countryCode) {
      attrs.countryCode = address.countryCode;
    }

    this.set(attrs);
  }

  renderCriticalFlagLabel() {
    return (
      `Critical Flag${
        this.isCriticalCompany() && !this.criticalFlagDueOnTouched
          ? ` (Enabled ${moment(this.get('criticalFlagEnabledAt')).format('DD/MM/YYYY hh:mm a')} by ${this.get('criticalFlagEnabledBy')})`
          : ''
      }`
    );
  }

  $render($) {
    const { title, companies: allCompanies, loading, countries, can } = this.props;
    const { gettVerifying, gettVerified, otVerifying, otVerified } = this.state;
    const gettReallyVerified = gettVerified || (!this.isNew && !this.gettBusinessIdUpdated);
    const otReallyVerified = otVerified || (!this.isNew && !this.otValuesUpdated);

    const paymentTypes = this.get('paymentOptions.paymentTypes') || [];
    const accountDisabled = !!intersection(paymentTypes, ['company_payment_card', 'passenger_payment_card_periodic']).length;
    const companyCardDisabled = !!intersection(paymentTypes, ['account', 'passenger_payment_card_periodic']).length;
    const passengerPaymentCardDisabled = includes(paymentTypes, 'passenger_payment_card_periodic');
    const passengerPaymentCardPeriodicDisabled = !!intersection(paymentTypes, ['account', 'company_payment_card', 'passenger_payment_card', 'cash']).length;
    const cashDisabled = this.isAffiliate || includes(paymentTypes, 'passenger_payment_card_periodic') || !includes(paymentTypes, 'account');
    const companies = allCompanies.filter(c => c.id != this.get('id') && c.companyType != 'affiliate');
    const showBusinessCreditInput = includes(paymentTypes, 'account') || includes(paymentTypes, 'company_payment_card');
    const disableBusinessCreditInput = this.get('id') ? this.get('paymentOptions.businessCreditExpended') : false;
    const disableBookingsValidation = !some(this.get('references'), { active: true });
    const disableHrFeed = this.isBbcCompany;
    const ddiType = this.get('ddi.type');

    return (
      <Fragment>
        <div className="text-20 mb-20">{ title }</div>

        <div className="layout horizontal wrap">
          <div className="flex mr-20 sm-mr-0 sm-full-width">
            <div className="mb-20 text-16 bold-text">Company Details</div>
            <Input { ...$('name') } className="mb-20" label="Company name" labelClassName="required mb-5" />
            <Select
              { ...$('companyType')(this.changeCompanyType) }
              className="block mb-20"
              disabled={ this.isEditMode }
              label="Company Type"
              labelClassName="required mb-5"
            >
              <Option value="enterprise">Enterprise</Option>
              <Option value="affiliate">Affiliate</Option>
              <Option value="bbc">BBC</Option>
            </Select>

            <AddressAutocomplete
              { ...$('address')(this.changeCompanyAddress) }
              className="block mb-20"
              label="Address"
              labelClassName="required mb-5"
            />

            <Select
              { ...$('countryCode')(this.changeCountryCode) }
              showSearch
              className="block mb-20"
              label="Country Origin"
              labelClassName="required mb-5"
              filterOption={ Select.caseInsensitiveFilter }
            >
              { countries.map(country => <Option key={ country.code }>{ country.name }</Option>) }
            </Select>
            <Input { ...$('vatNumber') } className="mb-20" label="VAT Number" labelClassName="mb-5" />
            { this.isAffiliate && [
              <Input key="an" { ...$('accountNumber') } className="mb-20" label="Account Number" labelClassName="mb-5" maxLength="8" />,
              <Input key="sc" { ...$('sortCode') } className="mb-20" label="Sort Code" labelClassName="mb-5" maxLength="6" /> ]
            }
            <UserSelector { ...$('salesmanId') } className="block mb-20" label="Sales Person Name" labelClassName="mb-5" />
            <UserSelector { ...$('accountManagerId') } className="block mb-20" label="Account Manager" labelClassName="mb-5" />
            <Input { ...$('costCentre') } className="mb-20" label="Cost Centre" labelClassName="mb-5" />
            <Input { ...$('legalName') } className="mb-20" label="Legal Company Name" labelClassName="mb-5" />
            <AddressAutocomplete
              { ...$('legalAddress') }
              className="block mb-20"
              label="Legal Address"
              labelClassName="mb-5"
            />
            { this.isEnterprise &&
              <Select
                { ...$('linkedCompanyPks') }
                mode="multiple"
                className={ `mb-20 ${css.select}` }
                placeholder="Please select companies"
                label="Subcompanies"
                labelClassName="mb-5"
                filterOption={ Select.caseInsensitiveFilter }
              >
                { companies.map(company => <Option key={ company.id }>{ company.name }</Option>) }
              </Select>
            }
            <div className="layout horizontal end mb-20">
              <Select { ...$('ddi.type') } className="flex mr-10" label="Assign DDI" labelClassName="mb-5">
                { ddis.map(ddi => <Option key={ ddi }>{ ddiLabels[ddi] }</Option>) }
              </Select>
              { ddiType === 'custom'
                ? <PhoneInput { ...$('ddi.phone') } className="flex" />
                : <div className="flex" />
              }
            </div>
            <label className="mb-5">Company Logo</label>
            <ImageEditor { ...$('logo') } fallbackUrl={ this.get('logoUrl') } className="mb-20">
              { url => <div data-name="companyLogo"><img src={ url } alt="" /></div> }
            </ImageEditor>
            <Checkbox onChange={ this.toggleCriticalFlag } value={ this.isCriticalCompany() } className="mb-20" name="criticalFlag">
              { this.renderCriticalFlagLabel() }
            </Checkbox>
            { this.isCriticalCompany() &&
              <div>
                <DatePicker
                  { ...$('criticalFlagDueOn')(this.changeCriticalFlagDueOn) }
                  className="mb-20"
                  allowClear={ false }
                  showToday={ false }
                  value={ moment(this.get('criticalFlagDueOn')) }
                  disabledDate={ date => date.isBefore(this.getClosestPossibleCriticalFlagDueOn(), 'day') }
                />
              </div>
            }
          </div>

          <div className="flex mr-20 sm-mr-0 sm-full-width">
            <div className="mb-20 text-16 bold-text">Payment Options</div>
            <Select
              { ...$('paymentOptions.paymentTypes')(this.changePaymentTypes) }
              mode="multiple"
              selectAll={ false }
              className="block mb-20"
              label="Payment Types"
              labelClassName="required mb-5"
            >
              { this.isEnterprise && <Option value="account" disabled={ accountDisabled }>Account</Option> }
              { this.isEnterprise && <Option value="company_payment_card" disabled={ companyCardDisabled }>Company payment card</Option> }
              { this.isEnterprise && <Option value="passenger_payment_card" disabled={ passengerPaymentCardDisabled }>Passenger's payment card</Option> }
              { this.isEnterprise && <Option value="passenger_payment_card_periodic" disabled={ passengerPaymentCardPeriodicDisabled }>Passenger's payment card periodic</Option> }
              <Option disabled={ cashDisabled } value="cash">Cash</Option>
            </Select>
            { this.isEnterprise &&
              <div>
                <Select
                  { ...$('paymentOptions.defaultPaymentType') }
                  className="block mb-20"
                  label="Default Payment Type"
                  disabled={ paymentTypes.length < 2 }
                  labelClassName="required mb-5"
                >
                  { map(without(paymentTypes, 'cash'), type => <Option value={ type } key={ type }>{ paymentTypeLabels[type] }</Option>) }
                </Select>

                <div className="layout horizontal mb-5">
                  <div className="flex mr-10">Booking Fee</div>
                  <div className="flex mr-10">Handling Fee</div>
                  <div className="flex">Invoicing Schedule</div>
                </div>
                <div className="layout horizontal mb-20">
                  <Input
                    { ...$('bookingFee') }
                    addonAfter="£"
                    className="flex mr-10"
                    errorClassName="static"
                  />
                  <Input
                    { ...$('handlingFee') }
                    addonAfter="%"
                    className="flex mr-10"
                    errorClassName="static"
                  />
                  <Select { ...$('paymentOptions.invoicingSchedule')(this.changeInvoicingSchedule) } disabled = { !can.changeInvoicingSchedule } className="flex">
                    <Option key="weekly">Weekly</Option>
                    <Option key="monthly">Monthly</Option>
                  </Select>
                </div>

                <div className="layout horizontal mb-5">
                  <div className="flex mr-10">Run In</div>
                  <div className="flex mr-10 required">Phone Booking Fee</div>
                  <div className="flex">Split Invoice</div>
                </div>
                <div className="layout horizontal mb-20">
                  <Input { ...$('runInFee') } addonAfter="£" className="flex mr-10" errorClassName="static" />
                  <Input
                    { ...$('phoneBookingFee') }
                    addonAfter="£"
                    className="flex mr-10"
                    errorClassName="static"
                  />
                  <Select { ...$('paymentOptions.splitInvoice') } className="flex">
                    <Option key="user">User</Option>
                    <Option key="department">Department</Option>
                    <Option key="reference">Reference</Option>
                  </Select>
                </div>

                <div className="layout horizontal mb-5">
                  <div className="flex mr-10">Tips</div>
                  { this.isEnterprise && showBusinessCreditInput &&
                    <div className="flex mr-10">Business Credit</div>
                  }
                  <div className="flex">Payment Terms</div>
                </div>
                <div className="layout horizontal mb-20">
                  <Input { ...$('tips') } addonAfter="%" className="flex mr-10" errorClassName="static" />
                  { this.isEnterprise && showBusinessCreditInput &&
                    <Input
                      { ...$('paymentOptions.businessCredit') }
                      addonAfter="£"
                      className="flex mr-10"
                      disabled={ disableBusinessCreditInput }
                      errorClassName="static"
                    />
                  }
                  <Select { ...$('paymentOptions.paymentTerms') } className="flex" >
                    { this.getPaymentTermsOptions() }
                  </Select>
                </div>

                <div className="layout horizontal mb-5">
                  <div className="flex mr-10">Gett Cancellation Before Arrival Fee</div>
                  <div className="flex">Gett Cancellation After Arrival Fee</div>
                </div>
                <div className="layout horizontal mb-20">
                  <Input
                    { ...$('gettCancellationBeforeArrivalFee') }
                    addonAfter="£"
                    className="flex mr-10"
                    errorClassName="static"
                  />
                  <Input
                    { ...$('gettCancellationAfterArrivalFee') }
                    addonAfter="£"
                    className="flex"
                    errorClassName="static"
                  />
                </div>

                <div className="layout horizontal end mb-20">
                  <Select { ...$('getECancellationBeforeArrivalFee') } className="flex mr-10" label="Get-E Cancellation Before Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                  <Select { ...$('getECancellationAfterArrivalFee') } className="flex" label="Get-E Cancellation After Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                </div>

                <div className="layout horizontal end mb-20">
                  <Select { ...$('cancellationBeforeArrivalFee') } className="flex mr-10" label="OT Cancellation Before Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                  <Select { ...$('cancellationAfterArrivalFee') } className="flex" label="OT Cancellation After Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                </div>

                <div className="layout horizontal end mb-20">
                  <Select { ...$('splytCancellationBeforeArrivalFee') } className="flex mr-10" label="Splyt Cancellation Before Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                  <Select { ...$('splytCancellationAfterArrivalFee') } className="flex" label="Splyt Cancellation After Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                </div>

                <div className="layout horizontal end mb-20">
                  <Select { ...$('careyCancellationBeforeArrivalFee') } className="flex mr-10" label="Carey Cancellation Before Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                  <Select { ...$('careyCancellationAfterArrivalFee') } className="flex" label="Carey Cancellation After Arrival Fee" labelClassName="mb-5">
                    { this.getCancellationFeeOptions() }
                  </Select>
                </div>

                <div className="layout horizontal mb-5">
                  <div className="flex mr-10">Quote Price Increase %</div>
                  <div className="flex">Quote Price Increase £</div>
                </div>
                <div className="layout horizontal mb-20">
                  <Input
                    { ...$('quotePriceIncreasePercentage') }
                    addonAfter="%"
                    className="flex mr-10"
                    errorClassName="static"
                  />
                  <Input
                    { ...$('quotePriceIncreasePounds') }
                    addonAfter="£"
                    className="flex"
                    errorClassName="static"
                  />
                </div>

                <Input { ...$('internationalBookingFee') } addonAfter="%" className="flex mb-20" label="International Booking Fee" labelClassName="mb-5" />
                <Input { ...$('systemFxRateIncreasePercentage') } addonAfter="%" className="flex mb-20" label="System FX Rate Increase" labelClassName="mb-5" />
                { this.isBbcCompany &&
                  <div>
                    <div className="layout horizontal end mb-20">
                      <Input { ...$('customAttributes.travelPolicyMileageLimit') } addonAfter="Mi" className="flex mr-10" label="Travel Policy Mileage Limit" labelClassName="mb-5" />
                      <Input { ...$('customAttributes.hwDeviationDistance') } addonAfter="Mi" className="flex" label="HW Deviation Distance" labelClassName="mb-5" />
                    </div>
                    <div className="layout horizontal end mb-20">
                      <Input { ...$('customAttributes.p11d') } addonAfter="%" className="flex mr-10" label="P11D %" labelClassName="mb-5" />
                      <Input { ...$('customAttributes.excessCostPerMile') } addonAfter="£" className="flex" label="Excess Cost Per Mile" labelClassName="mb-5" />
                    </div>
                  </div>
                }
                <Input { ...$('paymentOptions.additionalBillingRecipients') } className="mb-20" label="Additional Billing Recipients" labelClassName="mb-5" />
              </div>
            }
            <Input { ...$('sapId') } className="block mb-20" label="SAP ID" labelClassName="mb-5" autoComplete="off" />

            { this.get('companyType') !== 'affiliate' &&
              <div className="layout horizontal end mb-20">
                <Input { ...$('creditRateRegistrationNumber')(this.changeCreditRateRegistrationNumber) } className="flex mr-10" label="Company Registration Number" labelClassName="mb-5" />
                <Input { ...$('creditRateIncorporatedAt') } className="flex" label="Incorporated At" disabled labelClassName="mb-5" />
              </div>
            }

            <div className="mb-20 text-16 bold-text">Company Settings</div>
            <Checkbox { ...$('marketingAllowed') } className="mb-20">
              Marketing Allowed
            </Checkbox>
            { this.isEnterprise &&
              <span>
                <Checkbox { ...$('bookingsValidationEnabled') } className="mb-20" disabled={ disableBookingsValidation }>
                  Bookings Validation
                </Checkbox>
                <Checkbox { ...$('apiEnabled') } className="mb-20">
                    API Key
                  </Checkbox>
                <Tooltip placement="top" title="Enable/disable sending all notifications for orders made by API key">
                  <Checkbox { ...$('apiNotificationsEnabled') } className="mb-20" disabled={ !this.get('apiEnabled') }>
                    Allow Notifications
                  </Checkbox>
                </Tooltip>
                <Checkbox { ...$('multipleBooking') } className="mb-20">
                  Multiple Booking
                </Checkbox>
                <Checkbox { ...$('bookerNotifications') } className="mb-20">
                  Booker Notifications
                </Checkbox>
                <Checkbox { ...$('payrollRequired') } className="mb-20">
                  Mandatory "Payroll ID"
                </Checkbox>
                <Checkbox { ...$('costCentreRequired') } className="mb-20">
                  Mandatory "Payroll Cost Centre"
                </Checkbox>
                <Checkbox { ...$('hrFeedEnabled') } className="mb-20" disabled={ disableHrFeed }>
                  HR Feed
                </Checkbox>
                <Checkbox { ...$('allowPreferredVendor') } className="mb-20">
                  Allow Preferred Vendor
                </Checkbox>
              </span>
            }
            <TextArea
              { ...$('defaultDriverMessage') }
              rows={ 4 }
              className="mb-20"
              label="Default Driver Message"
              maxLength="100"
              labelClassName="mb-5"
            />
            { this.isEnterprise &&
              <TextArea
                { ...$('bookerNotificationsEmails') }
                autosize
                label="Default Booker Notifications Email(s)"
                className="mb-20"
                placeholder="Please, insert comma separated emails"
                labelClassName="mb-5"
              />
            }
            { this.isEnterprise &&
              <div>
                <div className="mb-20 text-16 bold-text">Manage Bookings Password Protection</div>
                <label className="mb-5">Password:</label>
                <div className="mb-10 layout horizontal center">
                  <AntCheckbox checked={ this.isCustomerCarePasswordRequired } onChange={ this.changeCustomerCarePasswordRequired } name="customerCareActive" data-name="customerCareActive" />
                  <Input
                    { ...$('customerCarePassword') }
                    className="ml-10 flex"
                    type={ this.get('customerCarePassword') ? 'password' : 'text' }
                    allowShowPassword
                    disabled={ !this.isCustomerCarePasswordRequired }
                    autoComplete="new-password"
                  />
                </div>
              </div>
            }
            { this.get('apiEnabled') && this.get('apiKey') &&
              <div>
                <div className="mb-20 text-16 bold-text">API Key</div>
                <code className="mb-10">{ this.get('apiKey') }</code>
              </div>
            }
          </div>

          <div className="flex sm-full-width">
            <div className="mb-20 text-16 bold-text">Admin Details</div>
            { this.isNew && this.get('companyType') !== 'affiliate' &&
              <Checkbox { ...$('admin.onboarding')(this.changeOnboarding) } className="mb-30 mt-35 sm-mb-20 sm-mt-0">On-boarding</Checkbox>
            }
            <Input { ...$('admin.firstName') } className="mb-20" label="First name" labelClassName="required mb-5" />
            <Input { ...$('admin.lastName') } className="mb-20" label="Second Name" labelClassName="required mb-5" />
            <PhoneInput
              { ...$('admin.phone') }
              className="mb-20"
              label="Phone Number"
              labelClassName="required mb-5"
            />
            <Input { ...$('admin.email') } className="mb-20" label="Email" labelClassName="required mb-5" />
            { this.isNew && !this.get('admin.onboarding') &&
              <div className="mb-20">
                <Input { ...$('admin.password') } label="Password" labelClassName="required mb-5" type="password" />
                <div className="mt-15">
                  Password must be at least 8 characters long and include at least 1 uppercase letter and 1 symbol
                </div>
                <Input { ...$('admin.passwordConfirmation') } className="mt-10" label="Confirm Password" labelClassName="required mb-5" type="password" />
              </div>
            }
            <div className="mb-20 text-16 bold-text">Connection Options</div>

            <div className="layout horizontal mb-20">
              <Input
                { ...$('gettBusinessId')(this.changeGettBusinessId) }
                className="flex"
                label="Gett ID"
                labelClassName="mb-5 required"
                disabled={ gettVerifying }
              />
              <Button
                className={ CN('ml-5 mt-23', css.verify, { [css.verified]: gettReallyVerified }) }
                type="primary"
                icon="check"
                loading={ gettVerifying }
                onClick={ this.verifyGett }
                disabled={ !this.get('gettBusinessId') || gettReallyVerified }
                data-name="gettVerify"
              >
                { gettReallyVerified ? 'Verified' : 'Verify' }
              </Button>
            </div>

            { this.isEnterprise &&
              <div>
                <label className="mb-5 required">One Transport:</label>
                <div className="layout horizontal mb-20">
                  <Input
                    { ...$('otUsername')(this.changeOT, 'Username') }
                    className="flex mr-5"
                    placeholder="Username *"
                    disabled={ otVerifying }
                  />
                  <Input
                    { ...$('otClientNumber')(this.changeOT, 'ClientNumber') }
                    className="flex"
                    placeholder="Client Number *"
                    disabled={ otVerifying }
                  />
                  <Button
                    className={ CN('ml-5', css.verify, { [css.verified]: otReallyVerified }) }
                    type="primary"
                    icon="check"
                    loading={ otVerifying }
                    onClick={ this.verifyOT }
                    disabled={ !this.get('otUsername') || !this.get('otClientNumber') || otReallyVerified }
                    data-name="otVerify"
                  >
                    { otReallyVerified ? 'Verified' : 'Verify' }
                  </Button>
                </div>
                <div className="mb-20 text-16 bold-text">Reference Options</div>
                { range(referencesLimit).map(i => (
                  <ReferenceOption
                    key={ i }
                    $={ input => $(`references.${i}.${input}`) }
                    index={ i }
                    handleFileUpload={ this.handleFileUpload }
                    handleRemoveAttachment={ this.handleRemoveAttachment }
                    changeReferenceActive={ this.changeReferenceActive }
                    changeReferenceCostCentre={ this.changeReferenceCostCentre }
                    anyCostCentreSelected={ this.anyCostCentreSelected }
                    reference={ this.get(`references.${i}`) }
                  />
                )) }
              </div>
            }
          </div>
        </div>

        <Row type="flex" justify="end" className="border-top pt-20 mb-40 layout xs-center-justified">
          <ButtonLink type="secondary" className="mr-10" to="/companies" data-name="cancel">
            <Desktop><Icon className="text-20 mr-10" icon="MdClose" /></Desktop>
            Cancel
          </ButtonLink>
          <Button type="primary" onClick={ this.save } loading={ loading } data-name="saveCompany">
            <Desktop><Icon className="text-20 mr-10" icon="MdAdd" /></Desktop>
            { this.get('id') ? 'Update Company' : 'Add Company' }
          </Button>
        </Row>
      </Fragment>
    );
  }
}
