import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Alert, Tooltip } from 'antd';
import Form, { Input, Select, ImageEditor, AddressAutocomplete, Switch, TimePicker } from 'components/form';
import MemberFormBlock from 'pages/shared/members/MemberFormBlock';
import { Avatar, ButtonLink, Button } from 'components';
import { isEmpty } from 'lodash';
import moment from 'moment';
import { calculateExcessDistance } from './utils';
import { isBbcCompanyType, gettAnalytics } from 'utils';

import CN from 'classnames';
import css from './style.css';

const { Option } = Select;

const bookerRoles = ['booker', 'admin', 'finance', 'travelmanager'];

function isBookerRole(role) {
  return bookerRoles.includes(role);
}

export default class PassengerForm extends Form {
  static propTypes = {
    ...Form.propTypes,
    loading: PropTypes.bool,
    data: PropTypes.shape({
      memberId: PropTypes.number,
      bookers: PropTypes.arrayOf(PropTypes.object),
      workRoles: PropTypes.arrayOf(PropTypes.object),
      departments: PropTypes.arrayOf(PropTypes.object),
      memberRoles: PropTypes.arrayOf(PropTypes.string),
      companyType: PropTypes.string,
      can: PropTypes.shape({
        editBbcAttrs: PropTypes.bool,
        assignBookers: PropTypes.bool,
        assignSelf: PropTypes.bool,
        acceptPd: PropTypes.bool,
        changePd: PropTypes.bool,
        changeWheelchair: PropTypes.bool
      })
    }),
    backTo: PropTypes.string,
    isAdminPage: PropTypes.bool,
    companyName: PropTypes.string
  };

  static defaultProps = {
    ...Form.defaultProps,
    backTo: '/passengers'
  };

  validations() {
    const { can, payrollRequired, costCentreRequired } = this.props.data;
    const validations = {
      email: {
        presence: { message: 'Please add in the passengers email' },
        email: true
      },
      firstName: {
        presence: { message: 'Please add in the passengers first name' },
        personName: { length: 30 }
      },
      lastName: {
        presence: { message: 'Please add in the passengers last name' },
        personName: { length: 30 }
      },
      phone: {
        presence: { message: 'Please add in the passengers phone number' },
        phoneNumber: true
      },
      mobile: 'phoneNumber'
    };

    if (payrollRequired && can.changePayroll) {
      validations.payroll = 'presence';
    }

    if (costCentreRequired && can.changeCostCentre) {
      validations.costCentre = 'presence';
    }

    if (this.isBbcCompany) {
      validations['customAttributes.pdType'] = 'presence';
      validations['customAttributes.allowedExcessMileage'] = 'numericality';

      if (this.get('customAttributes.pdType') === 'staff' && this.get('customAttributes.whTravel')) {
        validations['homeAddress'] = 'presence';
      }

      if (this.get('customAttributes.whTravel')) {
        validations['workAddress'] = 'presence';
      }

      if (this.get('customAttributes.whTravel')) {
        Object.assign(validations, {
          'customAttributes.hwExemptionTimeFrom': 'presence',
          'customAttributes.hwExemptionTimeTo': 'presence',
          'customAttributes.whExemptionTimeFrom': 'presence',
          'customAttributes.whExemptionTimeTo': 'presence'
        });
      }

      validations['customAttributes.pdAccepted'] = function(pdAccepted) {
        const pdAcceptedAt = this.get('customAttributes.pdAcceptedAt');

        if (can.acceptPd && pdAcceptedAt != null && !pdAccepted) {
          return 'You must Accept the Passenger Declaration';
        }
      };
    }

    return validations;
  }

  save = this.save.bind(this);

  get isBbcCompany() {
    const { companyType } = this.props.data;

    return isBbcCompanyType(companyType);
  }

  get isHomeAddressPresent() {
    return Boolean(this.get('homeAddress.lat'));
  }

  get isWorkAddressPresent() {
    return Boolean(this.get('workAddress.lat'));
  }

  sendAnalyticsEvent = (value) => {
    const { attrs: { id: userId }, data: { memberId: bookerId }, companyName } = this.props;
    const newStatus = value ? 'active' : 'non-active';

    gettAnalytics('company_web|passengers|edit|active_toggle', { userId, bookerId, companyName, newStatus });
  };

  changeActive(value) {
    this.sendAnalyticsEvent(value);
    if (value && this.rollbackAssociatedPks) {
      return this.rollbackAssociatedPks();
    }

    const currentBookerPks = this.get('bookerPks');
    const currentPassengerPks = this.get('passengerPks');
    const attrs = { active: value };

    if (!value && currentBookerPks.length) {
      this.rollbackAssociatedPks = () => {
        this.rollbackAssociatedPks = null;

        this.set({
          active: true,
          bookerPks: currentBookerPks,
          passengerPks: currentPassengerPks
        });
      };
      attrs.bookerPks = [];
      attrs.passengerPks = [];
    }

    attrs.hideReinvite = true;
    this.set(attrs);
  }

  changeOnboarding(value) {
    this.mutableOnboarding = true;
    this.set('onboarding', value ? value : null);
  }

  changeRole(value) {
    const attrs = { roleType: value };
    const currentPassengerPks = this.get('passengerPks');

    if (!isBookerRole(this.get('roleType')) && isBookerRole(value) && this.rollbackPassengerPks) {
      return this.rollbackPassengerPks(value);
    }

    if (!isBookerRole(value) && !isEmpty(currentPassengerPks)) {
      this.rollbackPassengerPks = (value) => {
        this.rollbackPassengerPks = null;

        this.set({
          roleType: value,
          passengerPks: currentPassengerPks
        });
      };
      attrs.passengerPks = [];
    }

    this.set(attrs);
  }

  changeVip(value) {
    const nextAttrs = { vip: value };

    if (!value) {
      nextAttrs.allowPreferredVendor = false;
    }

    this.set(nextAttrs);
  }

  changeAddress(field, value) {
    this.set({
      'customAttributes.pdAccepted': false,
      'customAttribAttributes.pdStatus': this.calculatePdStatus({ pdAccepted: false }),
      [field]: value
    }).then(this.updateExcessDistance);
  }

  changeBookerPks(value) {
    if (!value.length) {
      // if "Deselect All" option was clicked, need to keep bookers that have
      // `assignedToAllPassenger` set to true
      value = this.props.data.bookers
        .filter(booker => booker.assignedToAllPassengers)
        .map(booker => booker.id);
    }

    this.set('bookerPks', value);
  }

  calculatePdStatus(options) {
    const whTravel = options.whTravel || this.get('customAttributes.whTravel');
    const pdAccepted = options.pdAccepted || this.get('customAttributes.pdAccepted');
    const pdType = options.pdType || this.get('customAttributes.pdType');

    const staffPdType = pdType === 'staff';
    const freelancerPdType = pdType === 'freelancer';

    if (staffPdType && !pdAccepted) { return 'bbc_temp'; }
    if (staffPdType && pdAccepted && !whTravel) { return 'bbc_thin'; }
    if (staffPdType && pdAccepted && whTravel) { return 'bbc_full'; }
    if (freelancerPdType) { return 'freelancer'; }
  }

  changePdAccepted(value) {
    this.set({
      'customAttributes.pdAccepted': value,
      'customAttributes.pdStatus': this.calculatePdStatus({ pdAccepted: value })
    });
  }

  changeWhTravel(value) {
    const nextAttrs = {
      'customAttributes.whTravel': value,
      'customAttributes.pdAccepted': false,
      'customAttributes.pdStatus': this.calculatePdStatus({ whTravel: value })
    };

    if (value) {
      Object.assign(nextAttrs, {
        'customAttributes.hwExemptionTimeFrom': '22:00',
        'customAttributes.hwExemptionTimeTo': '06:30',
        'customAttributes.whExemptionTimeFrom': '22:45',
        'customAttributes.whExemptionTimeTo': '06:30'
      });

      if (!isEmpty(this.previousHomeAddress)) {
        nextAttrs['homeAddress'] = this.previousHomeAddress;
      }
    } else {
      this.previousHomeAddress = this.get('homeAddress');

      nextAttrs['homeAddress'] = {};
    }

    this.set(nextAttrs);
  }

  updateExcessDistance = () => {
    const { isAdminPage, data: { can } } = this.props;
    const homeAddress = this.get('homeAddress');
    const workAddress = this.get('workAddress');

    if (
      isAdminPage ||
      this.get('customAttributes.pdType') !== 'staff' ||
      !this.get('customAttributes.whTravel') ||
      !can.acceptPd ||
      !this.isHomeAddressPresent ||
      !this.isWorkAddressPresent
    ) { return; }

    calculateExcessDistance(homeAddress, workAddress)
      .then(excess => this.setState({ excess }));
  };

  getBbcPdStatus() {
    return this.get('customAttributes.pdStatus');
  }

  isBbcFullPd() {
    return this.getBbcPdStatus() === 'bbc_full';
  }

  isBbcThinPd() {
    return this.getBbcPdStatus() === 'bbc_thin';
  }

  isBbcTempPd() {
    return this.getBbcPdStatus() === 'bbc_temp';
  }

  isBbcFreelancer() {
    return this.getBbcPdStatus() === 'freelancer';
  }

  canSee(field) {
    const { can } = this.props.data;
    const whTravelEnabled = this.get('customAttributes.whTravel');

    // TODO: fix/reconsider logic after finish BBC-testing
    // now BBC want's to see/change whTravel (and related attrs) by any user
    // but final solution should be: only FullPD can change this attrs

    switch (field) {
      case 'customAttributes.whTravel':
        return true;

      case 'customAttributes.exemptionP11d':
        return whTravelEnabled;

      case 'customAttributes.exemptionWwCharges':
        return !this.isBbcFreelancer() || can.editBbcAttrs;

      case 'customAttributes.exemptionWhHwCharges':
        return whTravelEnabled;

      case 'customAttributes.hwwhExemptionTime':
        return whTravelEnabled;

      case 'customAttributes.allowedExcessMileage':
        return whTravelEnabled;

      default:
        return false;
    }
  }

  canEdit(field) {
    const { can } = this.props.data;

    if (can.editBbcAttrs) { return true; }

    if (field === 'customAttributes.whTravel') {
      // TODO: remove after getting approve from BBC-customer
      // now BBC want's to see/change whTravel by any user
      // but final solution should be: only FullPD can change this attr
      // return this.isBbcFullPd();
      return true;
    }

    if (field === 'customAttributes.pdAccepted') {
      const whTravelEnabled = this.get('customAttributes.whTravel');

      return (whTravelEnabled && this.isHomeAddressPresent && this.isWorkAddressPresent) ||
        (!whTravelEnabled && this.isWorkAddressPresent);
    }

    return false;
  }

  renderActive() {
    return (
      <Tooltip
        placement="left"
        title={ this.get('active')
          ? 'Deactivate to stop passenger from making bookings'
          : 'Activate to allow passenger to make bookings'
        }
      >
        <div className="layout horizontal center mb-20">
          <Switch { ...this.$('active')(this.changeActive) } />
          <div className="ml-20">Active</div>
        </div>
      </Tooltip>
    );
  }

  renderOnboarding() {
    return (
      this.get('onboarding') === false
      ? <div className="layout horizontal center mb-20">
          <div>Onboarded</div>
        </div>
      : <Tooltip placement="left" title="Invite passenger to join the platform and set a password">
          <div className="layout horizontal center mb-20">
            <Switch
              { ...this.$('onboarding')(this.changeOnboarding) }
              disabled={ !this.mutableOnboarding && !this.isNew && this.get('onboarding') }
            />
            <div className="ml-20">Onboarding</div>
          </div>
        </Tooltip>
    );
  }

  renderPd() {
    if (!this.props.data.can.acceptPd || this.get('customAttributes.pdType') !== 'staff') { return; }

    const whTravel = this.get('customAttributes.whTravel');

    return (
      <div data-name="passengerDeclaration">
        <h4>Passenger Declaration</h4>
        { whTravel ? this.renderFullPd() : this.renderThinPd() }
        <div className="layout horizontal mt-20 mb-20">
          <Switch disabled={ !this.canEdit('customAttributes.pdAccepted') } { ...this.$('customAttributes.pdAccepted')(this.changePdAccepted) } />
          <div className="ml-20">I Accept the Passenger Declaration</div>
        </div>
      </div>
    );
  }

  renderThinPd() {
    return (
      <div>
        I certify that the information I have provided here accurately
        states my normal home address and normal place of work as required
        within the Late Night/Early Morning transport policy.
      </div>
    );
  }

  renderFullPd() {
    const { excessCostPerMile, travelPolicyMileageLimit } = this.props.data.companyCustomAttributes;
    const { excess } = this.state;
    const homeAddress = this.get('homeAddress') || {};
    const workAddress = this.get('workAddress') || {};
    const formattedCost = (excess && excess.cost || 0).toFixed(2);
    const formattedExcessCost = (excess && excess.excessCost || 0).toFixed(2);

    return (
      <div>
        { excess &&
          <div>
            Your journey from<br />
            <strong>{ workAddress.line }</strong><br />
            to<br />
            <strong>{ homeAddress.line }</strong><br />
            has been calculated as { excess.distance } miles. The estimated cost of this
            journey is £{ formattedCost } of which the cost beyond the { travelPolicyMileageLimit } mile limit is
            calculated as £{ formattedExcessCost }. The cost will be reduced if the vehicle is shared.
          </div>
        }
        I agree that:<br />
        I will share a vehicle with another BBC member of staff if required, within the rules of the Cab-Share scheme.<br />
        I will authorise the BBC to deduct from my salary the excess distance cost of <strong>£{ formattedExcessCost }</strong>, less any deduction for cab-sharing for any Late night/early morning transport journey.<br />
        I authorise the BBC to deduct from my salary the full cost of any Home to work/work to home journey that falls outside the Late night/early morning hours.<br />
        I further authorise the BBC, for any work to work journey over { travelPolicyMileageLimit } miles, to deduct from my salary the over { travelPolicyMileageLimit } miles portion of that journey at £{ excessCostPerMile } per mile.<br />
        I understand that if I believe that an out of hours Home to work/Work to home journey was necessary due to exceptional reasons, I can contact my divisional authoriser:<br />
        <a target="_blank" rel="noopener noreferrer" href="https://intranet.gateway.bbc.co.uk/travel-and-delivery/taxis/Pages/passenger-declaration-help.aspx">https://intranet.gateway.bbc.co.uk/travel-and-delivery/taxis/Pages/passenger-declaration-help.aspx</a><br />
        to see if they concur and that they may agree that the cost should be charged to the BBC and not deducted from my salary.<br />
        I understand that a passenger declaration is required for minicab journeys to/from my home to ensure that the BBC is meeting its tax obligations, that my home address is required as part of this declaration and is essential in order to collect or drop me off at my home address. I understand that the prefix of my home address may also be used for verification purposes to ensure that the BBC is meeting its tax obligations with regard to the use of work/work minicabs to/from employees’ home addresses. Read more about the use of personal data for <a target="_blank" rel="noopener noreferrer" href="https://intranet.gateway.bbc.co.uk/travel-and-delivery/taxis/Pages/passenger-declaration-help.aspx">travel bookings</a>.<br />
        <br />
        <strong>I certify that the information I have provided here accurately states my normal home address and normal place of work as required within the Late Night/Early Morning transport policy.</strong>
      </div>
    );
  }

  renderBbcSwitches($) {
    if (this.get('customAttributes.pdType') !== 'staff') { return; }
    const { data: { can } } = this.props;

    return (
      <div>
        { this.canSee('customAttributes.whTravel') &&
          <div className="layout horizontal center mb-20">
            <Switch { ...$('customAttributes.whTravel')(this.changeWhTravel) } disabled={ !this.canEdit('customAttributes.whTravel') } />
            <div className="ml-20">Enable Travel To/From Home</div>
          </div>
        }
        { this.canSee('customAttributes.exemptionP11d') &&
          <div className="layout horizontal center mb-20">
            <Switch { ...$('customAttributes.exemptionP11d') } disabled={ !this.canEdit('customAttributes.exemptionP11d') } />
            <div className="ml-20">Exemption: P11D</div>
          </div>
        }
        { this.canSee('customAttributes.exemptionWwCharges') &&
          <div className="layout horizontal center mb-20">
            <Switch { ...$('customAttributes.exemptionWwCharges') } disabled={ !this.canEdit('customAttributes.exemptionWwCharges') }  />
            <div className="ml-20">Exemption: WW Salary Charges</div>
          </div>
        }
        { this.canSee('customAttributes.exemptionWhHwCharges') &&
          <div className="layout horizontal center mb-20">
            <Switch { ...$('customAttributes.exemptionWhHwCharges') } disabled={ !this.canEdit('customAttributes.exemptionWhHwCharges') } />
            <div className="ml-20">Exemption: WH/HW Salary Charges</div>
          </div>
        }

        { this.canSee('customAttributes.hwwhExemptionTime') &&
          <div>
            <div>Home to Work Exemption Time</div>
            <div className="layout horizontal center mb-20">
              <TimePicker { ...$('customAttributes.hwExemptionTimeFrom') } disabled={ !this.canEdit('customAttributes.hwwhExemptionTime') } mode="string" />
              <div className="ml-5 mr-5">to</div>
              <TimePicker { ...$('customAttributes.hwExemptionTimeTo') } disabled={ !this.canEdit('customAttributes.hwwhExemptionTime') } mode="string" />
            </div>

            <div>Work to Home Exemption Time</div>
            <div className="layout horizontal center mb-20">
              <TimePicker { ...$('customAttributes.whExemptionTimeFrom') } disabled={ !this.canEdit('customAttributes.hwwhExemptionTime') } mode="string" />
              <div className="ml-5 mr-5">to</div>
              <TimePicker { ...$('customAttributes.whExemptionTimeTo') } disabled={ !this.canEdit('customAttributes.hwwhExemptionTime') } mode="string" />
            </div>
          </div>
        }
        { this.canSee('customAttributes.allowedExcessMileage') &&
          <div>
            <Input
              { ...$('customAttributes.allowedExcessMileage') }
              className="mb-20"
              label="Excess Mileage"
              labelClassName="mb-5"
              disabled={ !can.editBbcAttrs }
            />
          </div>
        }
      </div>
    );
  }

  $render($) {
    const {
      loading,
      onReinvite,
      backTo,
      isAdminPage,
      attrs,
      data: {
        memberId,
        bookers,
        passengers,
        workRoles,
        departments,
        memberRoles,
        can,
        payrollRequired,
        costCentreRequired,
        locations
      }
    } = this.props;

    const pdExpiresAt = this.get('customAttributes.pdExpiresAt');

    return (
      <div>
        <Row type="flex" justify="end" className={ CN('layout', css.actionButtons, css.editInfoButtons) }>
          <ButtonLink type="secondary" className="mr-10" to={ backTo } data-name="cancel">
            Reset
          </ButtonLink>
          <Button type="primary" onClick={ this.save } loading={ loading } data-name="savePassenger">
            { this.get('id') ? 'Update' : 'Add' }
          </Button>
        </Row>
        <Row type="flex">
          <Col md={ { span: 15, order: 0 } } sm={ { span: 15, order: 0 } } xs={ { span: 24, order: 1 } } className="contentContainer mb-20">
            <MemberFormBlock
              $={ $ }
              attrs={ attrs }
              can={ can }
              roles={ memberRoles }
              onRoleChange={ this.changeRole }
              workRoles={ workRoles }
              departments={ departments }
              isBbcCompany={ this.isBbcCompany }
            />
            { can.editAll &&
              <Row type="flex" gutter={ 20 } className="pl-30 pr-30">
                <Col md={ 24 } xs={ 24 }>
                  <AddressAutocomplete
                    { ...$('homeAddress')(this.changeAddress, 'homeAddress') }
                    className={ CN('mb-20', css.addressValue) }
                    label="Home address"
                    labelClassName="mb-5"
                    disabled={ this.isBbcCompany && !this.get('customAttributes.whTravel') }
                  />
                  <AddressAutocomplete
                    { ...$('workAddress')(this.changeAddress, 'workAddress') }
                    companyLocations={ locations }
                    className={ CN('mb-20', css.addressValue) }
                    label="Work address"
                    labelClassName="mb-5"
                  />

                  { this.rollbackAssociatedPks &&
                    <Alert
                      message="Warning"
                      description="Deactivating this passenger will unassign them from all bookers and passengers"
                      type="warning"
                      showIcon
                    />
                  }

                  { (!isAdminPage && can.assignSelf)
                    ? <Select
                        { ...$('selfAssigned') }
                        allowClear
                        className={ `mb-20 ${css.select}` }
                        placeholder="Please select bookers"
                        label="Bookers"
                        labelClassName="mb-5"
                        dataName="bookerPks"
                      >
                        <Option key={ memberId }>{ `${bookers[0].firstName} ${bookers[0].lastName}` }</Option>
                      </Select>
                    : <Select
                        { ...$('bookerPks')(this.changeBookerPks) }
                        mode="multiple"
                        className={ `mb-20 ${css.select}` }
                        placeholder="Please select bookers"
                        label="Bookers"
                        labelClassName="mb-5"
                        disabled={ !can.assignBookers || !this.get('active') }
                        filterOption={ Select.caseInsensitiveFilter }
                      >
                        { bookers.map(booker =>
                            <Option disabled={ booker.assignedToAllPassengers } key={ booker.id }>{ `${booker.firstName} ${booker.lastName}` }</Option>
                          )
                        }
                      </Select>
                  }

                  { this.rollbackPassengerPks &&
                    <Alert
                      message="Warning"
                      description="Changing role of this user will unassign them from all passengers"
                      type="warning"
                      showIcon
                    />
                  }

                  { isAdminPage && isBookerRole(this.get('roleType')) &&
                    <Select
                      { ...$('passengerPks') }
                      mode="multiple"
                      className={ `mb-20 ${css.select}` }
                      placeholder="Please select passengers"
                      label="Passengers"
                      labelClassName="mb-5"
                      disabled={ !this.get('active') }
                      filterOption={ Select.caseInsensitiveFilter }
                    >
                      { passengers.map(pass =>
                          <Option key={ pass.id }>{ `${pass.firstName} ${pass.lastName}` }</Option>
                        )
                      }
                    </Select>
                  }

                  <Row type="flex" gutter={ 20 }>
                    <Col md={ 8 } xs={ 24 }>
                      <Input
                        { ...$('payroll') }
                        className="mb-20"
                        label="Payroll ID"
                        labelClassName={ CN('mb-5', { required: payrollRequired }) }
                        disabled={ !can.changePayroll }
                      />
                    </Col>
                    <Col md={ 8 } xs={ 24 }>
                      <Input
                        { ...$('costCentre') }
                        className="mb-20"
                        label="Cost centre"
                        labelClassName={ CN('mb-5', { required: costCentreRequired }) }
                        disabled={ !can.changeCostCentre }
                      />
                    </Col>
                    <Col md={ 8 } xs={ 24 }>
                      <Input { ...$('division') } className="mb-20" label="Division" labelClassName="mb-5" disabled={ !can.changeDivision } />
                    </Col>
                  </Row>

                  { this.isBbcCompany && this.renderPd() }
                </Col>
              </Row>
            }
          </Col>

          <Col md={ { span: 8, push: 1 } } sm={ { span: 8, push: 1 } } xs={ 24 } className="text-center contentContainer mb-20">
            <ImageEditor { ...$('avatar') } uploadText={ this.get('avatarUrl') ? 'Edit' : 'Add' }>
              <Avatar className="mb-20 center-block" name={ `${ this.get('firstName') } ${ this.get('lastName') }` } src={ this.get('avatar') || this.get('avatarUrl') } />
            </ImageEditor>

            { can.reinvite && this.get('active') && !this.get('hideReinvite') &&
              <Tooltip placement="left" title="Resend the onboarding invitation">
                <Button size="small" className="mt-10" onClick={ onReinvite } type="secondary">Reinvite</Button>
              </Tooltip>
            }

            <div className="layout horizontal text-left center-center mt-20">
              <div>
                { can.changeActive && this.renderActive() }
                { can.editAll &&
                  <div>
                    { this.renderOnboarding() }
                    <Tooltip
                      placement="left"
                      title={ this.get('notifyWithSms') ? 'Disable SMS notifications' : 'Enable to receive SMS notifications' }
                    >
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('notifyWithSms') } />
                        <div className="ml-20">Receives SMS notifications</div>
                      </div>
                    </Tooltip>
                    <Tooltip
                      placement="left"
                      title={ this.get('notifyWithEmail') ? 'Disable Email notifications' : 'Enable to receive Email notifications' }
                    >
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('notifyWithEmail') } />
                        <div className="ml-20">Receives Email notifications</div>
                      </div>
                    </Tooltip>
                    <Tooltip
                      placement="left"
                      title={ this.get('notifyWithPush') ? 'Disable Push notifications' : 'Enable to receive Push notifications' }
                    >
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('notifyWithPush') } />
                        <div className="ml-20">Receives Push notifications</div>
                      </div>
                    </Tooltip>
                    <div className="layout horizontal mb-20">
                      <Switch { ...$('wheelchairUser') } disabled={ !can.changeWheelchair } />
                      <div className="ml-20">Wheelchair User</div>
                    </div>
                    <div className="layout horizontal mb-20">
                      <Switch { ...$('notifyWithCalendarEvent') } />
                      <div className="ml-20">Outlook Calendar Events</div>
                    </div>
                    { isAdminPage &&
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('vip')(this.changeVip) } />
                        <div className="ml-20">VIP</div>
                      </div>
                    }
                    { isAdminPage && this.get('vip') &&
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('allowPreferredVendor') } />
                        <div className="ml-20">Allow Preferred Vendor</div>
                      </div>
                    }
                    { can.changePersonalCardUsage &&
                      <div className="layout horizontal mb-20">
                        <Switch { ...$('allowPersonalCardUsage') } />
                        <div className="ml-20">Allow My Bookers to place orders under personal credit card</div>
                      </div>
                    }
                    { this.isBbcCompany && this.renderBbcSwitches($) }
                  </div>
                }
                { pdExpiresAt && <div data-name="pdExpiryDate">PD Expiry Date: { moment(pdExpiresAt).format('DD/MM/YYYY') }</div> }
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
